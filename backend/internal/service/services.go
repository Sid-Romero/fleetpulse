package service

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/sid-romero/fleetpulse/internal/domain"
)

// AlertFilters for querying alerts
type AlertFilters struct {
	Status   *domain.AlertStatus
	Severity *domain.AlertSeverity
	VehicleID *uuid.UUID
	Limit    int
	Offset   int
}

// ConsumptionData for analytics
type ConsumptionData struct {
	Date       string  `json:"date"`
	VehicleID  string  `json:"vehicleId,omitempty"`
	Value      float64 `json:"value"`
	Unit       string  `json:"unit"`
}

// DistanceData for analytics
type DistanceData struct {
	Date      string  `json:"date"`
	VehicleID string  `json:"vehicleId,omitempty"`
	Distance  float64 `json:"distance"` // km
}

// VehicleService interface
type VehicleService struct {
	// We'll implement this with a repository
}

func NewVehicleService() *VehicleService {
	return &VehicleService{}
}

func (s *VehicleService) GetAll(ctx context.Context) ([]domain.Vehicle, error) {
	// Mock implementation for MVP
	return getMockVehicles(), nil
}

func (s *VehicleService) GetByID(ctx context.Context, id uuid.UUID) (*domain.Vehicle, error) {
	vehicles := getMockVehicles()
	for _, v := range vehicles {
		if v.ID == id {
			return &v, nil
		}
	}
	return nil, nil
}

func (s *VehicleService) GetByStatus(ctx context.Context, status domain.VehicleStatus) ([]domain.Vehicle, error) {
	vehicles := getMockVehicles()
	var filtered []domain.Vehicle
	for _, v := range vehicles {
		if v.Status == status {
			filtered = append(filtered, v)
		}
	}
	return filtered, nil
}

func (s *VehicleService) Create(ctx context.Context, vehicle *domain.Vehicle) (*domain.Vehicle, error) {
	vehicle.ID = uuid.New()
	vehicle.CreatedAt = time.Now()
	vehicle.UpdatedAt = time.Now()
	return vehicle, nil
}

func (s *VehicleService) Update(ctx context.Context, vehicle *domain.Vehicle) (*domain.Vehicle, error) {
	vehicle.UpdatedAt = time.Now()
	return vehicle, nil
}

// AlertService
type AlertService struct{}

func NewAlertService() *AlertService {
	return &AlertService{}
}

func (s *AlertService) GetFiltered(ctx context.Context, filters AlertFilters) ([]domain.Alert, error) {
	return getMockAlerts(), nil
}

func (s *AlertService) GetByID(ctx context.Context, id uuid.UUID) (*domain.Alert, error) {
	alerts := getMockAlerts()
	for _, a := range alerts {
		if a.ID == id {
			return &a, nil
		}
	}
	return nil, nil
}

func (s *AlertService) Acknowledge(ctx context.Context, id uuid.UUID, userID uuid.UUID) (*domain.Alert, error) {
	now := time.Now()
	return &domain.Alert{
		ID:             id,
		Status:         domain.AlertStatusAcknowledged,
		AcknowledgedAt: &now,
		AcknowledgedBy: &userID,
	}, nil
}

func (s *AlertService) Resolve(ctx context.Context, id uuid.UUID, userID uuid.UUID) (*domain.Alert, error) {
	now := time.Now()
	return &domain.Alert{
		ID:         id,
		Status:     domain.AlertStatusResolved,
		ResolvedAt: &now,
		ResolvedBy: &userID,
	}, nil
}

// TelemetryService
type TelemetryService struct{}

func NewTelemetryService() *TelemetryService {
	return &TelemetryService{}
}

func (s *TelemetryService) GetByVehicle(ctx context.Context, vehicleID uuid.UUID, from, to time.Time) ([]domain.Telemetry, error) {
	// Generate mock telemetry data
	var telemetry []domain.Telemetry
	current := from
	for current.Before(to) {
		telemetry = append(telemetry, domain.Telemetry{
			ID:           uuid.New(),
			VehicleID:    vehicleID,
			Timestamp:    current,
			Location:     domain.Location{Lat: 40.7128, Lng: -74.0060},
			Speed:        float32(50 + (current.Minute() % 30)),
			BatteryLevel: 80 - (current.Hour() % 20),
			EngineTemp:   float32(85 + (current.Minute() % 10)),
			EngineRPM:    2500 + (current.Minute() * 50),
		})
		current = current.Add(5 * time.Minute)
	}
	return telemetry, nil
}

