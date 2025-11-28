import React from 'react';
import { MapPin, Navigation, LocateFixed } from 'lucide-react';
import { Vehicle } from '../types';

interface MapWidgetProps {
  vehicles: Vehicle[];
  className?: string;
  onVehicleSelect?: (vehicleId: string) => void;
}

const MapWidget: React.FC<MapWidgetProps> = ({ vehicles, className, onVehicleSelect }) => {
  return (
    <div className={`relative w-full bg-slate-100 overflow-hidden border border-slate-200 shadow-soft group ${className || 'h-[400px] rounded-3xl'}`}>
      {/* Abstract Map Background */}
      <div className="absolute inset-0 bg-[#e5e7eb] opacity-60">
        {/* Creating a grid pattern to simulate streets */}
        <div className="w-full h-full" 
             style={{
               backgroundImage: `linear-gradient(#cbd5e1 2px, transparent 2px), linear-gradient(90deg, #cbd5e1 2px, transparent 2px)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
        {/* Simulated major roads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
           <path d="M-10 100 Q 150 150 400 100 T 800 200" stroke="#94a3b8" strokeWidth="8" fill="none" />
           <path d="M200 -10 L 250 450" stroke="#94a3b8" strokeWidth="8" fill="none" />
           <path d="M50 300 Q 300 350 500 250" stroke="#94a3b8" strokeWidth="6" fill="none" />
           <path d="M600 0 L 600 800" stroke="#94a3b8" strokeWidth="6" fill="none" />
           <path d="M0 500 L 1000 500" stroke="#94a3b8" strokeWidth="6" fill="none" />
        </svg>
      </div>

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
         <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors">
            <LocateFixed size={20} />
         </button>
         <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors">
            <Navigation size={20} />
         </button>
      </div>

      <div className="absolute top-4 left-4 z-20">
        <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-sm font-semibold text-slate-700">Live Tracking</span>
        </div>
      </div>

      {/* Vehicle Markers */}
      {vehicles.map((vehicle, index) => {
        // Randomly offset mock positions for the visual map
        // Use vehicle ID to generate deterministic pseudo-random positions if needed, 
        // but simple math here is fine for the mock
        const top = (parseInt(vehicle.id.slice(-1)) * 13 + 20) % 80;
        const left = (parseInt(vehicle.id.slice(-1)) * 23 + 10) % 80;
        
        return (
          <div 
            key={vehicle.id}
            onClick={(e) => {
              e.stopPropagation();
              onVehicleSelect && onVehicleSelect(vehicle.id);
            }}
            className="absolute z-10 cursor-pointer group/marker transition-all duration-500 ease-in-out hover:z-30"
            style={{ top: `${top}%`, left: `${left}%` }}
          >
            <div className="relative flex items-center justify-center">
               {/* Pulse Effect */}
               <div className={`absolute w-12 h-12 rounded-full opacity-20 animate-ping ${
                 vehicle.status === 'active' ? 'bg-indigo-500' : 
                 vehicle.status === 'maintenance' ? 'bg-red-500' : 'bg-slate-500'
               }`}></div>
               
               {/* Marker Pin */}
               <div className={`
                 w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform transition-transform group-hover/marker:scale-110
                 ${vehicle.status === 'active' ? 'bg-indigo-600' : 
                   vehicle.status === 'maintenance' ? 'bg-red-500' : 'bg-slate-700'}
               `}>
                 <MapPin size={16} className="text-white" />
               </div>

               {/* Tooltip */}
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 min-w-[140px] opacity-0 group-hover/marker:opacity-100 transition-opacity duration-200 pointer-events-none">
                 <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs">
                    <p className="font-bold mb-1">{vehicle.name}</p>
                    <p className="text-slate-400">{vehicle.speed} km/h • {vehicle.batteryLevel}% Bat</p>
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
                 </div>
               </div>
            </div>
          </div>
        );
      })}

      {/* Path Line (Mock active route) */}
       <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
         <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
               <stop offset="100%" stopColor="#6366F1" stopOpacity="1" />
            </linearGradient>
         </defs>
         {/* Drawing a line connecting the dots roughly for effect */}
         <path 
           d={`M ${30}% ${30}% Q ${50}% ${50}% ${70}% ${40}%`} 
           stroke="url(#routeGradient)" 
           strokeWidth="3" 
           strokeDasharray="6 4"
           fill="none" 
           className="animate-pulse"
         />
       </svg>

      <div className="absolute bottom-6 left-6 right-6 z-20">
         <div className="glass-card p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Current Route</p>
              <h4 className="font-bold text-slate-800">412 North City Road #14-3</h4>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-glow-primary transition-all">
               Share Live
            </button>
         </div>
      </div>
    </div>
  );
};

export default MapWidget;