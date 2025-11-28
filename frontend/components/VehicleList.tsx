import React from 'react';
import { Vehicle } from '../types';
import { Battery, Zap, Gauge, MoreHorizontal } from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
  onVehicleSelect?: (vehicleId: string) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onVehicleSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
      {vehicles.map((vehicle) => (
        <div 
          key={vehicle.id} 
          onClick={() => onVehicleSelect && onVehicleSelect(vehicle.id)}
          className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 group ${onVehicleSelect ? 'cursor-pointer hover:-translate-y-1' : ''}`}
        >
          {/* Header Image Area */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={vehicle.image} 
              alt={vehicle.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 right-4">
              <span className={`
                px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md shadow-sm
                ${vehicle.status === 'active' ? 'bg-emerald-500/90 text-white' : 
                  vehicle.status === 'maintenance' ? 'bg-red-500/90 text-white' : 
                  vehicle.status === 'charging' ? 'bg-amber-500/90 text-white' :
                  'bg-slate-500/90 text-white'}
              `}>
                {vehicle.status}
              </span>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-end justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">{vehicle.name}</h3>
                <p className="text-slate-300 text-xs font-mono">{vehicle.vin}</p>
              </div>
              <button className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Body Stats */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                  <img src={vehicle.driver.avatar} alt={vehicle.driver.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{vehicle.driver.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500">Driver Rating</span>
                      <span className="text-xs font-bold text-indigo-600">{vehicle.driver.rating} ★</span>
                    </div>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900 font-mono">{vehicle.speed} <span className="text-sm text-slate-500 font-sans">km/h</span></p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-100">
               <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50">
                  <Battery size={18} className="text-indigo-500 mb-1" />
                  <span className="text-sm font-bold text-slate-700">{vehicle.batteryLevel}%</span>
                  <span className="text-[10px] text-slate-500 uppercase">Charge</span>
               </div>
               <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50">
                  <Gauge size={18} className="text-indigo-500 mb-1" />
                  <span className="text-sm font-bold text-slate-700">{vehicle.range}</span>
                  <span className="text-[10px] text-slate-500 uppercase">Range (km)</span>
               </div>
               <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50">
                  <Zap size={18} className="text-indigo-500 mb-1" />
                  <span className="text-sm font-bold text-slate-700">{vehicle.efficiency.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-500 uppercase">Eff.</span>
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleList;