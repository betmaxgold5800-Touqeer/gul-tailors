import React, { useState } from 'react';
import Dashboard from './views/Dashboard';
import Clients from './views/Clients';
import Workers from './views/Workers';
import Wholesalers from './views/Wholesalers';
import MoreSection from './views/MoreSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Industry standard mockup state data
  const [clients, setClients] = useState([
    { id: 1, name: 'Asif Ali', phone: '923001234567', udhaar: 4500, suitType: 'Shalwar Kameez', deliveryDate: '2026-06-15' },
    { id: 2, name: 'Kamran Khan', phone: '923219876543', udhaar: 0, suitType: 'Kurta Pajama', deliveryDate: '2026-06-12' }
  ]);

  const [workers, setWorkers] = useState([
    { id: 1, name: 'Zahid Karigar', phone: '923123456789', payable: 12000, specializedIn: 'Suit Stitching', activeSuits: 5 },
    { id: 2, name: 'Sajid Master', phone: '923334445555', payable: 3500, specializedIn: 'Cutting', activeSuits: 2 }
  ]);

  const [wholesalers, setWholesalers] = useState([
    { id: 1, name: 'Faisalabad Cloth House', phone: '923007654321', balance: 25000, item: 'Latha & Wash n Wear' }
  ]);

  // Global handlers for Edit and Delete
  const handleDelete = (type, id) => {
    if (window.confirm(`Kya aap is ${type} ko waqai delete karna chahte hain?`)) {
      if (type === 'client') setClients(clients.filter(c => c.id !== id));
      if (type === 'worker') setWorkers(workers.filter(w => w.id !== id));
      if (type === 'wholesaler') setWholesalers(wholesalers.filter(ws => ws.id !== id));
    }
  };

  const handleEdit = (type, item) => {
    const newName = prompt(`Enter new name for ${item.name}:`, item.name);
    if (!newName) return;
    
    if (type === 'client') setClients(clients.map(c => c.id === item.id ? { ...c, name: newName } : c));
    if (type === 'worker') setWorkers(workers.map(w => w.id === item.id ? { ...w, name: newName } : w));
    if (type === 'wholesaler') setWholesalers(wholesalers.map(ws => ws.id === item.id ? { ...ws, name: newName } : ws));
  };

  const navigateTo = (tabName) => {
    setActiveTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fdf6e9] pb-24 font-sans text-[#1a1a1a]">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#1f1610] px-4 py-4 shadow-xl border-b border-[#cca464]/25">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✂️</span>
          <h1 className="text-xl font-black tracking-wider text-[#cca464]">GUL TAILORS</h1>
        </div>
        <div className="rounded-full bg-[#cca464]/10 px-3 py-1 border border-[#cca464]/30">
          <span className="text-xs font-bold text-[#cca464] tracking-widest uppercase">PRO SYSTEM</span>
        </div>
      </header>

      {/* Main Dynamic View Controller */}
      <main className="mx-auto max-w-md px-4 pt-4">
        {activeTab === 'home' && (
          <Dashboard 
            navigateTo={navigateTo} 
            clientsCount={clients.length}
            workersCount={workers.length}
            wholesalersCount={wholesalers.length}
          />
        )}
        {activeTab === 'clients' && (
          <Clients data={clients} onEdit={(c) => handleEdit('client', c)} onDelete={(id) => handleDelete('client', id)} />
        )}
        {activeTab === 'workers' && (
          <Workers data={workers} onEdit={(w) => handleEdit('worker', w)} onDelete={(id) => handleDelete('worker', id)} />
        )}
        {activeTab === 'ws' && (
          <Wholesalers data={wholesalers} onEdit={(ws) => handleEdit('wholesaler', ws)} onDelete={(id) => handleDelete('wholesaler', id)} />
        )}
        {activeTab === 'aur' && (
          <MoreSection navigateTo={navigateTo} />
        )}
      </main>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md border-t border-[#cca464]/30 bg-[#1f1610] px-2 py-2 shadow-xl rounded-t-2xl">
        <div className="grid grid-cols-5 text-center">
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'clients', label: 'Clients', icon: '👥' },
            { id: 'workers', label: 'Karigar', icon: '🧳' },
            { id: 'ws', label: 'WS Shop', icon: '🏢' },
            { id: 'aur', label: 'Aur...', icon: '✨' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id)}
                className={`flex flex-col items-center justify-center py-1 transition-all duration-200 ${
                  isActive ? 'scale-110 text-[#d4af37]' : 'text-gray-400 opacity-60'
                }`}
              >
                <span className="text-xl mb-0.5">{tab.icon}</span>
                <span className={`text-[11px] font-black tracking-wide ${isActive ? 'text-[#ffdb70]' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
                {isActive && <div className="mt-0.5 h-1 w-4 rounded-full bg-[#ffdb70]" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
