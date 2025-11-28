import { Vehicle, Alert, Stat } from './types';

export const MOCK_STATS: Stat[] = [
  {
    label: 'Active Vehicles',
    value: '24',
    trend: 12,
    trendUp: true,
    icon: 'car',
    variant: 'blue'
  },
  {
    label: 'Critical Alerts',
    value: '3',
    trend: 2,
    trendUp: false, // Actually down is good for alerts, but let's assume trendUp means "increased"
    icon: 'alert',
    variant: 'amber'
  },
  {
    label: 'Total Distance',
    value: '1,847 km',
    trend: 8,
    trendUp: true,
    icon: 'map',
    variant: 'default'
  },
  {
    label: 'Avg Efficiency',
    value: '94%',
    trend: 3,
    trendUp: true,
    icon: 'battery',
    variant: 'emerald'
  }
];

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    vin: 'TSLA-S-99283',
    name: 'Logistics Unit A1',
    model: 'Tesla Semi',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    batteryLevel: 78,
    range: 420,
    location: { lat: 40.7128, lng: -74.0060, address: 'Broadway, New York' },
    speed: 65,
    driver: { id: 'd1', name: 'Alex M.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', rating: 4.9 },
    temperature: 21,
    odometer: 12450,
    efficiency: '1.8 kWh/km'
  },
  {
    id: 'v2',
    vin: 'MB-SPR-1102',
    name: 'Rapid Delivery 04',
    model: 'eSprinter Van',
    image: 'https://images.unsplash.com/photo-1591293836371-9231f827255f?auto=format&fit=crop&q=80&w=800',
    status: 'charging',
    batteryLevel: 24,
    range: 45,
    location: { lat: 40.7580, lng: -73.9855, address: 'Charging Station 4' },
    speed: 0,
    driver: { id: 'd2', name: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', rating: 4.7 },
    temperature: 19,
    odometer: 45200,
    efficiency: '22 kWh/100km'
  },
  {
    id: 'v3',
    vin: 'RIV-EDV-552',
    name: 'Urban Hauler X',
    model: 'Rivian EDV',
    image: 'https://images.unsplash.com/photo-1675258364539-780c74996459?auto=format&fit=crop&q=80&w=800',
    status: 'idle',
    batteryLevel: 92,
    range: 200,
    location: { lat: 40.7829, lng: -73.9654, address: 'Central Depot' },
    speed: 0,
    driver: { id: 'd3', name: 'Mike T.', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d', rating: 4.8 },
    temperature: 22,
    odometer: 8900,
    efficiency: '19 kWh/100km'
  },
  {
    id: 'v4',
    vin: 'VOL-FH-883',
    name: 'Heavy Freight 02',
    model: 'Volvo FH Electric',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    batteryLevel: 45,
    range: 180,
    location: { lat: 40.7484, lng: -73.9857, address: 'Empire State Delivery' },
    speed: 42,
    driver: { id: 'd4', name: 'David L.', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026708c', rating: 5.0 },
    temperature: 20,
    odometer: 85430,
    efficiency: '1.2 kWh/km'
  }
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'a1', type: 'critical', message: 'Tire pressure low - Vehicle v1', timestamp: '2 min ago', vehicleId: 'v1' },
  { id: 'a2', type: 'warning', message: 'Unexpected stop detected', timestamp: '15 min ago', vehicleId: 'v4' },
  { id: 'a3', type: 'info', message: 'Vehicle v2 started charging', timestamp: '1 hour ago', vehicleId: 'v2' },
];
