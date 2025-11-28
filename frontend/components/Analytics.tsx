import React from 'react';
import { TrendingUp, DollarSign, Zap, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-end gap-4">
         <div>
           <h2 className="text-2xl font-bold text-slate-900">Performance Analytics</h2>
           <p className="text-slate-500">Key metrics and efficiency trends for the current period.</p>
         </div>
         <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
            <button className="px-3 py-1 text-sm font-medium bg-slate-100 text-slate-900 rounded-md">Weekly</button>
            <button className="px-3 py-1 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-md">Monthly</button>
            <button className="px-3 py-1 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-md">Yearly</button>
         </div>
       </div>

       {/* Top Metrics */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-200">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><DollarSign size={24} /></div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={12} /> 12%
                </div>
             </div>
             <p className="text-slate-500 text-sm font-medium">Operational Savings</p>
             <h3 className="text-3xl font-bold text-slate-900">$24,500</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-200">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Zap size={24} /></div>
                <div className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={12} /> 5%
                </div>
             </div>
             <p className="text-slate-500 text-sm font-medium">Energy Efficiency</p>
             <h3 className="text-3xl font-bold text-slate-900">14.2 <span className="text-lg text-slate-400 font-normal">kWh/100km</span></h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-200">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><TrendingUp size={24} /></div>
                <div className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                  <ArrowDownRight size={12} /> 2%
                </div>
             </div>
             <p className="text-slate-500 text-sm font-medium">Total Distance</p>
             <h3 className="text-3xl font-bold text-slate-900">128,450 <span className="text-lg text-slate-400 font-normal">km</span></h3>
          </div>
       </div>

       {/* Charts Row */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart (CSS) */}
          <div className="bg-white p-8 rounded-3xl shadow-soft border border-slate-200">
             <h3 className="text-lg font-bold text-slate-900 mb-6">Weekly Fleet Usage</h3>
             <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
                {[45, 70, 35, 90, 60, 20, 50].map((h, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full bg-slate-100 rounded-t-xl relative h-full overflow-hidden">
                         <div 
                           className="absolute bottom-0 inset-x-0 bg-indigo-500 rounded-t-xl transition-all duration-1000 group-hover:bg-indigo-600"
                           style={{ height: `${h}%` }}
                         ></div>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                         {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                   </div>
                ))}
             </div>
          </div>

          {/* Activity Heatmap Mock */}
          <div className="bg-white p-8 rounded-3xl shadow-soft border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Maintenance Schedule</h3>
            <div className="space-y-4">
               {[
                 { vehicle: 'Logistics Unit A1', status: 'Scheduled', date: 'Tomorrow, 09:00 AM', type: 'Tire Rotation' },
                 { vehicle: 'Heavy Freight 02', status: 'Overdue', date: 'Yesterday', type: 'Battery Inspection', urgent: true },
                 { vehicle: 'Urban Hauler X', status: 'Completed', date: 'Oct 24, 2023', type: 'Software Update' }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                       <div className={`w-2 h-12 rounded-full ${item.urgent ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                       <div>
                          <p className="font-bold text-slate-900">{item.vehicle}</p>
                          <p className="text-xs text-slate-500">{item.type}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-sm font-bold ${item.urgent ? 'text-rose-600' : 'text-slate-700'}`}>{item.status}</p>
                       <p className="text-xs text-slate-400">{item.date}</p>
                    </div>
                 </div>
               ))}
               <button className="w-full py-3 mt-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                  View Full Schedule
               </button>
            </div>
          </div>
       </div>
    </div>
  );
};

export default Analytics;