import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { MOCK_VEHICLES } from './constants';
import { generateFleetInsight } from './services/geminiService';
import { Vehicle } from './types';

// View Components
import Dashboard from './components/Dashboard';
import FleetStatus from './components/FleetStatus';
import LiveMap from './components/LiveMap';
import Analytics from './components/Analytics';
import Drivers from './components/Drivers';
import AlertsView from './components/AlertsView';
import Settings from './components/Settings';
import VehicleDetail from './components/VehicleDetail';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    setInsight(null);
    try {
      const result = await generateFleetInsight(MOCK_VEHICLES);
      setInsight(result);
    } catch (e) {
      setInsight("Could not generate insight.");
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = MOCK_VEHICLES.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
    }
  };

  const renderContent = () => {
    if (selectedVehicle) {
      return <VehicleDetail vehicle={selectedVehicle} onBack={() => setSelectedVehicle(null)} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard insight={insight} loadingInsight={loadingInsight} onGenerateInsight={handleGenerateInsight} onVehicleSelect={handleVehicleSelect} />;
      case 'fleet':
        return <FleetStatus onVehicleSelect={handleVehicleSelect} />;
      case 'map':
        return <LiveMap onVehicleSelect={handleVehicleSelect} />;
      case 'analytics':
        return <Analytics />;
      case 'drivers':
        return <Drivers />;
      case 'alerts':
        return <AlertsView />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard insight={insight} loadingInsight={loadingInsight} onGenerateInsight={handleGenerateInsight} onVehicleSelect={handleVehicleSelect} />;
    }
  };

  const getHeaderTitle = () => {
    if (selectedVehicle) {
      return 'Vehicle Details';
    }
    return activeTab === 'map' ? 'Live Map' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeTab={selectedVehicle ? 'fleet' : activeTab} // Highlight fleet tab when viewing vehicle detail
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedVehicle(null);
        }} 
        isOpen={isSidebarOpen} 
      />

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}
      >
        <Header 
          title={getHeaderTitle()} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        <main className={`flex-1 overflow-y-auto scrollbar-hide ${activeTab === 'map' && !selectedVehicle ? 'p-4' : 'p-4 lg:p-8'}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;