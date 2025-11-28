import React from 'react';
import { MOCK_ALERTS } from '../constants';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Clock, Trash2, Filter } from 'lucide-react';

const AlertsView: React.FC = () => {
  // Mock more alerts for the view
  const alerts = [
    ...MOCK_ALERTS,
    { id: 'a4', type: 'warning' as const, message: 'Geofence exit detected: Unit A1', timestamp: '3 hours ago', vehicleId: 'v1' },
    { id: 'a5', type: 'info' as const, message: 'Scheduled maintenance upcoming', timestamp: '5 hours ago', vehicleId: 'v3' },
    { id: 'a6', type: 'critical' as const, message: 'Battery temperature warning', timestamp: 'Yesterday', vehicleId: 'v4' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertCircle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-2xl font-bold text-slate-900">System Alerts</h2>
           <p className="text-slate-500">Notifications, warnings, and critical events.</p>
         </div>
         <div className="flex gap-2">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Filter size={20} /></button>
            <button className="text-sm font-medium text-slate-600 bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">Mark all as read</button>
         </div>
       </div>

       <div className="bg-white rounded-3xl shadow-soft border border-slate-200 overflow-hidden">
          {alerts.map((alert, idx) => {
             const Icon = getIcon(alert.type);
             const colorClass = getColor(alert.type);
             
             return (
                <div key={idx} className="flex items-start gap-4 p-6 border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${colorClass}`}>
                      <Icon size={24} />
                   </div>
                   <div className="flex-1 pt-1">
                      <div className="flex justify-between items-start mb-1">
                         <h4 className="font-bold text-slate-900">{alert.type.toUpperCase()} ALERT</h4>
                         <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                           <Clock size={12} /> {alert.timestamp}
                         </span>
                      </div>
                      <p className="text-slate-600 mb-2">{alert.message}</p>
                      <div className="flex items-center gap-3">
                         <span className="text-xs font-mono px-2 py-1 bg-slate-100 rounded text-slate-500">ID: {alert.vehicleId || 'SYSTEM'}</span>
                         <button className="text-xs font-bold text-indigo-600 hover:underline">View Diagnostics</button>
                      </div>
                   </div>
                   <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 transition-all">
                      <Trash2 size={18} />
                   </button>
                </div>
             );
          })}
          <div className="p-4 text-center bg-slate-50 text-slate-500 text-sm font-medium hover:bg-slate-100 cursor-pointer transition-colors">
             Load older alerts
          </div>
       </div>
    </div>
  );
};

export default AlertsView;