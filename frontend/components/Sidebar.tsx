import React from 'react';
import { LayoutDashboard, Car, AlertTriangle, Settings, Users, BarChart3, MapPin, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fleet', label: 'Fleet Status', icon: Car },
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'}
        flex flex-col border-r border-slate-800
      `}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          {isOpen && (
            <span className="text-lg font-bold tracking-tight">FleetPulse</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-indigo-600/10 text-indigo-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              <div className={`relative ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                 <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                 {isActive && (
                   <span className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                 )}
              </div>
              
              {isOpen && (
                <span className={`font-medium text-sm ${isActive ? 'text-indigo-100' : ''}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
            alt="Admin" 
            className="w-10 h-10 rounded-full border-2 border-slate-700"
          />
          {isOpen && (
            <div className="text-left overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">Qclay Admin</p>
              <p className="text-xs text-slate-500 truncate">Fleet Manager</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