func (s *TelemetryService) Ingest(ctx context.Context, telemetry *domain.Telemetry) error {
	telemetry.ID = uuid.New()
	if telemetry.Timestamp.IsZero() {
		telemetry.Timestamp = time.Now()
	}
	return nil
}

func (s *TelemetryService) BatchIngest(ctx context.Context, telemetry []domain.Telemetry) error {
	for i := range telemetry {
		telemetry[i].ID = uuid.New()
		if telemetry[i].Timestamp.IsZero() {
			telemetry[i].Timestamp = time.Now()
		}
	}
	return nil
}

// AnalyticsService
type AnalyticsService struct{}

func NewAnalyticsService() *AnalyticsService {
	return &AnalyticsService{}
}

func (s *AnalyticsService) GetFleetStats(ctx context.Context) (*domain.FleetStats, error) {
	return &domain.FleetStats{
		ActiveVehicles:   24,
		TotalVehicles:    30,
		CriticalAlerts:   3,
		TotalDistanceKm:  1847,
		AvgEfficiency:    94.2,
		VehiclesCharging: 4,
		Timestamp:        time.Now(),
	}, nil
}

func (s *AnalyticsService) GetConsumption(ctx context.Context, period string) ([]ConsumptionData, error) {
	// Generate mock consumption data based on period
	var data []ConsumptionData
	days := parsePeriodDays(period)
	
	for i := 0; i < days; i++ {
		date := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
		data = append(data, ConsumptionData{
			Date:  date,
			Value: float64(180 + (i * 5) % 50),
			Unit:  "kWh",
		})
	}
	return data, nil
}

func (s *AnalyticsService) GetDistance(ctx context.Context, period string) ([]DistanceData, error) {
	var data []DistanceData
	days := parsePeriodDays(period)
	
	for i := 0; i < days; i++ {
		date := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
		data = append(data, DistanceData{
			Date:     date,
			Distance: float64(200 + (i * 10) % 100),
		})
	}
	return data, nil
}

func parsePeriodDays(period string) int {
	switch period {
	case "7d":
		return 7
	case "30d":
		return 30
	case "90d":
		return 90
	default:
		return 7
	}
}

// Mock data generators

