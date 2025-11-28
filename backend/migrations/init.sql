-- ============================================
-- FleetPulse Database Schema
-- Version: 1.0.0
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================
-- ENUM Types
-- ============================================

CREATE TYPE vehicle_status AS ENUM ('active', 'maintenance', 'idle', 'charging');
CREATE TYPE alert_severity AS ENUM ('critical', 'warning', 'info');
CREATE TYPE alert_status AS ENUM ('active', 'acknowledged', 'resolved');

-- ============================================
-- Tables
-- ============================================

-- Drivers table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    avatar VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vin VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    status vehicle_status DEFAULT 'idle',
    battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
    fuel_level INTEGER CHECK (fuel_level >= 0 AND fuel_level <= 100),
    range_km INTEGER DEFAULT 0,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address VARCHAR(500),
    speed DECIMAL(5, 2) DEFAULT 0,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    temperature DECIMAL(4, 1),
    odometer INTEGER DEFAULT 0,
    efficiency VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    severity alert_severity NOT NULL,
    status alert_status DEFAULT 'active',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES drivers(id),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES drivers(id)
);

-- Telemetry table (time-series data)
CREATE TABLE telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    speed DECIMAL(5, 2),
    battery_level INTEGER,
    fuel_level INTEGER,
    engine_temp DECIMAL(4, 1),
    engine_rpm INTEGER,
    heading DECIMAL(5, 2)
);

-- Maintenance records table
CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    cost DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'scheduled',
    technician VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Geofences table
CREATE TABLE geofences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'circle' or 'polygon'
    center_lat DECIMAL(10, 8),
    center_lng DECIMAL(11, 8),
    radius_meters DECIMAL(10, 2),
    polygon JSONB, -- Array of {lat, lng} points
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================

-- Vehicles indexes
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_driver ON vehicles(driver_id);
CREATE INDEX idx_vehicles_location ON vehicles(latitude, longitude);

-- Alerts indexes
CREATE INDEX idx_alerts_vehicle ON alerts(vehicle_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);

-- Telemetry indexes (optimized for time-series queries)
CREATE INDEX idx_telemetry_vehicle_time ON telemetry(vehicle_id, timestamp DESC);
CREATE INDEX idx_telemetry_timestamp ON telemetry(timestamp DESC);

-- Maintenance indexes
CREATE INDEX idx_maintenance_vehicle ON maintenance_records(vehicle_id);
CREATE INDEX idx_maintenance_date ON maintenance_records(date DESC);

-- ============================================
-- Triggers
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER drivers_updated_at
    BEFORE UPDATE ON drivers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Seed Data (Development)
-- ============================================

-- Insert sample drivers
INSERT INTO drivers (id, name, email, avatar, rating) VALUES
    ('d1111111-1111-1111-1111-111111111111', 'Alex M.', 'alex@fleetpulse.dev', 'https://i.pravatar.cc/150?u=a042581f4e29026024d', 4.9),
    ('d2222222-2222-2222-2222-222222222222', 'Sarah J.', 'sarah@fleetpulse.dev', 'https://i.pravatar.cc/150?u=a042581f4e29026704d', 4.7),
    ('d3333333-3333-3333-3333-333333333333', 'Mike T.', 'mike@fleetpulse.dev', 'https://i.pravatar.cc/150?u=a04258114e29026302d', 4.8),
    ('d4444444-4444-4444-4444-444444444444', 'David L.', 'david@fleetpulse.dev', 'https://i.pravatar.cc/150?u=a04258114e29026708c', 5.0);

-- Insert sample vehicles
INSERT INTO vehicles (id, vin, name, model, brand, image, status, battery_level, range_km, latitude, longitude, address, speed, driver_id, temperature, odometer, efficiency) VALUES
    ('11111111-1111-1111-1111-111111111111', 'TSLA-S-99283', 'Logistics Unit A1', 'Tesla Semi', 'Tesla', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800', 'active', 78, 420, 40.7128, -74.0060, 'Broadway, New York', 65, 'd1111111-1111-1111-1111-111111111111', 21, 12450, '1.8 kWh/km'),
    ('22222222-2222-2222-2222-222222222222', 'MB-SPR-1102', 'Rapid Delivery 04', 'eSprinter Van', 'Mercedes-Benz', 'https://images.unsplash.com/photo-1591293836371-9231f827255f?auto=format&fit=crop&q=80&w=800', 'charging', 24, 45, 40.7580, -73.9855, 'Charging Station 4', 0, 'd2222222-2222-2222-2222-222222222222', 19, 45200, '22 kWh/100km'),
    ('33333333-3333-3333-3333-333333333333', 'RIV-EDV-552', 'Urban Hauler X', 'Rivian EDV', 'Rivian', 'https://images.unsplash.com/photo-1675258364539-780c74996459?auto=format&fit=crop&q=80&w=800', 'idle', 92, 200, 40.7829, -73.9654, 'Central Depot', 0, 'd3333333-3333-3333-3333-333333333333', 22, 8900, '19 kWh/100km'),
    ('44444444-4444-4444-4444-444444444444', 'VOL-FH-883', 'Heavy Freight 02', 'Volvo FH Electric', 'Volvo', 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800', 'active', 45, 180, 40.7484, -73.9857, 'Empire State Delivery', 42, 'd4444444-4444-4444-4444-444444444444', 20, 85430, '1.2 kWh/km');

-- Insert sample alerts
INSERT INTO alerts (id, vehicle_id, type, severity, status, message) VALUES
    ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'tire_pressure', 'critical', 'active', 'Tire pressure low - Vehicle v1'),
    ('a2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'unexpected_stop', 'warning', 'active', 'Unexpected stop detected'),
    ('a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'charging_started', 'info', 'active', 'Vehicle v2 started charging');

-- ============================================
-- Views (for analytics)
-- ============================================

-- Fleet statistics view
CREATE VIEW fleet_stats AS
SELECT
    COUNT(*) FILTER (WHERE status = 'active') as active_vehicles,
    COUNT(*) as total_vehicles,
    COUNT(*) FILTER (WHERE status = 'charging') as vehicles_charging,
    AVG(battery_level) as avg_battery_level,
    SUM(odometer) as total_distance,
    (SELECT COUNT(*) FROM alerts WHERE status = 'active' AND severity = 'critical') as critical_alerts
FROM vehicles;

-- Print success message
DO $$
BEGIN
    RAISE NOTICE 'FleetPulse database schema created successfully!';
END $$;
