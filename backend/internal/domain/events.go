package domain

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// EventType defines the type of domain event
type EventType string

const (
	EventTypeTelemetryReceived   EventType = "telemetry.received"
	EventTypeVehicleStatusChange EventType = "vehicle.status.changed"
	EventTypeAlertCreated        EventType = "alert.created"
	EventTypeAlertAcknowledged   EventType = "alert.acknowledged"
	EventTypeAlertResolved       EventType = "alert.resolved"
	EventTypeGeofenceEnter       EventType = "geofence.enter"
	EventTypeGeofenceExit        EventType = "geofence.exit"
	EventTypeSpeedExceeded       EventType = "speed.exceeded"
	EventTypeBatteryLow          EventType = "battery.low"
	EventTypeMaintenanceDue      EventType = "maintenance.due"
)

// Event represents a domain event
type Event struct {
	ID        uuid.UUID       `json:"id"`
	Type      EventType       `json:"type"`
	Timestamp time.Time       `json:"timestamp"`
	Source    string          `json:"source"` // vehicle_id, system, etc.
	Data      json.RawMessage `json:"data"`
}

// NewEvent creates a new domain event
func NewEvent(eventType EventType, source string, data interface{}) (*Event, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	return &Event{
		ID:        uuid.New(),
		Type:      eventType,
		Timestamp: time.Now().UTC(),
		Source:    source,
		Data:      jsonData,
	}, nil
}

// TelemetryEvent payload
type TelemetryEventData struct {
	VehicleID    uuid.UUID `json:"vehicleId"`
	Telemetry    Telemetry `json:"telemetry"`
	PreviousData *Telemetry `json:"previousData,omitempty"`
}

// VehicleStatusChangeData payload
type VehicleStatusChangeData struct {
	VehicleID     uuid.UUID     `json:"vehicleId"`
	PreviousStatus VehicleStatus `json:"previousStatus"`
	NewStatus     VehicleStatus `json:"newStatus"`
	Reason        string        `json:"reason,omitempty"`
}

// AlertEventData payload
type AlertEventData struct {
	Alert    Alert  `json:"alert"`
	ActionBy *uuid.UUID `json:"actionBy,omitempty"`
}

// GeofenceEventData payload
type GeofenceEventData struct {
	VehicleID   uuid.UUID `json:"vehicleId"`
	GeofenceID  uuid.UUID `json:"geofenceId"`
	GeofenceName string   `json:"geofenceName"`
	Location    Location  `json:"location"`
	EventType   string    `json:"eventType"` // enter, exit
}

// SpeedExceededData payload
type SpeedExceededData struct {
	VehicleID    uuid.UUID `json:"vehicleId"`
	CurrentSpeed float32   `json:"currentSpeed"`
	SpeedLimit   float32   `json:"speedLimit"`
	Location     Location  `json:"location"`
}

// BatteryLowData payload
type BatteryLowData struct {
	VehicleID    uuid.UUID `json:"vehicleId"`
	BatteryLevel int       `json:"batteryLevel"`
	Range        int       `json:"range"`
	Location     Location  `json:"location"`
}
