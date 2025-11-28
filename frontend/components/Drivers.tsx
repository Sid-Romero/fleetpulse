import React from 'react';
import { MOCK_VEHICLES } from '../constants';
import { Star, Shield, MapPin, Phone, Mail } from 'lucide-react';

const Drivers: React.FC = () => {
  // Use mock vehicles to derive drivers for demo purposes
  const drivers = MOCK_VEHICLES.map(v => ({
    ...v.driver,
    vehicleName: v.name,
    status: v.status,
    trips: Math.floor(Math.random() * 500) + 100,
    safetyScore: 90 + Math.floor(Math.random() * 10)
  }));

  // Add a few more mock drivers
  const extraDrivers = [
    { id: 'd5', name: 'James W.', avatar: 'https://i.pravatar.cc/150?u=james', rating: 4.5, vehicleName: 'Unassigned', status: 'idle', trips: 320, safetyScore: 88 },
    { id: 'd6', name: 'Elena R.', avatar: 'https://i.pravatar.cc/150?u=elena', rating: 4.9, vehicleName: 'Unassigned', status: 'idle', trips: 150, safetyScore: 98 },
  ];

  const allDrivers = [...drivers, ...extraDrivers];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
       <div>
         <h2 className="text-2xl font-bold text-slate-900">Drivers Directory</h2>
         <p className="text-slate-500">Manage driver profiles, performance, and assignments.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDrivers.map((driver, idx) => (
             <div key={idx} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 group hover:border-indigo-200 hover:shadow-glow-primary transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                   <div className="relative">
                      <img src={driver.avatar} alt={driver.name} className="w-20 h-20 rounded-2xl object-cover shadow-md" />
                      <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-lg text-[10px] font-bold uppercase text-white shadow-sm ${
                        driver.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}>
                        {driver.status}
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-amber-400 mb-1">
                         <Star size={16} fill="currentColor" />
                         <span className="text-slate-900 font-bold">{driver.rating}</span>
                      </div>
                      <p className="text-xs text-slate-400">Rating</p>
                   </div>
                </div>

                <div className="mb-6">
                   <h3 className="text-xl font-bold text-slate-900">{driver.name}</h3>
                   <p className="text-sm text-slate-500">ID: #{driver.id.toUpperCase()}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-2xl">
                   <div>
                      <p className="text-xs text-slate-500 mb-1">Total Trips</p>
                      <p className="font-bold text-slate-900">{driver.trips}</p>
                   </div>
                   <div>
                      <p className="text-xs text-slate-500 mb-1">Safety Score</p>
                      <div className="flex items-center gap-1 text-emerald-600 font-bold">
                         <Shield size={14} />
                         {driver.safetyScore}/100
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin size={16} className="text-slate-400" />
                      <span>{driver.vehicleName}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone size={16} className="text-slate-400" />
                      <span>+1 (555) 000-0000</span>
                   </div>
                </div>

                <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                   View Profile
                </button>
             </div>
          ))}
       </div>
    </div>
  );
};

export default Drivers;