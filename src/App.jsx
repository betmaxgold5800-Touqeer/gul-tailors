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
    phone: '03007614329',
    address: 'Main Bazar Adhi Kot, Syed Market, Almaroof Tailors Wali Market, Left side last shop'
  };

  // 🛡️ CENTRAL STATE HOOKS
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

  // SYSTEM BACKUP HANDLERS (Pass down to MoreSection)
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
    <div className="min-h-screen bg-[#fdf6e9] pb-24 font-sans text-[#1a1a1a]">
      
      {/* 🔥 CLEAN PREMIUM HEADER: Cleaned up and perfectly aligned */}
      <header className="sticky top-0 z-50 bg-[#1f1610] px-4 py-3 shadow-xl border-b border-[#cca464]/25">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black tracking-wider text-[#cca464]">{shopInfo.name}</h1>
            <p className="text-[9px] font-bold text-[#cca464]/60 uppercase tracking-widest">{shopInfo.owner}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#cca464] font-bold">{shopInfo.phone}</p>
            <p className="text-[8px] text-[#cca464]/50 max-w-[150px] leading-tight mt-0.5">{shopInfo.address}</p>
          </div>
        </div>
      </header>

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
          /* Passing handlers to MoreSection to render elegantly inside the system options panel */
          <MoreSection 
            data={clients} 
            navigateTo={navigateTo} 
            exportBackup={exportMasterBackup}
            importBackup={importMasterBackup}
          />
        )}
      </main>

      {/* Navigation Layer */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md border-t border-[#cca464]/30 bg-[#1f1610] px-2 py-2 shadow-2xl rounded-t-2xl">
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
                className={`flex flex-col items-center justify-center py-1 transition-all ${
                  isActive ? 'scale-110 text-[#d4af37]' : 'text-gray-400 opacity-60'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className={`text-[10px] font-black ${isActive ? 'text-[#ffdb70]' : 'text-gray-400'}`}>
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
