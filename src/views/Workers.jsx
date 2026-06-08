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

  // Atomic Save / Update Handler - [FIXED BY SENIOR DEVELOPER]
  const handleSaveWorker = (e) => {
    e.preventDefault();
    if (!wName.trim() || !wPhone.trim()) return alert('⚠️ Error: Naam aur Phone number lazmi hai!');

    if (isEditing) {
      setWorkers((prevWorkers) =>
        prevWorkers.map((w) =>
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
        )
      );
    } else {
      const newWorker = {
        id: Date.now(),
        name: wName.trim(),
        phone: wPhone.trim(),
        specializedIn: wSpec,
        baseRate: Number(wBaseRate) || 0,
        transactions: [] // Empty ledger for fresh staff
      };
      // Fixed: Target explicitly directed to 'data' matrix to eliminate runtime freeze
      setWorkers([newWorker, ...data]);
    }
    setShowAddModal(false);
  };

  // Dynamic Transaction Injection Engine
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

    setWorkers((prevWorkers) =>
      prevWorkers.map((w) => {
        if (w.id === selectedWorker.id) {
          const currentTxs = w.transactions && Array.isArray(w.transactions) ? [...w.transactions] : [];
          return {
            ...w,
            transactions: [...currentTxs, { type: txType, amount: finalAmount, date: txDate, note: computedNote }]
          };
        }
        return w;
      })
    );

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
      {/* Premium Management Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-xs font-black tracking-widest text-[#8a6d3b] uppercase">🧳 KARIGAR VAULT ENGINE</h3>
          <p className="text-[10px] font-bold text-gray-400">Total Staff Force: {data.length}</p>
        </div>
        <button onClick={openAddManager} className="bg-[#1f1610] text-[#cca464] font-black text-xs px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-md">
          ➕ Add New Karigar
        </button>
      </div>

      {/* Financial Analytics Summary Bar */}
      <div className="bg-gradient-to-r from-[#1f1610] to-[#2d221a] p-3 rounded-2xl text-center shadow-xs">
        <span className="text-[10px] font-bold text-rose-400 block uppercase tracking-wider">Total Outstandings (Dukan ka Udhaar)</span>
        <span className="text-sm font-black text-white">Rs. {totalPayableToStaff}</span>
      </div>

      {/* Main Karigar Cards List */}
      <div className="space-y-3">
        {data.map((worker) => {
          const currentBalance = getWorkerBalance(worker);
          return (
            <div key={worker.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-3 transition-all duration-300">
              
              {/* Card Main Info Row */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-base text-gray-800 tracking-wide">{worker.name}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">🧵 Specialty: <span className="font-bold text-gray-700">{worker.specializedIn}</span></p>
                  <p className="text-[10px] font-bold text-amber-700 mt-0.5">🏷️ Fix Rate: Rs. {worker.baseRate || 0} / suit</p>
                  <p className="text-[10px] text-gray-400 font-medium">📞 {worker.phone}</p>
                </div>
                
                {/* Clickable Ledger Trigger Badge */}
                <button
                  onClick={() => openLedgerManager(worker)}
                  className={`text-[11px] font-black px-3 py-2 rounded-xl border text-right transition-all active:scale-95 cursor-pointer ${
                    currentBalance > 0 ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }`}
                >
                  <span className="block text-[8px] uppercase tracking-wider text-gray-400 font-bold">Payable Balance</span>
                  Rs. {currentBalance} 💸
                </button>
              </div>

              {/* Actions Control Console Row */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openLedgerManager(worker)} className="bg-[#1f1610] text-[#cca464] font-black text-xs px-3.5 py-2 rounded-xl active:scale-95 transition-all">
                    ⚖️ Quick Khata
                  </button>
                  <button onClick={() => openEditManager(worker)} className="bg-blue-50 text-blue-600 font-black text-xs px-3 py-2 rounded-xl active:scale-95 transition-colors">
                    📝 Edit Rate
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button onClick={() => triggerWorkerWhatsApp(worker)} className="bg-[#25D366] text-white flex items-center gap-1 text-xs font-black px-3 py-2 rounded-xl active:scale-95 transition-all">
                    💬 WhatsApp
                  </button>
                  <button onClick={() => onDelete(worker.id)} className="bg-rose-50 text-rose-600 p-2 rounded-xl transition-colors">🗑️</button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 💸 [MODAL OVERLAY 1] DOUBLE ENTRY LEDGER TRANSACTION ENGINE */}
      {showLedgerModal && selectedWorker && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border-t-8 border-[#1f1610] space-y-4 max-h-[88vh] overflow-y-auto">
            <div>
              <h4 className="font-black text-gray-800 text-base">⚖️ KARIGAR LEDGER CONSOLE</h4>
              <p className="text-xs font-bold text-gray-500">Staff Account: <span className="text-gray-900 font-black">{selectedWorker.name}</span></p>
            </div>

            {/* Quick Transaction Segment Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-xl border">
              <button onClick={() => setTxType('WAGE')} className={`text-xs font-black py-2 rounded-lg transition-all ${txType === 'WAGE' ? 'bg-[#1f1610] text-white shadow-xs' : 'text-gray-500'}`}>🪡 Record Sile Suit (+)</button>
              <button onClick={() => setTxType('DEBIT')} className={`text-xs font-black py-2 rounded-lg transition-all ${txType === 'DEBIT' ? 'bg-rose-600 text-white shadow-xs' : 'text-gray-500'}`}>💵 Give Hafta / Advance (-)</button>
            </div>

            {/* Dynamic UI Render Base on Tab Type */}
            {txType === 'WAGE' ? (
              <div className="bg-amber-50/40 p-3 rounded-xl border border-amber-100 space-y-2.5">
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider">🪡 Mazdoori Calculator Engine (Talent Base Rate)</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Suits Siled Count</label>
                    <input type="number" value={suitCount} onChange={(e) => setSuitCount(e.target.value)} className="p-2 w-full text-xs font-black rounded-lg border bg-white" min="1" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Rate Per Suit (Rs.)</label>
                    <input type="number" value={customRate} onChange={(e) => setCustomRate(e.target.value)} className="p-2 w-full text-xs font-black rounded-lg border bg-white text-amber-700" />
                  </div>
                </div>
                <div className="text-xs font-black text-right text-gray-700">
                  Total Added Wages: <span className="text-emerald-600 text-sm">Rs. {(Number(suitCount) || 1) * (Number(customRate) || 0)}</span>
                </div>
              </div>
            ) : (
              <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-100 space-y-2">
                <p className="text-[10px] font-black text-rose-800 uppercase tracking-wider">💵 Record Debit Transaction</p>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Paid Amount (Rs.)</label>
                  <input type="number" placeholder="Enter Cash Amount" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} className="p-2.5 w-full text-xs font-black rounded-lg border bg-white text-rose-700" />
                </div>
              </div>
            )}

            {/* Meta Notes & Logs Input */}
            <div className="space-y-2">
              <input type="text" placeholder="Optional Description Note (e.g. 3 Cotton, 2 WashWear)" value={txNote} onChange={(e) => setTxNote(e.target.value)} className="w-full p-2.5 text-xs font-bold bg-gray-50 border rounded-xl" />
              <input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} className="w-full p-2 text-xs font-bold bg-gray-50 border rounded-xl text-center" />
            </div>

            {/* Micro Past Ledger Logs Timeline view */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase block">📋 History Logs Timeline</label>
              <div className="bg-gray-50 p-2 rounded-xl border max-h-[110px] overflow-y-auto space-y-1.5">
                {selectedWorker.transactions && selectedWorker.transactions.length > 0 ? (
                  selectedWorker.transactions.map((tx, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] bg-white p-1.5 rounded-md border shadow-2xs">
                      <div>
                        <span className={`font-black ${tx.type === 'WAGE' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.type === 'WAGE' ? '+' : '-'} Rs. {tx.amount}
                        </span>
                        <p className="text-[8px] text-gray-400 font-medium leading-none">{tx.note}</p>
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold">{tx.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-center text-gray-400 py-2 font-medium">Koi transaction log nahi hai.</p>
                )}
              </div>
            </div>

            {/* Action Controllers */}
            <div className="flex gap-2 pt-1">
              <button onClick={executeInjectTransaction} className="flex-1 bg-emerald-600 text-white font-black py-2.5 rounded-xl text-xs active:bg-emerald-700 shadow-xs">Post Transaction</button>
              <button onClick={() => setShowLedgerModal(false)} className="bg-gray-100 text-gray-600 font-black px-4 py-2.5 rounded-xl text-xs active:bg-gray-200">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 🧳 [MODAL OVERLAY 2] REGISTRATION AND PROFILE UPDATE FLOW FORM */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-[#fdf6e9] p-5 shadow-2xl border border-[#cca464]/30 space-y-4">
            <h4 className="font-black text-gray-800 text-sm uppercase border-b pb-2">
              {isEditing ? '📝 EDIT STAFF ARCHITECTURE PROFILE' : '🧳 NEW STAFF FORCE REGISTRY'}
            </h4>
            <form onSubmit={handleSaveWorker} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Karigar / Master Name</label>
                <input type="text" placeholder="e.g. Zahid Karigar" value={wName} onChange={(e) => setWName(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">WhatsApp Number (923... Format)</label>
                <input type="text" placeholder="e.g. 923123456789" value={wPhone} onChange={(e) => setWPhone(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Specialization</label>
                  <select value={wSpec} onChange={(e) => setWSpec(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-xs font-black text-gray-700">
                    <option value="Suit Stitching">Suit Stitching</option>
                    <option value="Cutting Master">Cutting Master</option>
                    <option value="Kaj / Button Press">Kaj / Button Press</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Fix Suit Rate (Rs.)</label>
                  <input type="number" placeholder="Fix Rate e.g. 450" value={wBaseRate} onChange={(e) => setWBaseRate(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-xs font-black text-amber-700 text-center" />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 active:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-sm shadow-md">
                  {isEditing ? 'Update Configuration' : 'Save Worker Profile'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-200 text-gray-700 font-black px-4 py-2.5 rounded-xl text-sm active:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
