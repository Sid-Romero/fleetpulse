package api

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/sid-romero/fleetpulse/internal/domain"
	"github.com/sid-romero/fleetpulse/internal/service"
)

// Handler holds all HTTP handlers
type Handler struct {
	vehicleService   *service.VehicleService
	alertService     *service.AlertService
	telemetryService *service.TelemetryService
	analyticsService *service.AnalyticsService
	logger           zerolog.Logger
}

// NewHandler creates a new Handler
func NewHandler(
	vehicleService *service.VehicleService,
	alertService *service.AlertService,
	telemetryService *service.TelemetryService,
	analyticsService *service.AnalyticsService,
	logger zerolog.Logger,
) *Handler {
	return &Handler{
		vehicleService:   vehicleService,
		alertService:     alertService,
		telemetryService: telemetryService,
		analyticsService: analyticsService,
		logger:           logger,
	}
}

// Response helpers

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *APIError   `json:"error,omitempty"`
	Meta    *APIMeta    `json:"meta,omitempty"`
}

type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type APIMeta struct {
	Total      int `json:"total,omitempty"`
	Page       int `json:"page,omitempty"`
	PerPage    int `json:"perPage,omitempty"`
	TotalPages int `json:"totalPages,omitempty"`
}

func (h *Handler) respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	
	response := APIResponse{
		Success: status >= 200 && status < 300,
		Data:    data,
	}
	
	if err := json.NewEncoder(w).Encode(response); err != nil {
		h.logger.Error().Err(err).Msg("Failed to encode JSON response")
	}
}

func (h *Handler) respondError(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	
	response := APIResponse{
		Success: false,
		Error: &APIError{
			Code:    code,
			Message: message,
		},
	}
	
	if err := json.NewEncoder(w).Encode(response); err != nil {
		h.logger.Error().Err(err).Msg("Failed to encode error response")
	}
}

// ========== Health Check ==========

// HealthCheck returns service health status
func (h *Handler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	h.respondJSON(w, http.StatusOK, map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now().UTC(),
		"version":   "1.0.0",
	})
}

// ========== Vehicle Handlers ==========

// ListVehicles returns all vehicles
func (h *Handler) ListVehicles(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	// Parse query params
	status := r.URL.Query().Get("status")
	
	var vehicles []domain.Vehicle
	var err error
	
	if status != "" {
		vehicles, err = h.vehicleService.GetByStatus(ctx, domain.VehicleStatus(status))
	} else {
		vehicles, err = h.vehicleService.GetAll(ctx)
	}
	
	if err != nil {
		h.logger.Error().Err(err).Msg("Failed to fetch vehicles")
		h.respondError(w, http.StatusInternalServerError, "FETCH_ERROR", "Failed to fetch vehicles")
		return
	}
	
	h.respondJSON(w, http.StatusOK, vehicles)
}

// GetVehicle returns a single vehicle by ID
func (h *Handler) GetVehicle(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := chi.URLParam(r, "id")
	
	id, err := uuid.Parse(idStr)
	if err != nil {
		h.respondError(w, http.StatusBadRequest, "INVALID_ID", "Invalid vehicle ID format")
		return
	}
	
	vehicle, err := h.vehicleService.GetByID(ctx, id)
	if err != nil {
		h.logger.Error().Err(err).Str("vehicleId", idStr).Msg("Failed to fetch vehicle")
		h.respondError(w, http.StatusNotFound, "NOT_FOUND", "Vehicle not found")
		return
	}
	
	h.respondJSON(w, http.StatusOK, vehicle)
}

