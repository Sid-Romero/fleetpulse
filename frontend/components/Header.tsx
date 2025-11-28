import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-lg border-b border-slate-200 h-20 flex items-center px-6 lg:px-8 justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-500 hover:bg-slate-200 rounded-lg lg:hidden">
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="text-xs text-slate-500 hidden sm:block">Real-time fleet monitoring</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {/* Search */}
        <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-full px-4 py-2.5 w-64 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-sm">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search vehicle, driver..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-700"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
