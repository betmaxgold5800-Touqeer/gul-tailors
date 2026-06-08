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
    // 🌌 MIDNIGHT NEON BASE
    <div className="min-h-screen bg-[#020617] pb-28 font-sans text-slate-100 antialiased selection:bg-yellow-500/30">
      
      {/* 🏛️ NEON GLOW HEADER */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 px-5 py-4">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              {shopInfo.name}
            </h1>
            <p className="text-[9px] text-slate-500 tracking-[0.2em] uppercase font-bold mt-1">{shopInfo.owner}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 shadow-[0_0_10px_-2px_rgba(234,179,8,0.3)]">
              📞 {shopInfo.phone}
            </span>
          </div>
        </div>
      </header>

      {/* Dynamic Main Workspace Wrapper */}
      <main className="mx-auto max-w-md px-4 pt-6">
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

      {/* 🧭 FLOATING NEON NAVIGATION DOCK */}
      <nav className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md border border-white/10 bg-[#0f172a]/90 backdrop-blur-2xl px-2 py-3 shadow-[0_0_30px_-10px_rgba(234,179,8,0.2)] rounded-3xl">
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
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-300 active:scale-90 ${
                  isActive 
                    ? 'bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/30 text-yellow-500 shadow-[0_0_15px_-5px_rgba(234,179,8,0.4)]' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-xl mb-0.5">{tab.icon}</span>
                <span className={`text-[9px] tracking-wide font-black ${isActive ? 'text-yellow-500' : 'text-slate-500'}`}>
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
