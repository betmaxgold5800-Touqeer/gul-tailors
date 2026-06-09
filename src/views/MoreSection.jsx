import React, { useState } from 'react';
import { 
  Coins, 
  Scissors, 
  Receipt, 
  User, 
  Plus, 
  Trash2, 
  ChevronDown, 
  Sliders, 
  Info 
} from 'lucide-react';

export default function MoreSection({ 
  data = [], 
  navigateTo,
  expenses = [],          // 🔥 Connected to global Firestore state
  onAddExpense,           // 🔥 Trigger for parent submit
  onDeleteExpense,        // 🔥 Trigger for parent delete
  onResetExpenses,        // ⚡ New cloud trigger to empty entire expense array at once
  stitchingRate = 1000,   // 🔥 Cloud managed configuration variables
  setStitchingRate,
  shopProfile = { name: 'Gul Tailors', phone: '03007614329', address: 'Adhi Kot' }, // 🔥 Cloud profile state
  setShopProfile
}) {
  // Master Accordion Panel State Control
  const [activePanel, setActivePanel] = useState(null); 
  const [statusMessage, setStatusMessage] = useState('');

  // Local state controls for temporary fields editing
  const [localRate, setLocalRate] = useState(stitchingRate);
  const [profileName, setProfileName] = useState(shopProfile.name);
  const [profilePhone, setProfilePhone] = useState(shopProfile.phone);
  const [profileAddress, setProfileAddress] = useState(shopProfile.address);

  // 2️⃣ Expense Registry Input Form States
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Raw Material'); 
  const [expNote, setExpNote] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

  // 📊 LIVE REAL-TIME METRICS FOR "AUR..." TAB - 100% SECURED SYNCHRONIZATION
  const liveMetrics = data.reduce((acc, curr) => {
    const rawStatus = curr.status || 'Pending';
    const currentStatus = String(rawStatus).trim(); 
    const totalSuitsCount = Number(curr.totalSuits) || 0;

    if (currentStatus === 'Delivered') {
      acc.suitsDone += totalSuitsCount;
    } else if (currentStatus === 'Pending') {
      acc.pendingSuits += totalSuitsCount;
    }

    if (curr.isUrgent && currentStatus === 'Pending') {
      acc.urgentOrders += 1;
    }

    return acc;
  }, { suitsDone: 0, pendingSuits: 0, urgentOrders: 0 });

  const showToaster = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const togglePanel = (panelName) => {
    setActivePanel(activePanel === panelName ? null : panelName);
  };

  const handleExpenseSubmitLocal = (e) => {
    e.preventDefault();
    const amt = parseFloat(expAmount) || 0;
    if (amt <= 0) return alert('Valid expense amount darj karein!');

    const newExpense = {
      id: String(Date.now()), // String normalization for Firestore documents integration
      amount: amt,
      category: expCategory,
      note: expNote.trim() || `${expCategory} Kharcha`,
      date: expDate
    };

    if (onAddExpense) {
      onAddExpense(newExpense);
      setExpAmount('');
      setExpNote('');
      showToaster('✅ Dukan ka kharcha kamyabi se ledger mein plus ho gaya!');
    }
  };

  // 🗑️ WHOLE LEDGER RESET ACTION HANDLER - [CLOUD CONFIGURED]
  const handleClearAllExpenses = () => {
    if (window.confirm("⚠️ WARNING: Kya aap dukan ka poora Expense Registry clear karna chahte hain taake shuru se start ho? (Yeh action wapas nahi ho sakta)")) {
      if (expenses && expenses.length > 0) {
        if (onResetExpenses) {
          onResetExpenses(); // High-speed collection truncation logic
        } else {
          expenses.forEach(exp => onDeleteExpense && onDeleteExpense(exp.id));
        }
        showToaster('♻️ Expense ledger reset successfully! Starting from zero.');
      } else {
        alert("Ledger pehle se hi zero hai ustad ji!");
      }
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (setShopProfile) {
      setShopProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
        address: profileAddress.trim()
      });
      showToaster('✨ Shop Profile configuration updated safely on Cloud!');
    }
    setActivePanel(null);
  };

  const handleSaveRateLocal = () => {
    if (setStitchingRate) {
      setStitchingRate(Number(localRate) || 0);
      showToaster('💰 New standard stitching rate implemented on Cloud!');
    }
    togglePanel('RATES');
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      <h3 className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200 uppercase mb-1 flex items-center gap-2">
        <Sliders className="w-4 h-4 text-yellow-500" /> BUSINESS CONTROLS & METRICS
      </h3>

      {/* LIVE KPI STATS ROW */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/5 text-center shadow-md">
          <span className="text-[9px] font-black text-slate-500 block uppercase tracking-wider">Suits Done</span>
          <span className="text-lg font-black text-emerald-400 mt-0.5">{liveMetrics.suitsDone}</span>
        </div>
        <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/5 text-center shadow-md">
          <span className="text-[9px] font-black text-slate-500 block uppercase tracking-wider">Pending</span>
          <span className="text-lg font-black text-amber-400 mt-0.5">{liveMetrics.pendingSuits}</span>
        </div>
        <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/5 text-center shadow-md">
          <span className="text-[9px] font-black text-slate-500 block uppercase tracking-wider">Urgent Alert</span>
          <span className="text-lg font-black text-rose-500 mt-0.5">{liveMetrics.urgentOrders}</span>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-black p-3 rounded-xl shadow-md text-center animate-fadeIn">
          {statusMessage}
        </div>
      )}

      <div className="bg-slate-900/20 rounded-3xl p-4 border border-white/5 shadow-xl space-y-3">
        
        {/* 1. STITCHING RATES CONTROLLER */}
        <div className="space-y-2">
          <button 
            onClick={() => togglePanel('RATES')} 
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left outline-none ${
              activePanel === 'RATES' 
                ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                : 'bg-slate-900/40 hover:bg-slate-900/60 border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-200 block">Stitching Rate List</span>
                <span className="text-[10px] text-slate-400 font-bold">Standard Setup Pricing • <span className="text-amber-400 font-black">Rs. {stitchingRate}</span></span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${activePanel === 'RATES' ? 'rotate-180 text-amber-400' : ''}`} />
          </button>

          {activePanel === 'RATES' && (
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-amber-500/20 space-y-3 animate-fadeIn">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Default Custom Suit Rate (Rs.)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={localRate} 
                    onChange={(e) => setLocalRate(Number(e.target.value) || 0)}
                    className="flex-1 p-2.5 bg-slate-900 border border-white/10 rounded-xl text-sm font-black text-amber-400 text-center focus:outline-none focus:border-amber-500/30" 
                  />
                  <button 
                    onClick={handleSaveRateLocal}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black px-5 rounded-xl shadow-md active:scale-95 transition-all"
                  >
                    Lock Rate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. KARIGAR COMMISSIONS PANEL */}
        <div className="space-y-2">
          <button 
            onClick={() => togglePanel('COMMISSIONS')} 
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left outline-none ${
              activePanel === 'COMMISSIONS' 
                ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.05)]' 
                : 'bg-slate-900/40 hover:bg-slate-900/60 border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Scissors className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-200 block">Karigar Commissions</span>
                <span className="text-[10px] text-slate-400 font-bold">Manage rates per piece configurations</span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${activePanel === 'COMMISSIONS' ? 'rotate-180 text-cyan-400' : ''}`} />
          </button>

          {activePanel === 'COMMISSIONS' && (
            <div className="bg-cyan-950/20 p-3.5 rounded-2xl border border-cyan-500/20 text-[10px] text-cyan-400 font-bold leading-relaxed flex gap-2 animate-fadeIn">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-black block text-slate-200 mb-0.5">Senior Developer Sync:</span> 
                Har karigar ka piece rate directly unke individual profile matrix panel (<span className="text-cyan-300">Workers.jsx</span>) ke andar se adjust aur compile hota hai.
              </div>
            </div>
          )}
        </div>

        {/* 3. EXPENSE REGISTRY */}
        <div className="space-y-2">
          <button 
            onClick={() => togglePanel('EXPENSES')} 
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left outline-none ${
              activePanel === 'EXPENSES' 
                ? 'bg-purple-500/10 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.05)]' 
                : 'bg-slate-900/40 hover:bg-slate-900/60 border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <Receipt className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-200 block">Expense Registry</span>
                <span className="text-[10px] text-slate-400 font-bold">Thread, buttons, utility bills, cash registry</span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${activePanel === 'EXPENSES' ? 'rotate-180 text-purple-400' : ''}`} />
          </button>

          {activePanel === 'EXPENSES' && (
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-purple-500/20 space-y-4 animate-fadeIn">
              <form onSubmit={handleExpenseSubmitLocal} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1 tracking-wider">Amount (Rs.)</label>
                    <input type="number" placeholder="e.g. 500" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} className="w-full p-2.5 text-xs font-black bg-slate-900 text-slate-200 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/30 placeholder-slate-600" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1 tracking-wider">Category</label>
                    <select value={expCategory} onChange={(e) => setExpCategory(e.target.value)} className="w-full p-2.5 text-xs font-black bg-slate-900 text-slate-300 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/30">
                      <option value="Raw Material">🧵 Raw Material</option>
                      <option value="Utilities">⚡ Utilities Bill</option>
                      <option value="Daily Tea">☕ Tea / Daily</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1 tracking-wider">Expense Details Note</label>
                    <input type="text" placeholder="e.g. Bukram purchase, Nalkiyan" value={expNote} onChange={(e) => setExpNote(e.target.value)} className="w-full p-2.5 text-xs font-bold bg-slate-900 text-slate-200 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/30 placeholder-slate-600" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1 tracking-wider">Date</label>
                    <input type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} className="w-full p-2 bg-slate-900 text-slate-300 border border-white/10 rounded-xl text-center text-xs font-bold focus:outline-none focus:border-purple-500/30" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-2.5 rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5">
                  <Plus className="w-4 h-4" /> Post Expense Entry
                </button>
              </form>

              <div className="space-y-2 border-t border-white/5 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">📋 Recent Expense History</span>
                  {expenses.length > 0 && (
                    <button 
                      type="button" 
                      onClick={handleClearAllExpenses}
                      className="text-[8px] font-black tracking-wider uppercase text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md hover:bg-rose-500/20 active:scale-95 transition-all"
                    >
                      Clear All Zero
                    </button>
                  )}
                </div>

                <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                  {expenses && expenses.length > 0 ? (
                    expenses.map((exp) => (
                      <div key={exp.id} className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-xl border border-white/5 text-[10px] hover:border-white/10 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-rose-400">Rs. {exp.amount}</span>
                            <span className="bg-purple-500/10 text-purple-400 font-black px-1.5 py-0.5 rounded text-[7px] uppercase tracking-wider border border-purple-500/10">{exp.category}</span>
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold mt-0.5">{exp.note}</p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[8px] text-slate-500 font-bold">{exp.date}</span>
                          <button type="button" onClick={() => onDeleteExpense && onDeleteExpense(exp.id)} className="text-slate-500 hover:text-rose-400 transition-colors p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[9px] text-center text-slate-500 py-4 font-bold">Dukan ka koi expense note darj nahi hai.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. SHOP PROFILE MODULE */}
        <div className="space-y-2">
          <button 
            onClick={() => togglePanel('PROFILE')} 
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left outline-none ${
              activePanel === 'PROFILE' 
                ? 'bg-slate-800/50 border-white/20 shadow-md' 
                : 'bg-slate-900/40 hover:bg-slate-900/60 border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 text-slate-400 rounded-xl border border-white/5">
                <User className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-200 block">Shop Profile</span>
                <span className="text-[10px] text-slate-400 font-bold">{shopProfile.name} • {shopProfile.phone} • Adhi Kot</span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${activePanel === 'PROFILE' ? 'rotate-180 text-white' : ''}`} />
          </button>

          {activePanel === 'PROFILE' && (
            <form onSubmit={handleSaveProfile} className="bg-slate-950/50 p-4 rounded-2xl border border-white/10 space-y-3.5 animate-fadeIn">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1 tracking-wider">Shop Header Title</label>
                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full p-2.5 bg-slate-900 text-slate-200 border border-white/10 rounded-xl text-xs font-bold focus:outline-none focus:border-white/20" required />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1 tracking-wider">WhatsApp Billing Contact</label>
                <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full p-2.5 bg-slate-900 text-slate-200 border border-white/10 rounded-xl text-xs font-bold focus:outline-none focus:border-white/20" required />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1 tracking-wider">Physical Address Directory</label>
                <textarea rows="2" value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)} className="w-full p-2.5 bg-slate-900 text-slate-200 border border-white/10 rounded-xl text-xs font-bold focus:outline-none focus:border-white/20 resize-none" required />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-2.5 rounded-xl text-xs shadow-md active:scale-95 transition-all">
                Save Profile Configuration
              </button>
            </form>
          )}
        </div>

      </div>

      <div className="text-center py-2">
        <span className="text-[9px] font-black tracking-widest text-slate-600 uppercase">
          Gul Tailors Cloud-Sync Engine v2.2.0 • Powered by Firestore
        </span>
      </div>
    </div>
  );
}
