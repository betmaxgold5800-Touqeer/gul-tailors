import React, { useState, useEffect } from 'react';
import Dashboard from './views/Dashboard';
import Clients from './views/Clients';
import Workers from './views/Workers';
import Wholesalers from './views/Wholesalers';
import MoreSection from './views/MoreSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // CENTRALIZED SHOP IDENTITY
  const shopInfo = {
    name: 'GUL TAILORS',
    owner: 'Waseem Gul Baghoor',
    phone: '0300-7614329',
    address: 'Main Bazar Adhi Kot, Syed Market, Almaroof Tailors Wali Market'
  };

  // 🛡️ CENTRAL STATE HOOKS (Safely Intact)
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem('gul_tailors_clients');
    if (!savedClients) {
      return [{ 
        id: 1, 
        name: 'Asif Ali', 
        phone: '923001234567', 
        totalSuits: 1,
        isUrgent: false,
        silayi: 800,       
        pKarhayi: 0,
        gKarhayi: 0,
        payments: [{ amount: 800, date: '2026-06-08', note: 'Initial Registry Paid' }],
        suitType: 'Shalwar Kameez', 
        deliveryDate: '2026-06-15',
        status: 'Pending',
        naap: { lambaai: '40', teera: '18', baazu: '23', ghera: '24', shalwar: '38', paincha: '8', asan: '15', galla: '16' }
      }];
    }
    try {
      const parsed = JSON.parse(savedClients);
      return parsed.map(client => {
        if (!client.payments || !Array.isArray(client.payments)) {
          return {
            ...client,
            payments: [{ amount: Number(client.received) || 0, date: client.orderDate || '2026-06-08', note: 'Legacy Sync Data' }],
            status: client.status || 'Pending'
          };
        }
        return client;
      });
    } catch (e) {
      return [];
    }
  });

  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem('gul_tailors_workers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Zahid Karigar', phone: '923123456789', payable: 12000, specializedIn: 'Suit Stitching', activeSuits: 5 }
    ];
  });

  const [wholesalers, setWholesalers] = useState(() => {
    const saved = localStorage.getItem('gul_tailors_wholesalers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Faisalabad Cloth House', phone: '923007654321', balance: 25000, item: 'Latha & Wash n Wear' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('gul_tailors_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('gul_tailors_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('gul_tailors_wholesalers', JSON.stringify(wholesalers));
  }, [wholesalers]);

  // SYSTEM BACKUP HANDLERS (Linked Directly)
  const exportMasterBackup = () => {
    const masterPayload = { clients, workers, wholesalers, exportedAt: new Date().toISOString() };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(masterPayload));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GUL_TAILORS_BACKUP_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importMasterBackup = (event) => {
    const fileReader = new FileReader();
    const file = event.target.files[0];
    if (!file) return;

    fileReader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.clients && importedData.workers && importedData.wholesalers) {
          if (window.confirm("⚠️ Kya aap backup file restore karna chahte hain? Aapka maujooda data override ho jayega.")) {
            setClients(importedData.clients);
            setWorkers(importedData.workers);
            setWholesalers(importedData.wholesalers);
            alert("✅ Khushamdeed! Gul Tailors ka poora data kamyabi se restore ho gaya hai.");
          }
        } else {
          alert("❌ Error: Yeh file valid backup format mein nahi hai.");
        }
      } catch (err) {
        alert("❌ Error: File read karne mein masala aaya hai.");
      }
    };
    fileReader.readAsText(file);
  };

  const handleDelete = (type, id) => {
    if (window.confirm(`Kya aap is ${type} record ko permanently delete karna chahte hain?`)) {
      if (type === 'client') setClients(clients.filter(c => c.id !== id));
      if (type === 'worker') setWorkers(workers.filter(w => w.id !== id));
      if (type === 'wholesaler') setWholesalers(wholesalers.filter(ws => ws.id !== id));
    }
  };

  const navigateTo = (tabName) => {
    setActiveTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // ✨ PREMIUM MODERN SYSTEM FRAME (No more dark-heavy feel)
    <div className="min-h-screen bg-[#F8F9FA] pb-28 font-sans text-[#1A1A1A] antialiased">
      
      {/* 🏛️ MODERN ELITE GLASS-MORPHIC HEADER BAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-5 py-3.5 border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-black tracking-[0.18em] text-gray-900 leading-none">{shopInfo.name}</h1>
            <p className="text-[10px] font-black text-[#b5924b] uppercase tracking-widest mt-1.5">{shopInfo.owner}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[11px] font-black text-gray-800 bg-gray-50 border border-gray-200/60 px-3 py-1 rounded-full shadow-inner">
              📞 {shopInfo.phone}
            </span>
            <p className="text-[9px] text-gray-400 font-bold mt-1 tracking-tight max-w-[140px] truncate">{shopInfo.address}</p>
          </div>
        </div>
      </header>

      {/* Dynamic Main Workspace Wrapper */}
      <main className="mx-auto max-w-md px-4 pt-5">
        {activeTab === 'home' && (
          <Dashboard 
            navigateTo={navigateTo} 
            clientsCount={clients.length}
            workersCount={workers.length}
            wholesalersCount={wholesalers.length}
          />
        )}
        {activeTab === 'clients' && (
          <Clients 
            data={clients} 
            setClients={setClients}
            onDelete={(id) => handleDelete('client', id)} 
          />
        )}
        {activeTab === 'workers' && (
          <Workers 
            data={workers} 
            setWorkers={setWorkers}
            onDelete={(id) => handleDelete('worker', id)} 
          />
        )}
        {activeTab === 'ws' && (
          <Wholesalers 
            data={wholesalers} 
            setWholesalers={setWholesalers}
            onDelete={(id) => handleDelete('wholesaler', id)} 
          />
        )}
        {activeTab === 'aur' && (
          <MoreSection 
            data={clients} 
            navigateTo={navigateTo} 
            exportBackup={exportMasterBackup}
            importBackup={importMasterBackup}
          />
        )}
      </main>

      {/* 🧭 NAVIGATION CAPSULE (Floating Luxury Dock Architecture) */}
      <nav className="fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-md border border-gray-200/80 bg-white/95 backdrop-blur-lg px-2 py-2.5 shadow-xl rounded-2xl">
        <div className="grid grid-cols-5 gap-1 text-center">
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
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 active:scale-95 ${
                  isActive 
                    ? 'bg-[#b5924b]/10 text-[#b5924b] scale-105 font-bold shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-lg mb-0.5">{tab.icon}</span>
                <span className={`text-[10px] tracking-wide font-bold ${isActive ? 'text-[#b5924b]' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
