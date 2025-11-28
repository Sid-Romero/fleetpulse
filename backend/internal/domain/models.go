package domain

import (
	"time"

	"github.com/google/uuid"
)

// VehicleStatus represents the current state of a vehicle
type VehicleStatus string

const (
	VehicleStatusActive      VehicleStatus = "active"
	VehicleStatusMaintenance VehicleStatus = "maintenance"
	VehicleStatusIdle        VehicleStatus = "idle"
	VehicleStatusCharging    VehicleStatus = "charging"
)

// AlertSeverity represents alert priority levels
type AlertSeverity string

const (
	AlertSeverityCritical AlertSeverity = "critical"
	AlertSeverityWarning  AlertSeverity = "warning"
	AlertSeverityInfo     AlertSeverity = "info"
)

// AlertStatus represents the lifecycle of an alert
type AlertStatus string

const (
	AlertStatusActive       AlertStatus = "active"
	AlertStatusAcknowledged AlertStatus = "acknowledged"
	AlertStatusResolved     AlertStatus = "resolved"
)

// Location represents a geographic position
type Location struct {
	Lat     float64 `json:"lat"`
	Lng     float64 `json:"lng"`
	Address string  `json:"address,omitempty"`
}

// Driver represents a vehicle operator
type Driver struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email,omitempty"`
	Phone     string    `json:"phone,omitempty"`
	Avatar    string    `json:"avatar"`
	Rating    float32   `json:"rating"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// Vehicle represents a fleet vehicle
type Vehicle struct {
	ID           uuid.UUID     `json:"id"`
	VIN          string        `json:"vin"`
	Name         string        `json:"name"`
	Model        string        `json:"model"`
	Brand        string        `json:"brand"`
	Image        string        `json:"image"`
	Status       VehicleStatus `json:"status"`
	BatteryLevel int           `json:"batteryLevel"` // 0-100
	FuelLevel    *int          `json:"fuelLevel,omitempty"`
	Range        int           `json:"range"` // km
	Location     Location      `json:"location"`
	Speed        float32       `json:"speed"` // km/h
	DriverID     *uuid.UUID    `json:"driverId,omitempty"`
	Driver       *Driver       `json:"driver,omitempty"`
	Temperature  float32       `json:"temperature"` // Celsius
	Odometer     int           `json:"odometer"`    // km
	Efficiency   string        `json:"efficiency"`
	CreatedAt    time.Time     `json:"createdAt"`
	UpdatedAt    time.Time     `json:"updatedAt"`
}

// Alert represents a fleet alert/notification
type Alert struct {
	ID             uuid.UUID     `json:"id"`
	VehicleID      *uuid.UUID    `json:"vehicleId,omitempty"`
	Vehicle        *Vehicle      `json:"vehicle,omitempty"`
	Type           string        `json:"type"` // fuel_low, speed_excess, geofence_exit, etc.
	Severity       AlertSeverity `json:"severity"`
	Status         AlertStatus   `json:"status"`
	Message        string        `json:"message"`
	CreatedAt      time.Time     `json:"createdAt"`
	AcknowledgedAt *time.Time    `json:"acknowledgedAt,omitempty"`
	AcknowledgedBy *uuid.UUID    `json:"acknowledgedBy,omitempty"`
	ResolvedAt     *time.Time    `json:"resolvedAt,omitempty"`
	ResolvedBy     *uuid.UUID    `json:"resolvedBy,omitempty"`
}

// Telemetry represents real-time vehicle data
type Telemetry struct {
	ID           uuid.UUID `json:"id"`
	VehicleID    uuid.UUID `json:"vehicleId"`
	Timestamp    time.Time `json:"timestamp"`
	Location     Location  `json:"location"`
	Speed        float32   `json:"speed"`
	BatteryLevel int       `json:"batteryLevel"`
	FuelLevel    *int      `json:"fuelLevel,omitempty"`
	EngineTemp   float32   `json:"engineTemp"`
	EngineRPM    int       `json:"engineRpm"`
	Heading      float32   `json:"heading"` // degrees
}

// FleetStats represents aggregated fleet statistics
type FleetStats struct {
	ActiveVehicles   int     `json:"activeVehicles"`
	TotalVehicles    int     `json:"totalVehicles"`
	CriticalAlerts   int     `json:"criticalAlerts"`
	TotalDistanceKm  float64 `json:"totalDistanceKm"`
	AvgEfficiency    float64 `json:"avgEfficiency"`
	VehiclesCharging int     `json:"vehiclesCharging"`
	Timestamp        time.Time `json:"timestamp"`
}

// MaintenanceRecord represents vehicle service history
type MaintenanceRecord struct {
	ID          uuid.UUID `json:"id"`
	VehicleID   uuid.UUID `json:"vehicleId"`
	Date        time.Time `json:"date"`
	Type        string    `json:"type"`
	Description string    `json:"description"`
	Cost        float64   `json:"cost"`
	Status      string    `json:"status"` // scheduled, completed, cancelled
	Technician  string    `json:"technician,omitempty"`
	Notes       string    `json:"notes,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
}

// Geofence represents a geographic boundary
type Geofence struct {
	ID        uuid.UUID   `json:"id"`
	Name      string      `json:"name"`
	Type      string      `json:"type"` // circle, polygon
	Center    *Location   `json:"center,omitempty"`
	Radius    *float64    `json:"radius,omitempty"` // meters
	Polygon   []Location  `json:"polygon,omitempty"`
	IsActive  bool        `json:"isActive"`
	CreatedAt time.Time   `json:"createdAt"`
}