// CreateVehicle creates a new vehicle
func (h *Handler) CreateVehicle(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	var vehicle domain.Vehicle
	if err := json.NewDecoder(r.Body).Decode(&vehicle); err != nil {
		h.respondError(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body")
		return
	}
	
	created, err := h.vehicleService.Create(ctx, &vehicle)
	if err != nil {
		h.logger.Error().Err(err).Msg("Failed to create vehicle")
		h.respondError(w, http.StatusInternalServerError, "CREATE_ERROR", "Failed to create vehicle")
		return
	}
	
	h.respondJSON(w, http.StatusCreated, created)
}

// UpdateVehicle updates an existing vehicle
func (h *Handler) UpdateVehicle(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := chi.URLParam(r, "id")
	
	id, err := uuid.Parse(idStr)
	if err != nil {
		h.respondError(w, http.StatusBadRequest, "INVALID_ID", "Invalid vehicle ID format")
		return
	}
	
	var vehicle domain.Vehicle
	if err := json.NewDecoder(r.Body).Decode(&vehicle); err != nil {
		h.respondError(w, http.StatusBadRequest, "INVALID_BODY", "Invalid request body")
		return
	}
	
	vehicle.ID = id
	updated, err := h.vehicleService.Update(ctx, &vehicle)
	if err != nil {
		h.logger.Error().Err(err).Str("vehicleId", idStr).Msg("Failed to update vehicle")
		h.respondError(w, http.StatusInternalServerError, "UPDATE_ERROR", "Failed to update vehicle")
		return
	}
	
	h.respondJSON(w, http.StatusOK, updated)
}

// GetVehicleTelemetry returns telemetry data for a vehicle
func (h *Handler) GetVehicleTelemetry(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := chi.URLParam(r, "id")
	
	id, err := uuid.Parse(idStr)
	if err != nil {
		h.respondError(w, http.StatusBadRequest, "INVALID_ID", "Invalid vehicle ID format")
		return
	}
	
	// Parse time range
	from := r.URL.Query().Get("from")
	to := r.URL.Query().Get("to")
	
	var fromTime, toTime time.Time
	if from != "" {
		fromTime, _ = time.Parse(time.RFC3339, from)
	} else {
		fromTime = time.Now().Add(-24 * time.Hour)
	}
	if to != "" {
		toTime, _ = time.Parse(time.RFC3339, to)
	} else {
		toTime = time.Now()
	}
	
	telemetry, err := h.telemetryService.GetByVehicle(ctx, id, fromTime, toTime)
	if err != nil {
		h.logger.Error().Err(err).Str("vehicleId", idStr).Msg("Failed to fetch telemetry")
		h.respondError(w, http.StatusInternalServerError, "FETCH_ERROR", "Failed to fetch telemetry")
		return
	}
	
	h.respondJSON(w, http.StatusOK, telemetry)
}

// ========== Alert Handlers ==========

// ListAlerts returns alerts with optional filters
func (h *Handler) ListAlerts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	// Parse query params
	status := r.URL.Query().Get("status")
	severity := r.URL.Query().Get("severity")
	limitStr := r.URL.Query().Get("limit")
	
	limit := 50
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
			limit = l
		}
	}
	
	filters := service.AlertFilters{
		Limit: limit,
	}
	if status != "" {
		s := domain.AlertStatus(status)
		filters.Status = &s
	}
	if severity != "" {
		s := domain.AlertSeverity(severity)
		filters.Severity = &s
	}
	
	alerts, err := h.alertService.GetFiltered(ctx, filters)
	if err != nil {
		h.logger.Error().Err(err).Msg("Failed to fetch alerts")
		h.respondError(w, http.StatusInternalServerError, "FETCH_ERROR", "Failed to fetch alerts")
		return
	}
	
	h.respondJSON(w, http.StatusOK, alerts)
}

// GetAlert returns a single alert
func (h *Handler) GetAlert(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := chi.URLParam(r, "id")
	
	id, err := uuid.Parse(idStr)
	if err != nil {
		h.respondError(w, http.StatusBadRequest, "INVALID_ID", "Invalid alert ID format")
		return
	}
	
	alert, err := h.alertService.GetByID(ctx, id)
	if err != nil {
		h.respondError(w, http.StatusNotFound, "NOT_FOUND", "Alert not found")
		return
	}
	
	h.respondJSON(w, http.StatusOK, alert)
}

// AcknowledgeAlert marks an alert as acknowledged
func (h *Handler) AcknowledgeAlert(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := chi.URLParam(r, "id")
	
	id, err := uuid.Parse(idStr)
	if err != nil {
		h.respondError(w, http.StatusBadRequest, "INVALID_ID", "Invalid alert ID format")
		return
	}
	
	// TODO: Get user ID from auth context
	userID := uuid.New()
	
	alert, err := h.alertService.Acknowledge(ctx, id, userID)
	if err != nil {
		h.logger.Error().Err(err).Str("alertId", idStr).Msg("Failed to acknowledge alert")
		h.respondError(w, http.StatusInternalServerError, "UPDATE_ERROR", "Failed to acknowledge alert")
		return
	}
	
	h.respondJSON(w, http.StatusOK, alert)
}

