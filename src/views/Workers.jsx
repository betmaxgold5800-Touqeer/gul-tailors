import React, { useState } from 'react';

export default function Workers({ data, setWorkers, onDelete }) {
  // Modal controllers
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State Control Matrix
  const [wName, setWName] = useState('');
  const [wPhone, setWPhone] = useState('');
  const [wSpec, setWSpec] = useState('Suit Stitching');
  const [wBaseRate, setWBaseRate] = useState('400'); // Default base rate for stitching

  // Transaction Injector State
  const [txType, setTxType] = useState('WAGE'); // WAGE (Mazdoori +) ya DEBIT (Hafta/Advance -)
  const [txAmount, setTxAmount] = useState('');
  const [suitCount, setSuitCount] = useState('1');
  const [customRate, setCustomRate] = useState('');
  const [txNote, setTxNote] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);

  // Helper: Karigar ka real-time balance calculate karne ka engine
  const getWorkerBalance = (worker) => {
    if (!worker.transactions || !Array.isArray(worker.transactions)) {
      return Number(worker.payable) || 0; // Fallback for legacy records
    }
    return worker.transactions.reduce((sum, tx) => {
      if (tx.type === 'WAGE') return sum + tx.amount;
      if (tx.type === 'DEBIT') return sum - tx.amount;
      return sum;
    }, 0);
  };

  // Top Strip Metrics Matrix
  const totalPayableToStaff = data.reduce((sum, w) => sum + getWorkerBalance(w), 0);

  // Open Add/Edit Manager
  const openAddManager = () => {
    setIsEditing(false);
    setSelectedWorker(null);
    setWName('');
    setWPhone('');
    setWSpec('Suit Stitching');
    setWBaseRate('400');
    setShowAddModal(true);
  };

  const openEditManager = (worker) => {
    setIsEditing(true);
    setSelectedWorker(worker);
    setWName(worker.name);
    setWPhone(worker.phone);
    setWSpec(worker.specializedIn || 'Suit Stitching');
    setWBaseRate(worker.baseRate || '400');
    setShowAddModal(true);
  };

  const openLedgerManager = (worker) => {
    setSelectedWorker(worker);
    setTxType('WAGE');
    setTxAmount('');
    setSuitCount('1');
    setCustomRate(worker.baseRate || '400');
    setTxNote('');
    setTxDate(new Date().toISOString().split('T')[0]);
    setShowLedgerModal(true);
  };

  // Atomic Save / Update Handler - [CLOUD INTEGRATED]
  const handleSaveWorker = (e) => {
    e.preventDefault();
    if (!wName.trim() || !wPhone.trim()) return alert('⚠️ Error: Naam aur Phone number lazmi hai!');

    if (isEditing) {
      const updatedArray = data.map((w) =>
        w.id === selectedWorker.id
          ? {
              ...w,
              name: wName.trim(),
              phone: wPhone.trim(),
              specializedIn: wSpec,
              baseRate: Number(wBaseRate) || 0,
              transactions: w.transactions || []
            }
          : w
      );
      setWorkers(updatedArray);
    } else {
      const newWorker = {
        id: String(Date.now()), // String synchronization for database standard
        name: wName.trim(),
        phone: wPhone.trim(),
        specializedIn: wSpec,
        baseRate: Number(wBaseRate) || 0,
        transactions: [] // Empty ledger for fresh staff
      };
      setWorkers([newWorker, ...data]);
    }
    setShowAddModal(false);
  };

  // Dynamic Transaction Injection Engine - [CLOUD INTEGRATED]
  const executeInjectTransaction = () => {
    let finalAmount = Number(txAmount) || 0;
    let computedNote = txNote.trim();

    if (txType === 'WAGE') {
      const suits = Number(suitCount) || 1;
      const rate = Number(customRate) || Number(selectedWorker.baseRate) || 0;
      finalAmount = suits * rate;
      if (!computedNote) computedNote = `${suits} Suits Sile (Rate: Rs. ${rate})`;
    } else {
      if (finalAmount <= 0) {
        alert('⚠️ Error: Meharbani kar ke payment amount enter karein!');
        return;
      }
      if (!computedNote) computedNote = "Hafta / Advance Cash Paid";
    }

    const updatedArray = data.map((w) => {
      if (w.id === selectedWorker.id) {
        const currentTxs = w.transactions && Array.isArray(w.transactions) ? [...w.transactions] : [];
        return {
          ...w,
          transactions: [...currentTxs, { type: txType, amount: finalAmount, date: txDate, note: computedNote }]
        };
      }
      return w;
    });

    setWorkers(updatedArray);
    setShowLedgerModal(false);
  };

  // WhatsApp Message Dispatcher
  const triggerWorkerWhatsApp = (worker) => {
    const currentBalance = getWorkerBalance(worker);
    const cleanPhone = worker.phone.replace(/\D/g, '');
    const text = `Assalam-o-Alaikum Master *${worker.name}* Sahib,\n\nGul Tailors dashboard par aap ka total khata update ho chuka hai:\n\n` +
      `🧵 Specialty: ${worker.specializedIn}\n` +
      `📌 Base Stitching Rate: Rs. ${worker.baseRate || 0}\n` +
      `💰 Aap ka Net Payable Balance: *Rs. ${currentBalance}*\n\n` +
      `*Gul Tailors Premium Vault • Adhi Kot*`;
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      
      {/* PREMIUM MANAGEMENT HEADER */}
      <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-3xl border border-white/5 shadow-lg backdrop-blur-xl">
        <div>
          <h3 className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200 uppercase">🧳 KARIGAR VAULT ENGINE</h3>
          <p className="text-[10px] font-bold text-slate-500">Total Active Staff Force: {data.length}</p>
        </div>
        <button 
          onClick={openAddManager} 
          className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]"
        >
          ➕ Add New Karigar
        </button>
      </div>

      {/* FINANCIAL ANALYTICS SUMMARY BAR */}
      <div className="bg-slate-900/60 p-3.5 rounded-2xl text-center border border-white/5 shadow-inner">
        <span className="text-[10px] font-black text-rose-400 block uppercase tracking-wider">Total Outstandings (Dukan ka Udhaar)</span>
        <span className="text-lg font-black text-slate-200 mt-0.5 block">Rs. {totalPayableToStaff.toLocaleString('en-IN')}</span>
      </div>

      {/* MAIN KARIGAR CARDS LIST */}
      <div className="space-y-3">
        {data.map((worker) => {
          const currentBalance = getWorkerBalance(worker);
          return (
            <div key={worker.id} className="bg-slate-900/30 rounded-3xl p-4 border border-white/5 shadow-xl space-y-3 relative overflow-hidden transition-all duration-300">
              
              {/* Card Main Info Row */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-base text-slate-200 tracking-wide">{worker.name}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">🧵 Specialty: <span className="font-black text-yellow-500">{worker.specializedIn}</span></p>
                  <p className="text-[10px] font-black text-amber-500/90 mt-0.5 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 rounded-md inline-block">🏷️ Fix Rate: Rs. {worker.baseRate || 0} / suit</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">📞 {worker.phone}</p>
                </div>
                
                {/* Clickable Ledger Trigger Badge */}
                <button
                  onClick={() => openLedgerManager(worker)}
                  className={`text-[11px] font-black px-3 py-2 rounded-xl border text-right transition-all active:scale-95 cursor-pointer ${
                    currentBalance > 0 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                  }`}
                >
                  <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Payable Balance</span>
                  Rs. {currentBalance.toLocaleString('en-IN')} 💸
                </button>
              </div>

              {/* Actions Control Console Row */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => openLedgerManager(worker)} 
                    className="bg-gradient-to-r from-slate-900 to-slate-950 text-slate-300 border border-white/10 hover:border-white/20 font-black text-xs px-3.5 py-2 rounded-xl active:scale-95 transition-all"
                  >
                    ⚖️ Quick Khata
                  </button>
                  <button 
                    onClick={() => openEditManager(worker)} 
                    className="bg-blue-500/10 text-blue-400 border border-blue-500/20 font-black text-xs px-3 py-2 rounded-xl active:scale-95 transition-colors"
                  >
                    📝 Edit Rate
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => triggerWorkerWhatsApp(worker)} 
                    className="bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 flex items-center gap-1 text-xs font-black px-3 py-2 rounded-xl active:scale-95 transition-all hover:bg-[#25D366]/20"
                  >
                    <span>💬</span> WhatsApp
                  </button>
                  <button onClick={() => onDelete(worker.id)} className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 p-2 rounded-xl transition-colors">🗑️</button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 💸 [MODAL OVERLAY 1] DOUBLE ENTRY LEDGER TRANSACTION ENGINE */}
      {showLedgerModal && selectedWorker && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-white/10 p-5 shadow-2xl border-t-8 border-yellow-500 space-y-4 max-h-[88vh] overflow-y-auto">
            <div>
              <h4 className="font-black text-slate-200 text-base tracking-wide">⚖️ KARIGAR LEDGER CONSOLE</h4>
              <p className="text-xs font-bold text-slate-400 mt-0.5">Staff Account: <span className="text-yellow-400 font-black">{selectedWorker.name}</span></p>
            </div>

            {/* Quick Transaction Segment Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setTxType('WAGE')} 
                className={`text-[10px] font-black py-2 rounded-lg transition-all ${txType === 'WAGE' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow-sm' : 'text-slate-400'}`}
              >
                🪡 Record Sile Suit (+)
              </button>
              <button 
                onClick={() => setTxType('DEBIT')} 
                className={`text-[10px] font-black py-2 rounded-lg transition-all ${txType === 'DEBIT' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400'}`}
              >
                💵 Give Hafta / Advance (-)
              </button>
            </div>

            {/* Dynamic UI Render Base on Tab Type */}
            {txType === 'WAGE' ? (
              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 space-y-2.5">
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-wider">🪡 Mazdoori Calculator Engine</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-0.5 tracking-wide">Suits Count</label>
                    <input type="number" value={suitCount} onChange={(e) => setSuitCount(e.target.value)} className="p-2 w-full text-xs font-black rounded-lg border border-white/10 bg-slate-900 text-slate-200 focus:outline-none focus:border-yellow-500/30" min="1" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase block mb-0.5 tracking-wide font-black">Rate Per Suit (Rs.)</label>
                    <input type="number" value={customRate} onChange={(e) => setCustomRate(e.target.value)} className="p-2 w-full text-xs font-black rounded-lg border border-white/10 bg-slate-900 text-yellow-400 focus:outline-none focus:border-yellow-500/30" />
                  </div>
                </div>
                <div className="text-xs font-black text-right text-slate-400 pt-1">
                  Total Added Wages: <span className="text-emerald-400 text-sm">Rs. {((Number(suitCount) || 1) * (Number(customRate) || 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 space-y-2">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-wider">💵 Record Debit Transaction</p>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase block mb-0.5 tracking-wide">Paid Amount (Rs.)</label>
                  <input type="number" placeholder="Enter Cash Amount" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} className="p-2.5 w-full text-xs font-black rounded-lg border border-white/10 bg-slate-900 text-rose-400 focus:outline-none focus:border-rose-500/40" />
                </div>
              </div>
            )}

            {/* Meta Notes & Logs Input */}
            <div className="space-y-2">
              <input type="text" placeholder="Optional Description Note (e.g. 3 Cotton, 2 WashWear)" value={txNote} onChange={(e) => setTxNote(e.target.value)} className="w-full p-2.5 text-xs font-bold border border-white/10 bg-slate-900 text-slate-200 rounded-xl focus:outline-none" />
              <input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} className="w-full p-2 text-xs font-bold border border-white/10 bg-slate-900 text-slate-300 rounded-xl text-center focus:outline-none" />
            </div>

            {/* Micro Past Ledger Logs Timeline view */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 tracking-wide">📋 History Logs Timeline</label>
              <div className="bg-slate-950/30 p-2 rounded-xl border border-white/5 max-h-[110px] overflow-y-auto space-y-1.5 border-dashed">
                {selectedWorker.transactions && selectedWorker.transactions.length > 0 ? (
                  selectedWorker.transactions.map((tx, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] bg-slate-900/60 p-1.5 rounded-md border border-white/5 shadow-sm">
                      <div>
                        <span className={`font-black ${tx.type === 'WAGE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.type === 'WAGE' ? '+' : '-'} Rs. {tx.amount.toLocaleString('en-IN')}
                        </span>
                        <p className="text-[8px] text-slate-500 font-medium mt-0.5 leading-none">{tx.note}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold">📅 {tx.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-center text-slate-500 py-2 font-medium">Koi transaction log nahi hai.</p>
                )}
              </div>
            </div>

            {/* Action Controllers */}
            <div className="flex gap-2 pt-1">
              <button onClick={executeInjectTransaction} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-xs shadow-md transition-colors">Post Transaction</button>
              <button onClick={() => setShowLedgerModal(false)} className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-black px-4 py-2.5 rounded-xl text-xs border border-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 🧳 [MODAL OVERLAY 2] REGISTRATION AND PROFILE UPDATE FLOW FORM */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-white/10 p-5 shadow-2xl space-y-4">
            <h4 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 text-sm uppercase border-b border-white/5 pb-2 tracking-wide">
              {isEditing ? '📝 EDIT STAFF ARCHITECTURE PROFILE' : '🧳 NEW STAFF FORCE REGISTRY'}
            </h4>
            <form onSubmit={handleSaveWorker} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">Karigar / Master Name</label>
                <input type="text" placeholder="e.g. Zahid Karigar" value={wName} onChange={(e) => setWName(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 text-slate-200 font-bold text-sm focus:outline-none focus:border-yellow-500/40" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">WhatsApp Number (923... Format)</label>
                <input type="text" placeholder="e.g. 923123456789" value={wPhone} onChange={(e) => setWPhone(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 text-slate-200 font-bold text-sm focus:outline-none focus:border-yellow-500/40" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">Specialization</label>
                  <select value={wSpec} onChange={(e) => setWSpec(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 font-black text-xs text-slate-300 focus:outline-none">
                    <option value="Suit Stitching">Suit Stitching</option>
                    <option value="Cutting Master">Cutting Master</option>
                    <option value="Kaj / Button Press">Kaj / Button Press</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">Fix Suit Rate (Rs.)</label>
                  <input type="number" placeholder="Fix Rate e.g. 450" value={wBaseRate} onChange={(e) => setWBaseRate(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 text-xs font-black text-yellow-400 text-center focus:outline-none" />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-sm shadow-md transition-colors">
                  {isEditing ? 'Update Configuration' : 'Save Worker Profile'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-black px-4 py-2.5 rounded-xl text-sm border border-white/5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
