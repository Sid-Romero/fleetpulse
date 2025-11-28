import React from 'react';
import { User, Bell, Lock, Globe, Moon, Monitor, ChevronRight } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
       <div className="mb-8">
         <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
         <p className="text-slate-500">Manage your account preferences and application settings.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar Nav */}
          <div className="md:col-span-3 space-y-2">
             <button className="w-full flex items-center gap-3 px-4 py-3 bg-white text-indigo-600 font-medium rounded-xl shadow-sm border border-indigo-100">
                <User size={18} /> Profile
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors">
                <Bell size={18} /> Notifications
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors">
                <Lock size={18} /> Security
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors">
                <Globe size={18} /> Language
             </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-9 space-y-6">
             {/* Profile Card */}
             <div className="bg-white p-8 rounded-3xl shadow-soft border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Profile Information</h3>
                
                <div className="flex items-center gap-6 mb-8">
                   <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" className="w-24 h-24 rounded-full object-cover border-4 border-slate-50" alt="Profile" />
                   <div>
                      <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-glow-primary hover:bg-indigo-700 transition-colors mr-3">Change Photo</button>
                      <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">Remove</button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Full Name</label>
                      <input type="text" defaultValue="Qclay Admin" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Email Address</label>
                      <input type="email" defaultValue="admin@fleetpulse.com" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Role</label>
                      <input type="text" defaultValue="Fleet Manager" disabled className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Phone</label>
                      <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                   </div>
                </div>
             </div>

             {/* Preferences */}
             <div className="bg-white p-8 rounded-3xl shadow-soft border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Preferences</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white rounded-lg shadow-sm text-slate-600"><Moon size={20} /></div>
                         <div>
                            <p className="font-bold text-slate-900">Dark Mode</p>
                            <p className="text-xs text-slate-500">Switch between light and dark themes</p>
                         </div>
                      </div>
                      <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-pointer">
                         <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white rounded-lg shadow-sm text-slate-600"><Monitor size={20} /></div>
                         <div>
                            <p className="font-bold text-slate-900">Desktop Notifications</p>
                            <p className="text-xs text-slate-500">Receive alerts on your desktop</p>
                         </div>
                      </div>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                         <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="flex justify-end gap-3">
                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50">Cancel</button>
                <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-glow-primary hover:bg-indigo-700">Save Changes</button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Settings;