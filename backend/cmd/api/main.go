package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
	"github.com/sid-romero/fleetpulse/internal/api"
	"github.com/sid-romero/fleetpulse/internal/config"
	"github.com/sid-romero/fleetpulse/internal/service"
	"github.com/sid-romero/fleetpulse/internal/websocket"
	"golang.org/x/sync/errgroup"
)

func main() {
	// Load .env file if present
	_ = godotenv.Load()

	// Load configuration
	cfg := config.Load()

	// Setup logger
	logger := setupLogger(cfg)

	logger.Info().
		Str("environment", cfg.Server.Environment).
		Int("port", cfg.Server.Port).
		Msg("Starting FleetPulse API server")

	// Initialize services
	vehicleService := service.NewVehicleService()
	alertService := service.NewAlertService()
	telemetryService := service.NewTelemetryService()
	analyticsService := service.NewAnalyticsService()

	// Initialize WebSocket hub
	wsHub := websocket.NewHub(logger)

	// Initialize HTTP handler
	handler := api.NewHandler(
		vehicleService,
		alertService,
		telemetryService,
		analyticsService,
		logger,
	)

	// Create router
	router := api.NewRouter(cfg, handler, wsHub, logger)

	// Create HTTP server
	server := &http.Server{
		Addr:         fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port),
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
		IdleTimeout:  120 * time.Second,
	}

	// Context for graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Error group for concurrent operations
	g, gCtx := errgroup.WithContext(ctx)

	// Run WebSocket hub
	g.Go(func() error {
		wsHub.Run(gCtx)
		return nil
	})

	// Run HTTP server
	g.Go(func() error {
		logger.Info().
			Str("addr", server.Addr).
			Msg("HTTP server listening")

		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			return fmt.Errorf("HTTP server error: %w", err)
		}
		return nil
	})

	// Run telemetry broadcaster (simulates real-time updates)
	g.Go(func() error {
		return runTelemetryBroadcaster(gCtx, wsHub, logger)
	})

	// Handle graceful shutdown
	g.Go(func() error {
		sigCh := make(chan os.Signal, 1)
		signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

		select {
		case sig := <-sigCh:
			logger.Info().Str("signal", sig.String()).Msg("Received shutdown signal")
		case <-gCtx.Done():
			return nil
		}

		// Trigger shutdown
		cancel()

		// Graceful shutdown with timeout
		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), cfg.Server.ShutdownTimeout)
		defer shutdownCancel()

		logger.Info().Msg("Shutting down HTTP server...")
		if err := server.Shutdown(shutdownCtx); err != nil {
			logger.Error().Err(err).Msg("HTTP server shutdown error")
			return err
		}

		logger.Info().Msg("Server shutdown complete")
		return nil
	})

	// Wait for all goroutines
	if err := g.Wait(); err != nil {
		logger.Error().Err(err).Msg("Server error")
		os.Exit(1)
	}
}

func setupLogger(cfg *config.Config) zerolog.Logger {
	// Set global log level
	level, err := zerolog.ParseLevel(cfg.Logging.Level)
	if err != nil {
		level = zerolog.InfoLevel
	}
	zerolog.SetGlobalLevel(level)

	// Configure output
	var logger zerolog.Logger
	if cfg.Logging.Pretty || cfg.Server.Environment == "development" {
		logger = zerolog.New(zerolog.ConsoleWriter{
			Out:        os.Stdout,
			TimeFormat: time.RFC3339,
		})
	} else {
		logger = zerolog.New(os.Stdout)
	}

	return logger.With().
		Timestamp().
		Str("service", "fleetpulse-api").
		Str("version", "1.0.0").
		Logger()
}

// runTelemetryBroadcaster simulates real-time telemetry updates
func runTelemetryBroadcaster(ctx context.Context, hub *websocket.Hub, logger zerolog.Logger) error {
	ticker := time.NewTicker(3 * time.Second)
	defer ticker.Stop()

	vehicles := []string{
		"11111111-1111-1111-1111-111111111111",
		"22222222-2222-2222-2222-222222222222",
		"33333333-3333-3333-3333-333333333333",
		"44444444-4444-4444-4444-444444444444",
	}

	for {
		select {
		case <-ctx.Done():
			return nil
		case <-ticker.C:
			// Only broadcast if there are connected clients
			if hub.GetClientCount() == 0 {
				continue
			}

			// Simulate telemetry for each vehicle
			for _, vid := range vehicles {
				telemetry := map[string]interface{}{
					"vehicleId":    vid,
					"timestamp":    time.Now().UTC(),
					"speed":        float64(40 + time.Now().Second()%30),
					"batteryLevel": 75 + time.Now().Minute()%20,
					"location": map[string]float64{
						"lat": 40.7128 + float64(time.Now().Second()%10)*0.001,
						"lng": -74.0060 + float64(time.Now().Second()%10)*0.001,
					},
					"engineTemp": 85 + time.Now().Second()%15,
				}

				if err := hub.Broadcast(websocket.MessageTypeTelemetry, telemetry); err != nil {
					logger.Error().Err(err).Msg("Failed to broadcast telemetry")
				}
			}
		}
	}
}