// ResolveAlert marks an alert as resolved
func (h *Handler) ResolveAlert(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := chi.URLParam(r, "id")
	
	id, err := uuid.Parse(idStr)
	if err != nil {
		h.respondError(w, http.StatusBadRequest, "INVALID_ID", "Invalid alert ID format")
		return
	}
	
	// TODO: Get user ID from auth context
	userID := uuid.New()
	
	alert, err := h.alertService.Resolve(ctx, id, userID)
	if err != nil {
		h.logger.Error().Err(err).Str("alertId", idStr).Msg("Failed to resolve alert")
		h.respondError(w, http.StatusInternalServerError, "UPDATE_ERROR", "Failed to resolve alert")
		return
	}
	
	h.respondJSON(w, http.StatusOK, alert)
}

// ========== Analytics Handlers ==========

// GetFleetStats returns aggregated fleet statistics
func (h *Handler) GetFleetStats(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	stats, err := h.analyticsService.GetFleetStats(ctx)
	if err != nil {
		h.logger.Error().Err(err).Msg("Failed to fetch fleet stats")
		h.respondError(w, http.StatusInternalServerError, "FETCH_ERROR", "Failed to fetch fleet statistics")
		return
	}
	
	h.respondJSON(w, http.StatusOK, stats)
}

// GetConsumptionAnalytics returns fuel/energy consumption data
func (h *Handler) GetConsumptionAnalytics(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	period := r.URL.Query().Get("period")
	if period == "" {
		period = "7d"
	}
	
	data, err := h.analyticsService.GetConsumption(ctx, period)
	if err != nil {
		h.logger.Error().Err(err).Msg("Failed to fetch consumption analytics")
		h.respondError(w, http.StatusInternalServerError, "FETCH_ERROR", "Failed to fetch consumption data")
		return
	}
	
	h.respondJSON(w, http.StatusOK, data)
}

// GetDistanceAnalytics returns distance traveled data
func (h *Handler) GetDistanceAnalytics(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	period := r.URL.Query().Get("period")
	if period == "" {
		period = "7d"
	}
	
	data, err := h.analyticsService.GetDistance(ctx, period)
	if err != nil {
		h.logger.Error().Err(err).Msg("Failed to fetch distance analytics")
		h.respondError(w, http.StatusInternalServerError, "FETCH_ERROR", "Failed to fetch distance data")
		return
	}
	
	h.respondJSON(w, http.StatusOK, data)
}

// ========== Telemetry Handlers ==========

// IngestTelemetry receives telemetry data from vehicles/simulators
func (h *Handler) IngestTelemetry(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	var telemetry domain.Telemetry
	if err := json.NewDecoder(r.Body).Decode(&telemetry); err != nil {
		h.respondError(w, http.StatusBadRequest, "INVALID_BODY", "Invalid telemetry data")
		return
	}
	
	if err := h.telemetryService.Ingest(ctx, &telemetry); err != nil {
		h.logger.Error().Err(err).Msg("Failed to ingest telemetry")
		h.respondError(w, http.StatusInternalServerError, "INGEST_ERROR", "Failed to process telemetry")
		return
	}
	
	h.respondJSON(w, http.StatusAccepted, map[string]string{"status": "accepted"})
}

// BatchIngestTelemetry receives multiple telemetry records
func (h *Handler) BatchIngestTelemetry(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	var telemetryBatch []domain.Telemetry
	if err := json.NewDecoder(r.Body).Decode(&telemetryBatch); err != nil {
		h.respondError(w, http.StatusBadRequest, "INVALID_BODY", "Invalid telemetry data")
		return
	}
	
	if len(telemetryBatch) > 1000 {
		h.respondError(w, http.StatusBadRequest, "BATCH_TOO_LARGE", "Maximum 1000 records per batch")
		return
	}
	
	if err := h.telemetryService.BatchIngest(ctx, telemetryBatch); err != nil {
		h.logger.Error().Err(err).Int("count", len(telemetryBatch)).Msg("Failed to batch ingest telemetry")
		h.respondError(w, http.StatusInternalServerError, "INGEST_ERROR", "Failed to process telemetry batch")
		return
	}
	
	h.respondJSON(w, http.StatusAccepted, map[string]interface{}{
		"status":   "accepted",
		"received": len(telemetryBatch),
	})
}
