import React from 'react';
import { MOCK_STATS, MOCK_VEHICLES, MOCK_ALERTS } from '../constants';
import StatCard from './StatCard';
import MapWidget from './MapWidget';
import VehicleList from './VehicleList';
import AlertsPanel from './AlertsPanel';
import { Sparkles, Loader2 } from 'lucide-react';

interface DashboardProps {
  insight: string | null;
  loadingInsight: boolean;
  onGenerateInsight: () => void;
  onVehicleSelect: (vehicleId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ insight, loadingInsight, onGenerateInsight, onVehicleSelect }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* AI Insight Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-indigo-400" size={20} />
              <h2 className="text-lg font-bold">Fleet Intelligence</h2>
            </div>
            {loadingInsight ? (
              <div className="flex items-center gap-2 text-slate-300 animate-pulse">
                <Loader2 size={16} className="animate-spin" /> Analyzing fleet telemetry...
              </div>
            ) : insight ? (
              <p className="text-indigo-100 leading-relaxed text-sm md:text-base">{insight}</p>
            ) : (
              <p className="text-slate-400 text-sm">Generate real-time AI analysis of your fleet's efficiency and maintenance needs.</p>
            )}
          </div>
          <button 
            onClick={onGenerateInsight}
            disabled={loadingInsight}
            className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-glow-primary whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingInsight ? 'Thinking...' : 'Analyze Fleet'}
          </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_STATS.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Live Location</h2>
              <MapWidget vehicles={MOCK_VEHICLES} onVehicleSelect={onVehicleSelect} />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Active Vehicles</h2>
              <button className="text-indigo-600 font-medium text-sm hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors">See All</button>
            </div>
            <VehicleList vehicles={MOCK_VEHICLES} onVehicleSelect={onVehicleSelect} />
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
            <AlertsPanel alerts={MOCK_ALERTS} />
            
            {/* Mini Climate/Details Card */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900">Fleet Efficiency</h3>
                <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><Sparkles size={16} /></button>
              </div>
              <div className="flex items-center justify-center py-4">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                      <circle cx="96" cy="96" r="88" stroke="#6366F1" strokeWidth="12" fill="transparent" strokeDasharray="552" strokeDashoffset="100" strokeLinecap="round" />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <span className="text-4xl font-bold text-slate-900 block">84%</span>
                      <span className="text-xs text-slate-500 uppercase font-medium">Eco Score</span>
                    </div>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <p className="text-xs text-emerald-600 font-bold mb-1">CO2 Saved</p>
                    <p className="text-lg font-bold text-slate-800">124kg</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-600 font-bold mb-1">Fuel Saved</p>
                    <p className="text-lg font-bold text-slate-800">$450</p>
                  </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;