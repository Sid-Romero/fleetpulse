import React from 'react';
import { Vehicle } from '../types';
import { ArrowLeft, Battery, Gauge, Zap, MapPin, Thermometer, User, Clock, Shield, Activity, Wrench, Calendar, FileText, Lock } from 'lucide-react';

interface VehicleDetailProps {
  vehicle: Vehicle;
  onBack: () => void;
}

const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle, onBack }) => {
  // Mock maintenance data
  const maintenanceHistory = [
    { date: '2023-10-15', type: 'Tire Rotation', status: 'Completed', cost: '$120' },
    { date: '2023-09-01', type: 'Annual Inspection', status: 'Completed', cost: '$450' },
    { date: '2023-06-20', type: 'Software Update 2.1', status: 'Completed', cost: '$0' },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-6">
      {/* Header / Nav */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium mb-2"
      >
        <ArrowLeft size={20} />
        Back to Fleet
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info (2/3) */}
        <div className="lg:col-span-2 space-y-8">
            {/* Hero Card */}
            <div className="bg-white rounded-3xl p-1 shadow-soft border border-slate-200 overflow-hidden group">
               <div className="relative h-64 md:h-80 rounded-t-2xl overflow-hidden">
                  <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md border border-white/20
                          ${vehicle.status === 'active' ? 'bg-emerald-500/80' : 
                            vehicle.status === 'maintenance' ? 'bg-red-500/80' : 
                            'bg-amber-500/80'}
                        `}>
                          {vehicle.status}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md bg-white/10 border border-white/20">
                          {vehicle.model}
                        </span>
                      </div>
                      <h1 className="text-4xl font-bold mb-2">{vehicle.name}</h1>
                      <p className="font-mono opacity-80">{vehicle.vin}</p>
                  </div>
               </div>
               
               {/* Quick Stats Strip */}
               <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 bg-white rounded-b-3xl">
                  <div className="p-6 flex flex-col items-center justify-center text-center">
                     <span className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1"><Battery size={16} className="text-indigo-500" /> Battery</span>
                     <span className="text-2xl font-bold text-slate-900">{vehicle.batteryLevel}%</span>
                  </div>
                   <div className="p-6 flex flex-col items-center justify-center text-center">
                     <span className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1"><Gauge size={16} className="text-indigo-500" /> Range</span>
                     <span className="text-2xl font-bold text-slate-900">{vehicle.range} km</span>
                  </div>
                   <div className="p-6 flex flex-col items-center justify-center text-center">
                     <span className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1"><Activity size={16} className="text-indigo-500" /> Odometer</span>
                     <span className="text-2xl font-bold text-slate-900">{(vehicle.odometer / 1000).toFixed(1)}k</span>
                  </div>
                   <div className="p-6 flex flex-col items-center justify-center text-center">
                     <span className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1"><Zap size={16} className="text-indigo-500" /> Efficiency</span>
                     <span className="text-2xl font-bold text-slate-900">{vehicle.efficiency.split(' ')[0]}</span>
                  </div>
               </div>
            </div>

            {/* Diagnostics & Specs */}
             <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-200">
               <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <Wrench size={20} className="text-slate-400" /> Technical Diagnostics
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-slate-500">Cabin Temperature</span>
                        <span className="font-medium text-slate-900 flex items-center gap-2"><Thermometer size={16} className="text-slate-400"/> {vehicle.temperature}°C</span>
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-slate-500">Tire Pressure</span>
                        <span className="font-medium text-slate-900 text-emerald-600">Optimal (36 PSI)</span>
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-slate-500">Last Sync</span>
                        <span className="font-medium text-slate-900">2 mins ago</span>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-slate-500">Software Version</span>
                        <span className="font-medium text-slate-900">v2023.44.1</span>
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-slate-500">Battery Health</span>
                        <span className="font-medium text-emerald-600">98% (Excellent)</span>
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-slate-500">Next Service</span>
                        <span className="font-medium text-slate-900">in 4,500 km</span>
                     </div>
                  </div>
               </div>
             </div>

             {/* Maintenance History */}
             <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <FileText size={20} className="text-slate-400" /> Maintenance History
               </h3>
               <div className="overflow-hidden rounded-xl border border-slate-100">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-500">
                     <tr>
                       <th className="px-6 py-4 font-medium">Date</th>
                       <th className="px-6 py-4 font-medium">Service Type</th>
                       <th className="px-6 py-4 font-medium">Cost</th>
                       <th className="px-6 py-4 font-medium text-right">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {maintenanceHistory.map((log, idx) => (
                       <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                           <Calendar size={14} className="text-slate-400" /> {log.date}
                         </td>
                         <td className="px-6 py-4 font-medium text-slate-900">{log.type}</td>
                         <td className="px-6 py-4 text-slate-600">{log.cost}</td>
                         <td className="px-6 py-4 text-right">
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                             {log.status}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
            {/* Driver Card */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Assigned Driver</h3>
               <div className="flex items-center gap-4 mb-6">
                 <img src={vehicle.driver.avatar} alt={vehicle.driver.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                 <div>
                   <h4 className="text-xl font-bold text-slate-900">{vehicle.driver.name}</h4>
                   <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                     <span>★ {vehicle.driver.rating}</span>
                     <span className="text-slate-400 font-normal ml-1">Rating</span>
                   </div>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-3 mb-4">
                 <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Safety Score</p>
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Shield size={14} className="text-indigo-500"/> 98/100
                    </div>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Shift Time</p>
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Clock size={14} className="text-indigo-500"/> 4h 12m
                    </div>
                 </div>
               </div>
               <button className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-xl transition-colors">
                  Contact Driver
               </button>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Current Location</h3>
                <div className="bg-slate-100 rounded-xl h-40 w-full mb-4 relative overflow-hidden flex items-center justify-center">
                   {/* Abstract Map Background similar to MapWidget */}
                   <div className="absolute inset-0 opacity-50" style={{
                       backgroundImage: `linear-gradient(#cbd5e1 2px, transparent 2px), linear-gradient(90deg, #cbd5e1 2px, transparent 2px)`,
                       backgroundSize: '20px 20px'
                   }}></div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                   </div>
                   <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-slate-500">
                      Live
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <MapPin className="text-indigo-600 mt-1 shrink-0" size={20} />
                   <div>
                      <p className="font-bold text-slate-900 leading-tight mb-1">{vehicle.location.address}</p>
                      <p className="text-xs text-slate-500 font-mono">{vehicle.location.lat.toFixed(4)}, {vehicle.location.lng.toFixed(4)}</p>
                   </div>
                </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-gradient-primary rounded-3xl p-6 shadow-glow-primary text-white">
               <h3 className="font-bold text-lg mb-4">Actions</h3>
               <div className="space-y-3">
                  <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-medium transition-colors text-left px-4 flex items-center gap-3">
                     <div className="p-1 bg-white rounded text-indigo-600"><Zap size={14}/></div> Remote Start
                  </button>
                  <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-medium transition-colors text-left px-4 flex items-center gap-3">
                     <div className="p-1 bg-white rounded text-indigo-600"><Lock size={14}/></div> Lock Doors
                  </button>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;