func getMockVehicles() []domain.Vehicle {
	return []domain.Vehicle{
		{
			ID:           uuid.MustParse("11111111-1111-1111-1111-111111111111"),
			VIN:          "TSLA-S-99283",
			Name:         "Logistics Unit A1",
			Model:        "Tesla Semi",
			Brand:        "Tesla",
			Image:        "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800",
			Status:       domain.VehicleStatusActive,
			BatteryLevel: 78,
			Range:        420,
			Location:     domain.Location{Lat: 40.7128, Lng: -74.0060, Address: "Broadway, New York"},
			Speed:        65,
			Temperature:  21,
			Odometer:     12450,
			Efficiency:   "1.8 kWh/km",
			Driver: &domain.Driver{
				ID:     uuid.MustParse("d1111111-1111-1111-1111-111111111111"),
				Name:   "Alex M.",
				Avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
				Rating: 4.9,
			},
			CreatedAt: time.Now().AddDate(0, -6, 0),
			UpdatedAt: time.Now(),
		},
		{
			ID:           uuid.MustParse("22222222-2222-2222-2222-222222222222"),
			VIN:          "MB-SPR-1102",
			Name:         "Rapid Delivery 04",
			Model:        "eSprinter Van",
			Brand:        "Mercedes-Benz",
			Image:        "https://images.unsplash.com/photo-1591293836371-9231f827255f?auto=format&fit=crop&q=80&w=800",
			Status:       domain.VehicleStatusCharging,
			BatteryLevel: 24,
			Range:        45,
			Location:     domain.Location{Lat: 40.7580, Lng: -73.9855, Address: "Charging Station 4"},
			Speed:        0,
			Temperature:  19,
			Odometer:     45200,
			Efficiency:   "22 kWh/100km",
			Driver: &domain.Driver{
				ID:     uuid.MustParse("d2222222-2222-2222-2222-222222222222"),
				Name:   "Sarah J.",
				Avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
				Rating: 4.7,
			},
			CreatedAt: time.Now().AddDate(0, -4, 0),
			UpdatedAt: time.Now(),
		},
		{
			ID:           uuid.MustParse("33333333-3333-3333-3333-333333333333"),
			VIN:          "RIV-EDV-552",
			Name:         "Urban Hauler X",
			Model:        "Rivian EDV",
			Brand:        "Rivian",
			Image:        "https://images.unsplash.com/photo-1675258364539-780c74996459?auto=format&fit=crop&q=80&w=800",
			Status:       domain.VehicleStatusIdle,
			BatteryLevel: 92,
			Range:        200,
			Location:     domain.Location{Lat: 40.7829, Lng: -73.9654, Address: "Central Depot"},
			Speed:        0,
			Temperature:  22,
			Odometer:     8900,
			Efficiency:   "19 kWh/100km",
			Driver: &domain.Driver{
				ID:     uuid.MustParse("d3333333-3333-3333-3333-333333333333"),
				Name:   "Mike T.",
				Avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
				Rating: 4.8,
			},
			CreatedAt: time.Now().AddDate(0, -2, 0),
			UpdatedAt: time.Now(),
		},
		{
			ID:           uuid.MustParse("44444444-4444-4444-4444-444444444444"),
			VIN:          "VOL-FH-883",
			Name:         "Heavy Freight 02",
			Model:        "Volvo FH Electric",
			Brand:        "Volvo",
			Image:        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800",
			Status:       domain.VehicleStatusActive,
			BatteryLevel: 45,
			Range:        180,
			Location:     domain.Location{Lat: 40.7484, Lng: -73.9857, Address: "Empire State Delivery"},
			Speed:        42,
			Temperature:  20,
			Odometer:     85430,
			Efficiency:   "1.2 kWh/km",
			Driver: &domain.Driver{
				ID:     uuid.MustParse("d4444444-4444-4444-4444-444444444444"),
				Name:   "David L.",
				Avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c",
				Rating: 5.0,
			},
			CreatedAt: time.Now().AddDate(-1, 0, 0),
			UpdatedAt: time.Now(),
		},
	}
}

func getMockAlerts() []domain.Alert {
	v1 := uuid.MustParse("11111111-1111-1111-1111-111111111111")
	v2 := uuid.MustParse("22222222-2222-2222-2222-222222222222")
	v4 := uuid.MustParse("44444444-4444-4444-4444-444444444444")
	
	return []domain.Alert{
		{
			ID:        uuid.MustParse("a1111111-1111-1111-1111-111111111111"),
			VehicleID: &v1,
			Type:      "tire_pressure",
			Severity:  domain.AlertSeverityCritical,
			Status:    domain.AlertStatusActive,
			Message:   "Tire pressure low - Vehicle v1",
			CreatedAt: time.Now().Add(-2 * time.Minute),
		},
		{
			ID:        uuid.MustParse("a2222222-2222-2222-2222-222222222222"),
			VehicleID: &v4,
			Type:      "unexpected_stop",
			Severity:  domain.AlertSeverityWarning,
			Status:    domain.AlertStatusActive,
			Message:   "Unexpected stop detected",
			CreatedAt: time.Now().Add(-15 * time.Minute),
		},
		{
			ID:        uuid.MustParse("a3333333-3333-3333-3333-333333333333"),
			VehicleID: &v2,
			Type:      "charging_started",
			Severity:  domain.AlertSeverityInfo,
			Status:    domain.AlertStatusActive,
			Message:   "Vehicle v2 started charging",
			CreatedAt: time.Now().Add(-1 * time.Hour),
		},
	}
}
