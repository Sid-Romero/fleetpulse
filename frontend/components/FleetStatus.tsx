import React, { useState } from 'react';
import { MOCK_VEHICLES } from '../constants';
import VehicleList from './VehicleList';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface FleetStatusProps {
  onVehicleSelect: (vehicleId: string) => void;
}

const FleetStatus: React.FC<FleetStatusProps> = ({ onVehicleSelect }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'maintenance' | 'charging'>('all');

  const filteredVehicles = MOCK_VEHICLES.filter(v => filter === 'all' || v.status === filter);

  const tabs = [
    { id: 'all', label: 'All Vehicles' },
    { id: 'active', label: 'Active' },
    { id: 'maintenance', label: 'In Maintenance' },
    { id: 'charging', label: 'Charging' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Fleet Status</h2>
          <p className="text-slate-500">Manage and monitor all vehicles in your fleet.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
              <Filter size={18} />
              <span>Filter</span>
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-glow-primary transition-colors">
              <SlidersHorizontal size={18} />
              <span>Manage Columns</span>
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-soft w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`
              px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${filter === tab.id 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <VehicleList vehicles={filteredVehicles} onVehicleSelect={onVehicleSelect} />
    </div>
  );
};

export default FleetStatus;