package websocket

import (
	"context"
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/sid-romero/fleetpulse/internal/domain"
	"nhooyr.io/websocket"
	"nhooyr.io/websocket/wsjson"
)

// MessageType defines WebSocket message types
type MessageType string

const (
	MessageTypeTelemetry   MessageType = "telemetry"
	MessageTypeAlert       MessageType = "alert"
	MessageTypeVehicle     MessageType = "vehicle"
	MessageTypeStats       MessageType = "stats"
	MessageTypeSubscribe   MessageType = "subscribe"
	MessageTypeUnsubscribe MessageType = "unsubscribe"
	MessageTypePing        MessageType = "ping"
	MessageTypePong        MessageType = "pong"
)

// Message represents a WebSocket message
type Message struct {
	Type      MessageType     `json:"type"`
	Timestamp time.Time       `json:"timestamp"`
	Data      json.RawMessage `json:"data,omitempty"`
}

// Client represents a connected WebSocket client
type Client struct {
	ID            uuid.UUID
	Conn          *websocket.Conn
	Hub           *Hub
	Subscriptions map[string]bool // channels subscribed to
	Send          chan Message
	mu            sync.RWMutex
}

// Hub manages WebSocket connections and broadcasting
type Hub struct {
	clients    map[uuid.UUID]*Client
	broadcast  chan Message
	register   chan *Client
	unregister chan *Client
	logger     zerolog.Logger
	mu         sync.RWMutex
}

// NewHub creates a new WebSocket hub
func NewHub(logger zerolog.Logger) *Hub {
	return &Hub{
		clients:    make(map[uuid.UUID]*Client),
		broadcast:  make(chan Message, 256),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		logger:     logger,
	}
}

// Run starts the hub's main loop
func (h *Hub) Run(ctx context.Context) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			h.logger.Info().Msg("WebSocket hub shutting down")
			h.mu.Lock()
			for _, client := range h.clients {
				close(client.Send)
			}
			h.mu.Unlock()
			return

		case client := <-h.register:
			h.mu.Lock()
			h.clients[client.ID] = client
			h.mu.Unlock()
			h.logger.Info().
				Str("clientId", client.ID.String()).
				Int("totalClients", len(h.clients)).
				Msg("Client connected")

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client.ID]; ok {
				delete(h.clients, client.ID)
				close(client.Send)
			}
			h.mu.Unlock()
			h.logger.Info().
				Str("clientId", client.ID.String()).
				Int("totalClients", len(h.clients)).
				Msg("Client disconnected")

		case message := <-h.broadcast:
			h.mu.RLock()
			for _, client := range h.clients {
				select {
				case client.Send <- message:
				default:
					// Client buffer full, disconnect
					h.mu.RUnlock()
					h.unregister <- client
					h.mu.RLock()
				}
			}
			h.mu.RUnlock()

		case <-ticker.C:
			// Send periodic ping to all clients
			h.BroadcastPing()
		}
	}
}

// HandleWebSocket handles WebSocket upgrade requests
func (h *Hub) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		OriginPatterns: []string{"*"}, // Configure based on environment
	})
	if err != nil {
		h.logger.Error().Err(err).Msg("Failed to accept WebSocket connection")
		return
	}

	client := &Client{
		ID:            uuid.New(),
		Conn:          conn,
		Hub:           h,
		Subscriptions: make(map[string]bool),
		Send:          make(chan Message, 64),
	}

	h.register <- client

	// Start read/write goroutines
	go client.writePump(r.Context())
	go client.readPump(r.Context())
}

// Broadcast sends a message to all connected clients
func (h *Hub) Broadcast(msgType MessageType, data interface{}) error {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	h.broadcast <- Message{
		Type:      msgType,
		Timestamp: time.Now().UTC(),
		Data:      jsonData,
	}
	return nil
}

// BroadcastTelemetry sends telemetry update to all clients
func (h *Hub) BroadcastTelemetry(telemetry *domain.Telemetry) error {
	return h.Broadcast(MessageTypeTelemetry, telemetry)
}

// BroadcastAlert sends an alert to all clients
func (h *Hub) BroadcastAlert(alert *domain.Alert) error {
	return h.Broadcast(MessageTypeAlert, alert)
}

// BroadcastVehicleUpdate sends vehicle status update
func (h *Hub) BroadcastVehicleUpdate(vehicle *domain.Vehicle) error {
	return h.Broadcast(MessageTypeVehicle, vehicle)
}

// BroadcastStats sends fleet stats update
func (h *Hub) BroadcastStats(stats *domain.FleetStats) error {
	return h.Broadcast(MessageTypeStats, stats)
}

// BroadcastPing sends ping to all clients
func (h *Hub) BroadcastPing() {
	h.broadcast <- Message{
		Type:      MessageTypePing,
		Timestamp: time.Now().UTC(),
	}
}

// GetClientCount returns current connected client count
func (h *Hub) GetClientCount() int {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return len(h.clients)
}

// Client methods

func (c *Client) writePump(ctx context.Context) {
	defer func() {
		c.Conn.Close(websocket.StatusNormalClosure, "")
		c.Hub.unregister <- c
	}()

	for {
		select {
		case <-ctx.Done():
			return
		case message, ok := <-c.Send:
			if !ok {
				// Channel closed
				return
			}

			ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
			err := wsjson.Write(ctx, c.Conn, message)
			cancel()

			if err != nil {
				c.Hub.logger.Error().
					Err(err).
					Str("clientId", c.ID.String()).
					Msg("Failed to write WebSocket message")
				return
			}
		}
	}
}

func (c *Client) readPump(ctx context.Context) {
	defer func() {
		c.Hub.unregister <- c
		c.Conn.Close(websocket.StatusNormalClosure, "")
	}()

	for {
		var msg Message
		err := wsjson.Read(ctx, c.Conn, &msg)
		if err != nil {
			if websocket.CloseStatus(err) != websocket.StatusNormalClosure {
				c.Hub.logger.Debug().
					Err(err).
					Str("clientId", c.ID.String()).
					Msg("WebSocket read error")
			}
			return
		}

		// Handle client messages
		switch msg.Type {
		case MessageTypeSubscribe:
			var channels []string
			if err := json.Unmarshal(msg.Data, &channels); err == nil {
				c.mu.Lock()
				for _, ch := range channels {
					c.Subscriptions[ch] = true
				}
				c.mu.Unlock()
			}

		case MessageTypeUnsubscribe:
			var channels []string
			if err := json.Unmarshal(msg.Data, &channels); err == nil {
				c.mu.Lock()
				for _, ch := range channels {
					delete(c.Subscriptions, ch)
				}
				c.mu.Unlock()
			}

		case MessageTypePong:
			// Client responded to ping, connection is alive
			c.Hub.logger.Debug().
				Str("clientId", c.ID.String()).
				Msg("Received pong")
		}
	}
}
