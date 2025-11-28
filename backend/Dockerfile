# ============================================
# FleetPulse API - Multi-stage Dockerfile
# ============================================

# Stage 1: Build
FROM golang:1.23-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s -X main.version=$(git describe --tags --always --dirty 2>/dev/null || echo 'dev')" \
    -o /app/bin/api \
    ./cmd/api

# Stage 2: Runtime
FROM alpine:3.19 AS runtime

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

# Create non-root user
RUN addgroup -g 1000 fleetpulse && \
    adduser -u 1000 -G fleetpulse -s /bin/sh -D fleetpulse

# Set working directory
WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/bin/api /app/api

# Copy migrations if needed
# COPY --from=builder /app/migrations /app/migrations

# Set ownership
RUN chown -R fleetpulse:fleetpulse /app

# Switch to non-root user
USER fleetpulse

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run the binary
ENTRYPOINT ["/app/api"]
