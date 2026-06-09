import React, { useState, useEffect } from 'react';
import Dashboard from './views/Dashboard';
import Clients from './views/Clients';
import Workers from './views/Workers';
import Wholesalers from './views/Wholesalers';
import MoreSection from './views/MoreSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // 🛡️ MOBILE BACK BUTTON HISTORY PATROLLING ENGINE
  useEffect(() => {
    const handleMobileBackButton = (event) => {
      // Jab bhi browser ka back button trigger ho aur user home par na ho
      if (activeTab !== 'home') {
        setActiveTab('home');
      }
    };

    // Popstate window layer tracking activation
    window.addEventListener('popstate', handleMobileBackButton);

    return () => {
      window.removeEventListener('popstate', handleMobileBackButton);
    };
  }, [activeTab]);

  // CENTRALIZED SHOP IDENTITY
  const shopInfo = {
    name: 'GUL TAILORS',
    owner: 'Waseem Gul Baghoor',
    phone: '0300-7614329',
    address: 'Main Bazar Adhi Kot, Syed Market, Almaroof Tailors Wali Market'
  };

  // 🛡️ CENTRAL STATE HOOKS (Safely Intact & Synced)
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

  // 📦 GLOBAL STATE FOR EXPENSES (Synchronized)
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('gt_expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
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

  useEffect(() => {
    localStorage.setItem('gt_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // EXPENSES ACTION HANDLERS
  const handleAddExpense = (newExp) => {
    setExpenses(prev => [newExp, ...prev]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  // 🧮 SENIOR DEVELOPMENT REAL-TIME FINANCIAL ENGINES
  const getFinancialMetrics = () => {
    const localTarget = new Date();
    const offset = localTarget.getTimezoneOffset();
    const adjustedDate = new Date(localTarget.getTime() - (offset * 60 * 1000));
    const isoString = adjustedDate.toISOString(); 
    
    const todayStr = isoString.split('T')[0]; 
    const currentMonthPrefix = todayStr.substring(0, 7); 

    let todayRevenue = 0;
    let monthlyRevenue = 0;

    clients.forEach(client => {
      if (client.payments && Array.isArray(client.payments)) {
        client.payments.forEach(pay => {
          const paymentDateStr = pay.date ? pay.date.trim() : '';
          if (paymentDateStr === todayStr) {
            todayRevenue += Number(pay.amount) || 0;
          }
          if (paymentDateStr.startsWith(currentMonthPrefix)) {
            monthlyRevenue += Number(pay.amount) || 0;
          }
        });
      }
    });

    // 🔴 DYNAMIC DAILY EXPENSE CALCULATION
    let todayExpense = expenses
      .filter(exp => exp.date === todayStr)
      .reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);

    // 🔵 SAAF MUNAFA (Net Profit Calculation)
    let netProfit = monthlyRevenue - todayExpense; 

    // 🏦 Ledger Matrices Summation Logic
    const totalClientUdhaar = clients.reduce((acc, client) => {
      const totalCost = (Number(client.silayi) || 0) + (Number(client.pKarhayi) || 0) + (Number(client.gKarhayi) || 0);
      const totalPaid = client.payments ? client.payments.reduce((pAcc, p) => pAcc + (Number(p.amount) || 0), 0) : 0;
      const balance = totalCost - totalPaid;
      return balance > 0 ? acc + balance : acc;
    }, 0);

    const totalWorkerPayable = workers.reduce((acc, w) => acc + (Number(w.payable) || 0), 0);
    const totalWholesalerBalance = wholesalers.reduce((acc, ws) => acc + (Number(ws.balance) || 0), 0);

    return {
      todayRevenue,
      todayExpense,
      monthlyRevenue,
      netProfit,
      totalClientUdhaar,
      totalWorkerPayable,
      totalWholesalerBalance
    };
  };

  // 🚨 REAL-TIME DELIVERY TIMELINE RADAR
  const getProximityAlerts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return clients
      .filter(client => client.status === 'Pending' && client.deliveryDate)
      .map(client => {
        const delivery = new Date(client.deliveryDate);
        delivery.setHours(0, 0, 0, 0);
        
        const diffTime = delivery - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let zone = 'safe';
        if (diffDays <= 2) zone = 'crisis';
        else if (diffDays <= 5) zone = 'warning';

        return { ...client, remainingDays: diffDays, zone };
      })
      .filter(client => client.zone === 'crisis' || client.zone === 'warning')
      .sort((a, b) => a.remainingDays - b.remainingDays);
  };

  const metrics = getFinancialMetrics();
  const proximityAlerts = getProximityAlerts();

  // SYSTEM BACKUP HANDLERS (With Expenses Included)
  const exportMasterBackup = () => {
    const masterPayload = { clients, workers, wholesalers, expenses, exportedAt: new Date().toISOString() };
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
            if (importedData.expenses) setExpenses(importedData.expenses);
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
    // 🔥 Push synthetic tracking step into history map every time user routes to another tab
    if (tabName !== 'home') {
      window.history.pushState({ activeRoute: tabName }, "");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] pb-32 font-sans text-slate-100 antialiased selection:bg-yellow-500/30">
      
      {/* 🏛️ ULTRA-MODERN NEON GLOW HEADER BAR */}
      <header className="sticky top-0 z-50 bg-[#020617]/85 backdrop-blur-xl px-5 py-3 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-slate-950 border border-white/10 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Gul Tailors Logo" 
                className="h-full w-full object-cover scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-xl hidden">✂️</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 leading-none">
                {shopInfo.name}
              </h1>
              <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase mt-1">{shopInfo.owner}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.2)]">
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
            financials={metrics}
            proximityAlerts={proximityAlerts}
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
            expenses={expenses}                 
            onAddExpense={handleAddExpense}       
            onDeleteExpense={handleDeleteExpense} 
          />
        )}
      </main>

      {/* 🧭 FLOATING NEON NAVIGATION DOCK */}
      <nav className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md border border-white/10 bg-[#0f172a]/90 backdrop-blur-2xl px-2 py-3 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-3xl">
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
                    ? 'bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/30 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
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
