import React from 'react';
import MapWidget from './MapWidget';
import { MOCK_VEHICLES } from '../constants';
import { Search } from 'lucide-react';

interface LiveMapProps {
  onVehicleSelect: (vehicleId: string) => void;
}

const LiveMap: React.FC<LiveMapProps> = ({ onVehicleSelect }) => {
  return (
    <div className="h-[calc(100vh-8rem)] w-full flex flex-col gap-4 animate-fade-in">
       <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Live Operations Map</h2>
            <p className="text-slate-500 text-sm">Real-time geospatial tracking of all assets.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 w-64">
            <Search size={18} className="text-slate-400" />
            <input placeholder="Find vehicle on map..." className="bg-transparent text-sm outline-none w-full" />
          </div>
       </div>
       <div className="flex-1 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
         <MapWidget vehicles={MOCK_VEHICLES} className="h-full w-full bg-slate-100" onVehicleSelect={onVehicleSelect} />
       </div>
    </div>
  );
};

export default LiveMap;