import React from 'react';
import { Alert } from '../types';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Live Alerts</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          let Icon = Info;
          let colorClass = 'bg-blue-50 text-blue-600 border-blue-100';
          
          if (alert.type === 'critical') {
            Icon = AlertCircle;
            colorClass = 'bg-red-50 text-red-600 border-red-100';
          } else if (alert.type === 'warning') {
            Icon = AlertTriangle;
            colorClass = 'bg-amber-50 text-amber-600 border-amber-100';
          }

          return (
            <div key={alert.id} className="group flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${colorClass}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm text-slate-800 leading-tight mb-1">{alert.message}</p>
                    <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{alert.timestamp}</span>
                 </div>
                 <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-medium text-indigo-600 hover:underline">Details</button>
                    <button className="text-xs font-medium text-slate-500 hover:text-slate-800">Dismiss</button>
                 </div>
              </div>
            </div>
          );
        })}

        {alerts.length === 0 && (
           <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <CheckCircle2 size={40} className="mb-2 text-emerald-500" />
              <p>All systems normal</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
