package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog"
)

// SimulatedVehicle represents a vehicle being simulated
type SimulatedVehicle struct {
	ID           uuid.UUID
	VIN          string
	Name         string
	Status       string
	BatteryLevel int
	FuelLevel    *int
	Location     Location
	Speed        float64
	Heading      float64 // Direction in degrees
	EngineTemp   float64
	EngineRPM    int
	IsMoving     bool
	Route        []Location
	RouteIndex   int
}

type Location struct {
	Lat     float64 `json:"lat"`
	Lng     float64 `json:"lng"`
	Address string  `json:"address,omitempty"`
}

type TelemetryPayload struct {
	VehicleID    string   `json:"vehicleId"`
	Timestamp    string   `json:"timestamp"`
	Location     Location `json:"location"`
	Speed        float64  `json:"speed"`
	BatteryLevel int      `json:"batteryLevel"`
	FuelLevel    *int     `json:"fuelLevel,omitempty"`
	EngineTemp   float64  `json:"engineTemp"`
	EngineRPM    int      `json:"engineRpm"`
	Heading      float64  `json:"heading"`
}

// Config for simulator
type Config struct {
	APIURL         string
	VehicleCount   int
	UpdateInterval time.Duration
}

func main() {
	// Setup logger
	logger := zerolog.New(zerolog.ConsoleWriter{
		Out:        os.Stdout,
		TimeFormat: time.RFC3339,
	}).With().Timestamp().Str("service", "vehicle-simulator").Logger()

	// Load config
	cfg := Config{
		APIURL:         getEnv("API_URL", "http://localhost:8080"),
		VehicleCount:   getEnvAsInt("VEHICLE_COUNT", 4),
		UpdateInterval: getEnvAsDuration("UPDATE_INTERVAL", 3*time.Second),
	}

	logger.Info().
		Str("apiUrl", cfg.APIURL).
		Int("vehicleCount", cfg.VehicleCount).
		Dur("updateInterval", cfg.UpdateInterval).
		Msg("Starting vehicle simulator")

	// Initialize vehicles
	vehicles := initializeVehicles(cfg.VehicleCount)

	// Context for graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Handle shutdown signals
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		sig := <-sigCh
		logger.Info().Str("signal", sig.String()).Msg("Received shutdown signal")
		cancel()
	}()

	// Start simulation
	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		defer wg.Done()
		runSimulation(ctx, cfg, vehicles, logger)
	}()

	wg.Wait()
	logger.Info().Msg("Simulator stopped")
}

func initializeVehicles(count int) []*SimulatedVehicle {
	// Predefined vehicle data matching our mock data
	predefinedVehicles := []struct {
		ID       string
		VIN      string
		Name     string
		Status   string
		Battery  int
		Location Location
	}{
		{
			ID:       "11111111-1111-1111-1111-111111111111",
			VIN:      "TSLA-S-99283",
			Name:     "Logistics Unit A1",
			Status:   "active",
			Battery:  78,
			Location: Location{Lat: 40.7128, Lng: -74.0060, Address: "Broadway, New York"},
		},
		{
			ID:       "22222222-2222-2222-2222-222222222222",
			VIN:      "MB-SPR-1102",
			Name:     "Rapid Delivery 04",
			Status:   "charging",
			Battery:  24,
			Location: Location{Lat: 40.7580, Lng: -73.9855, Address: "Charging Station 4"},
		},
		{
			ID:       "33333333-3333-3333-3333-333333333333",
			VIN:      "RIV-EDV-552",
			Name:     "Urban Hauler X",
			Status:   "idle",
			Battery:  92,
			Location: Location{Lat: 40.7829, Lng: -73.9654, Address: "Central Depot"},
		},
		{
			ID:       "44444444-4444-4444-4444-444444444444",
			VIN:      "VOL-FH-883",
			Name:     "Heavy Freight 02",
			Status:   "active",
			Battery:  45,
			Location: Location{Lat: 40.7484, Lng: -73.9857, Address: "Empire State Delivery"},
		},
	}

	vehicles := make([]*SimulatedVehicle, 0, count)

	for i := 0; i < count && i < len(predefinedVehicles); i++ {
		pv := predefinedVehicles[i]
		v := &SimulatedVehicle{
			ID:           uuid.MustParse(pv.ID),
			VIN:          pv.VIN,
			Name:         pv.Name,
			Status:       pv.Status,
			BatteryLevel: pv.Battery,
			Location:     pv.Location,
			Speed:        0,
			Heading:      rand.Float64() * 360,
			EngineTemp:   85 + rand.Float64()*10,
			EngineRPM:    0,
			IsMoving:     pv.Status == "active",
			Route:        generateRandomRoute(pv.Location, 10),
			RouteIndex:   0,
		}
		vehicles = append(vehicles, v)
	}

	return vehicles
}

func generateRandomRoute(start Location, points int) []Location {
	route := make([]Location, points)
	route[0] = start

	for i := 1; i < points; i++ {
		// Move slightly in a random direction
		route[i] = Location{
			Lat: route[i-1].Lat + (rand.Float64()-0.5)*0.01,
			Lng: route[i-1].Lng + (rand.Float64()-0.5)*0.01,
		}
	}

	return route
}

