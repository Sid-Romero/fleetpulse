package api

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/rs/zerolog"
	"github.com/sid-romero/fleetpulse/internal/config"
	"github.com/sid-romero/fleetpulse/internal/websocket"
)

// Router creates and configures the HTTP router
func NewRouter(
	cfg *config.Config,
	handler *Handler,
	wsHub *websocket.Hub,
	logger zerolog.Logger,
) http.Handler {
	r := chi.NewRouter()

	// ========== Middleware Stack ==========
	
	// Request ID
	r.Use(middleware.RequestID)
	
	// Real IP (for reverse proxy)
	r.Use(middleware.RealIP)
	
	// Structured logging
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)
			
			defer func() {
				logger.Info().
					Str("method", r.Method).
					Str("path", r.URL.Path).
					Str("remote_addr", r.RemoteAddr).
					Int("status", ww.Status()).
					Int("bytes", ww.BytesWritten()).
					Dur("duration", time.Since(start)).
					Str("request_id", middleware.GetReqID(r.Context())).
					Msg("HTTP request")
			}()
			
			next.ServeHTTP(ww, r)
		})
	})
	
	// Panic recovery
	r.Use(middleware.Recoverer)
	
	// Request timeout
	r.Use(middleware.Timeout(30 * time.Second))
	
	// CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   cfg.CORS.AllowedOrigins,
		AllowedMethods:   cfg.CORS.AllowedMethods,
		AllowedHeaders:   cfg.CORS.AllowedHeaders,
		AllowCredentials: cfg.CORS.AllowCredentials,
		MaxAge:           cfg.CORS.MaxAge,
	}))
	
	// Compression
	r.Use(middleware.Compress(5))

	// ========== Routes ==========
	
	// Health check (outside /api for k8s probes)
	r.Get("/health", handler.HealthCheck)
	r.Get("/healthz", handler.HealthCheck) // k8s style
	r.Get("/readyz", handler.HealthCheck)  // k8s readiness
	
	// WebSocket endpoint
	r.Get("/ws", wsHub.HandleWebSocket)
	r.Get("/ws/telemetry", wsHub.HandleWebSocket)
	
	// API v1
	r.Route("/api/v1", func(r chi.Router) {
		// Vehicles
		r.Route("/vehicles", func(r chi.Router) {
			r.Get("/", handler.ListVehicles)
			r.Post("/", handler.CreateVehicle)
			
			r.Route("/{id}", func(r chi.Router) {
				r.Get("/", handler.GetVehicle)
				r.Put("/", handler.UpdateVehicle)
				r.Patch("/", handler.UpdateVehicle)
				r.Get("/telemetry", handler.GetVehicleTelemetry)
			})
		})
		
		// Alerts
		r.Route("/alerts", func(r chi.Router) {
			r.Get("/", handler.ListAlerts)
			
			r.Route("/{id}", func(r chi.Router) {
				r.Get("/", handler.GetAlert)
				r.Post("/acknowledge", handler.AcknowledgeAlert)
				r.Post("/resolve", handler.ResolveAlert)
				r.Patch("/", func(w http.ResponseWriter, r *http.Request) {
					// Handle PATCH for acknowledge/resolve via body
					// This allows: PATCH /alerts/:id { "status": "acknowledged" }
					handler.AcknowledgeAlert(w, r)
				})
			})
		})
		
		// Analytics
		r.Route("/analytics", func(r chi.Router) {
			r.Get("/stats", handler.GetFleetStats)
			r.Get("/consumption", handler.GetConsumptionAnalytics)
			r.Get("/distance", handler.GetDistanceAnalytics)
		})
		
		// Telemetry ingestion (for simulator/IoT devices)
		r.Route("/telemetry", func(r chi.Router) {
			r.Post("/", handler.IngestTelemetry)
			r.Post("/batch", handler.BatchIngestTelemetry)
		})
	})
	
	// Not found handler
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"success":false,"error":{"code":"NOT_FOUND","message":"Endpoint not found"}}`))
	})
	
	// Method not allowed handler
	r.MethodNotAllowed(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte(`{"success":false,"error":{"code":"METHOD_NOT_ALLOWED","message":"Method not allowed"}}`))
	})

	return r
}
