import React from 'react';
import { Car, AlertTriangle, Map, Fuel, Battery, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Stat } from '../types';

interface StatCardProps {
  stat: Stat;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const isGradient = stat.variant && stat.variant !== 'default';
  
  const getGradient = () => {
    switch (stat.variant) {
      case 'blue': return 'bg-gradient-stat-blue text-white';
      case 'emerald': return 'bg-gradient-stat-emerald text-white';
      case 'violet': return 'bg-gradient-stat-violet text-white';
      case 'amber': return 'bg-gradient-stat-amber text-white';
      default: return 'bg-white text-slate-900 border border-slate-200';
    }
  };

  const getIcon = () => {
    switch (stat.icon) {
      case 'car': return Car;
      case 'alert': return AlertTriangle;
      case 'fuel': return Fuel;
      case 'battery': return Battery;
      default: return Map;
    }
  };

  const Icon = getIcon();

  return (
    <div className={`relative p-6 rounded-3xl shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${getGradient()}`}>
      {/* Background Icon Decoration for Gradient Cards */}
      {isGradient && (
        <Icon 
          className="absolute right-[-20px] bottom-[-20px] text-white opacity-10 w-32 h-32 rotate-[-15deg]" 
        />
      )}

      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${isGradient ? 'bg-white/20 backdrop-blur-sm' : 'bg-slate-100'}`}>
          <Icon className={`w-6 h-6 ${isGradient ? 'text-white' : 'text-slate-600'}`} />
        </div>
        {stat.trend !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isGradient 
              ? 'bg-white/20 text-white' 
              : stat.trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {stat.trend}%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className={`text-3xl font-bold mb-1 tracking-tight font-sans ${isGradient ? 'text-white' : 'text-slate-900'}`}>
          {stat.value}
        </h3>
        <p className={`text-sm font-medium ${isGradient ? 'text-white/80' : 'text-slate-500'}`}>
          {stat.label}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