func runSimulation(ctx context.Context, cfg Config, vehicles []*SimulatedVehicle, logger zerolog.Logger) {
	ticker := time.NewTicker(cfg.UpdateInterval)
	defer ticker.Stop()

	client := &http.Client{Timeout: 10 * time.Second}

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			for _, vehicle := range vehicles {
				// Update vehicle state
				updateVehicleState(vehicle)

				// Create telemetry payload
				telemetry := TelemetryPayload{
					VehicleID:    vehicle.ID.String(),
					Timestamp:    time.Now().UTC().Format(time.RFC3339),
					Location:     vehicle.Location,
					Speed:        vehicle.Speed,
					BatteryLevel: vehicle.BatteryLevel,
					FuelLevel:    vehicle.FuelLevel,
					EngineTemp:   vehicle.EngineTemp,
					EngineRPM:    vehicle.EngineRPM,
					Heading:      vehicle.Heading,
				}

				// Send telemetry
				if err := sendTelemetry(client, cfg.APIURL, telemetry); err != nil {
					logger.Error().
						Err(err).
						Str("vehicleId", vehicle.ID.String()).
						Msg("Failed to send telemetry")
				} else {
					logger.Debug().
						Str("vehicleId", vehicle.ID.String()).
						Float64("speed", vehicle.Speed).
						Int("battery", vehicle.BatteryLevel).
						Msg("Telemetry sent")
				}
			}
		}
	}
}

func updateVehicleState(v *SimulatedVehicle) {
	switch v.Status {
	case "active":
		// Vehicle is moving
		v.IsMoving = true
		
		// Update speed (30-80 km/h with some variation)
		v.Speed = 30 + rand.Float64()*50 + (rand.Float64()-0.5)*10
		
		// Move along route
		if v.RouteIndex < len(v.Route)-1 {
			v.RouteIndex++
		} else {
			v.RouteIndex = 0 // Loop route
		}
		v.Location = v.Route[v.RouteIndex]
		
		// Calculate heading
		if v.RouteIndex > 0 {
			v.Heading = calculateHeading(v.Route[v.RouteIndex-1], v.Location)
		}
		
		// Drain battery (0.1-0.3% per update)
		v.BatteryLevel = max(0, v.BatteryLevel-int(rand.Float64()*0.3))
		
		// Engine metrics
		v.EngineTemp = 85 + rand.Float64()*15
		v.EngineRPM = 2000 + rand.Intn(2000)

	case "charging":
		// Vehicle is stationary, charging
		v.IsMoving = false
		v.Speed = 0
		v.EngineRPM = 0
		v.EngineTemp = max(20, v.EngineTemp-0.5) // Cooling down
		
		// Charge battery (0.5-1% per update)
		v.BatteryLevel = min(100, v.BatteryLevel+int(0.5+rand.Float64()*0.5))
		
		// Switch to idle when fully charged
		if v.BatteryLevel >= 100 {
			v.Status = "idle"
		}

	case "idle":
		// Vehicle is parked
		v.IsMoving = false
		v.Speed = 0
		v.EngineRPM = 0
		v.EngineTemp = max(20, v.EngineTemp-0.2)
		
		// Small chance to start moving
		if rand.Float64() < 0.05 && v.BatteryLevel > 20 {
			v.Status = "active"
		}

	case "maintenance":
		v.IsMoving = false
		v.Speed = 0
		v.EngineRPM = 0
	}

	// Add some random fluctuation to location (GPS noise)
	if v.IsMoving {
		v.Location.Lat += (rand.Float64() - 0.5) * 0.0001
		v.Location.Lng += (rand.Float64() - 0.5) * 0.0001
	}
}

func calculateHeading(from, to Location) float64 {
	dLng := to.Lng - from.Lng
	y := math.Sin(dLng) * math.Cos(to.Lat)
	x := math.Cos(from.Lat)*math.Sin(to.Lat) - math.Sin(from.Lat)*math.Cos(to.Lat)*math.Cos(dLng)
	heading := math.Atan2(y, x) * 180 / math.Pi
	return math.Mod(heading+360, 360)
}

func sendTelemetry(client *http.Client, apiURL string, telemetry TelemetryPayload) error {
	data, err := json.Marshal(telemetry)
	if err != nil {
		return err
	}

	resp, err := client.Post(
		apiURL+"/api/v1/telemetry",
		"application/json",
		bytes.NewBuffer(data),
	)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("API returned status %d", resp.StatusCode)
	}

	return nil
}

// Helper functions

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value, exists := os.LookupEnv(key); exists {
		var result int
		fmt.Sscanf(value, "%d", &result)
		return result
	}
	return defaultValue
}

func getEnvAsDuration(key string, defaultValue time.Duration) time.Duration {
	if value, exists := os.LookupEnv(key); exists {
		if d, err := time.ParseDuration(value); err == nil {
			return d
		}
	}
	return defaultValue
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
