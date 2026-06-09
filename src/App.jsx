import React, { useState, useEffect } from 'react';
import Dashboard from './views/Dashboard';
import Clients from './views/Clients';
import Workers from './views/Workers';
import Wholesalers from './views/Wholesalers';
import MoreSection from './views/MoreSection';

// ☁️ FIREBASE INFRASTRUCTURE CORE IMPORTS
import { db } from './firebase'; 
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // 🛡️ MOBILE BACK BUTTON HISTORY PATROLLING ENGINE
  useEffect(() => {
    const handleMobileBackButton = (event) => {
      if (activeTab !== 'home') {
        setActiveTab('home');
      }
    };

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

  // 🛡️ CENTRAL REAL-TIME STATE HOOKS
  const [clients, setClients] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [wholesalers, setWholesalers] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // ☁️ REAL-TIME CLOUD SYNCHRONIZATION MATRIX
  useEffect(() => {
    // 1. Clients Stream
    const unsubClients = onSnapshot(collection(db, "gul_tailors_clients"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (docs.length === 0) {
        // Fallback default structure setup for new cloud instances
        setClients([{ 
          id: '1', 
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
        }]);
      } else {
        // Safe mapping architecture for historical payments configurations
        const verifiedDocs = docs.map(client => {
          if (!client.payments || !Array.isArray(client.payments)) {
            return {
              ...client,
              payments: [{ amount: Number(client.received) || 0, date: client.orderDate || '2026-06-08', note: 'Legacy Sync Data' }],
              status: client.status || 'Pending'
            };
          }
          return client;
        });
        setClients(verifiedDocs);
      }
    });

    // 2. Workers Stream
    const unsubWorkers = onSnapshot(collection(db, "gul_tailors_workers"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (docs.length === 0) {
        setWorkers([{ id: '1', name: 'Zahid Karigar', phone: '923123456789', payable: 12000, specializedIn: 'Suit Stitching', activeSuits: 5 }]);
      } else {
        setWorkers(docs);
      }
    });

    // 3. Wholesalers Stream
    const unsubWholesalers = onSnapshot(collection(db, "gul_tailors_wholesalers"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (docs.length === 0) {
        setWholesalers([{ id: '1', name: 'Faisalabad Cloth House', phone: '923007654321', balance: 25000, item: 'Latha & Wash n Wear' }]);
      } else {
        setWholesalers(docs);
      }
    });

    // 4. Expenses Stream
    const unsubExpenses = onSnapshot(collection(db, "gt_expenses"), (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubClients();
      unsubWorkers();
      unsubWholesalers();
      unsubExpenses();
    };
  }, []);

  // FIRESTORE CLOUD-SPECIFIC MIDDLEWARE PROPAGATORS FOR CHILD COMPONENTS
  const setClientsCloud = async (updatedClientsOrFunc) => {
    const nextState = typeof updatedClientsOrFunc === 'function' ? updatedClientsOrFunc(clients) : updatedClientsOrFunc;
    // Single node or batch updates are caught via onSnapshot, here we save targeted items safely
    for (const client of nextState) {
      const stringId = String(client.id);
      await setDoc(doc(db, "gul_tailors_clients", stringId), client);
    }
  };

  const setWorkersCloud = async (updatedWorkersOrFunc) => {
    const nextState = typeof updatedWorkersOrFunc === 'function' ? updatedWorkersOrFunc(workers) : updatedWorkersOrFunc;
    for (const worker of nextState) {
      const stringId = String(worker.id);
      await setDoc(doc(db, "gul_tailors_workers", stringId), worker);
    }
  };

  const setWholesalersCloud = async (updatedWholesalersOrFunc) => {
    const nextState = typeof updatedWholesalersOrFunc === 'function' ? updatedWholesalersOrFunc(wholesalers) : updatedWholesalersOrFunc;
    for (const ws of nextState) {
      const stringId = String(ws.id);
      await setDoc(doc(db, "gul_tailors_wholesalers", stringId), ws);
    }
  };

  // CLOUD EXPENSES ACTION HANDLERS
  const handleAddExpense = async (newExp) => {
    const stringId = String(newExp.id);
    await setDoc(doc(db, "gt_expenses", stringId), newExp);
  };

  const handleDeleteExpense = async (id) => {
    await deleteDoc(doc(db, "gt_expenses", String(id)));
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

    let todayExpense = expenses
      .filter(exp => exp.date === todayStr)
      .reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);

    let netProfit = monthlyRevenue - todayExpense; 

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

  // SYSTEM BACKUP HANDLERS
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

  const importMasterBackup = async (event) => {
    const fileReader = new FileReader();
    const file = event.target.files[0];
    if (!file) return;

    fileReader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.clients && importedData.workers && importedData.wholesalers) {
          if (window.confirm("⚠️ Kya aap backup file restore karna chahte hain? Aapka maujooda data override ho jayega.")) {
            // Processing cloud batch synchronization
            for (const c of importedData.clients) await setDoc(doc(db, "gul_tailors_clients", String(c.id)), c);
            for (const w of importedData.workers) await setDoc(doc(db, "gul_tailors_workers", String(w.id)), w);
            for (const ws of importedData.wholesalers) await setDoc(doc(db, "gul_tailors_wholesalers", String(ws.id)), ws);
            if (importedData.expenses) {
              for (const exp of importedData.expenses) await setDoc(doc(db, "gt_expenses", String(exp.id)), exp);
            }
            alert("✅ Khushamdeed! Gul Tailors ka poora data kamyabi se cloud par restore ho gaya hai.");
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

  const handleDelete = async (type, id) => {
    if (window.confirm(`Kya aap is ${type} record ko permanently delete karna chahte hain?`)) {
      if (type === 'client') await deleteDoc(doc(db, "gul_tailors_clients", String(id)));
      if (type === 'worker') await deleteDoc(doc(db, "gul_tailors_workers", String(id)));
      if (type === 'wholesaler') await deleteDoc(doc(db, "gul_tailors_wholesalers", String(id)));
    }
  };

  const navigateTo = (tabName) => {
    setActiveTab(tabName);
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
            setClients={setClientsCloud}
            onDelete={(id) => handleDelete('client', id)} 
          />
        )}
        {activeTab === 'workers' && (
          <Workers 
            data={workers} 
            setWorkers={setWorkersCloud}
            onDelete={(id) => handleDelete('worker', id)} 
          />
        )}
        {activeTab === 'ws' && (
          <Wholesalers 
            data={wholesalers} 
            setWholesalers={setWholesalersCloud}
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
