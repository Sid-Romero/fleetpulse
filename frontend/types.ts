export type VehicleStatus = 'active' | 'maintenance' | 'idle' | 'charging';

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
}

export interface Vehicle {
  id: string;
  vin: string;
  name: string;
  model: string;
  image: string;
  status: VehicleStatus;
  batteryLevel: number; // 0-100
  fuelLevel?: number; // 0-100
  range: number; // km
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  speed: number; // km/h
  driver: Driver;
  temperature: number; // Celsius inside
  odometer: number;
  efficiency: string; // e.g., "18.5 kWh/100km"
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  vehicleId?: string;
}

export interface Stat {
  label: string;
  value: string;
  trend: number; // percentage
  trendUp: boolean; // true if good, false if bad direction
  icon: 'car' | 'alert' | 'map' | 'fuel' | 'battery';
  variant?: 'default' | 'blue' | 'emerald' | 'violet' | 'amber';
}
