import React, { useState } from 'react';

export default function Wholesalers({ data, setWholesalers, onDelete }) {
  // Modal & Configuration Management Layers
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form Input Registry States
  const [wsName, setWsName] = useState('');
  const [wsPhone, setWsPhone] = useState('');
  const [wsItem, setWsItem] = useState('');
  const [wsBalance, setWsBalance] = useState('0');

  // Ledger Transaction Management States
  const [txType, setTxType] = useState('PURCHASE'); // PURCHASE (+) ya PAYMENT (-)
  const [txAmount, setTxAmount] = useState('');
  const [txNote, setTxNote] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);

  // Helper: Wholesaler ka real-time runtime balance calculate karne ka algorithm
  const getMerchantBalance = (merchant) => {
    if (!merchant.history || !Array.isArray(merchant.history)) {
      return Number(merchant.balance) || 0; // Fallback for initial state migration
    }
    return merchant.history.reduce((sum, log) => {
      if (log.type === 'PURCHASE') return sum + log.amount;
      if (log.type === 'PAYMENT') return sum - log.amount;
      return sum;
    }, 0);
  };

  // Aggregated Summary Metric
  const totalMarketPayable = data.reduce((sum, m) => sum + getMerchantBalance(m), 0);

  // Modal Open Managers
  const openAddManager = () => {
    setIsEditing(false);
    setSelectedMerchant(null);
    setWsName('');
    setWsPhone('');
    setWsItem('');
    setWsBalance('0');
    setShowAddModal(true);
  };

  const openEditManager = (merchant) => {
    setIsEditing(true);
    setSelectedMerchant(merchant);
    setWsName(merchant.name);
    setWsPhone(merchant.phone);
    setWsItem(merchant.item || '');
    setWsBalance(String(merchant.balance || 0));
    setShowAddModal(true);
  };

  const openLedgerManager = (merchant) => {
    setSelectedMerchant(merchant);
    setTxType('PURCHASE');
    setTxAmount('');
    setTxNote('');
    setTxDate(new Date().toISOString().split('T')[0]);
    setShowLedgerModal(true);
  };

  // Atomic Save & Update Handler - [FIXED FOR MAXIMUM LOCALSTORAGE RETENTION]
  const handleSaveWS = (e) => {
    e.preventDefault();
    if (!wsName.trim() || !wsPhone.trim()) return alert('Shop ka naam aur number lazmi hai!');

    if (isEditing) {
      setWholesalers((prevWholesalers) =>
        prevWholesalers.map((w) =>
          w.id === selectedMerchant.id
            ? { ...w, name: wsName.trim(), phone: wsPhone.trim(), item: wsItem.trim() || 'Cloth Material' }
            : w
        )
      );
    } else {
      const openingAmt = parseFloat(wsBalance) || 0;
      const record = {
        id: Date.now(),
        name: wsName.trim(),
        phone: wsPhone.trim(),
        item: wsItem.trim() || 'Cloth Material',
        history: openingAmt > 0 ? [{ type: 'PURCHASE', amount: openingAmt, date: new Date().toISOString().split('T')[0], note: 'Opening Balance' }] : []
      };
      setWholesalers([record, ...data]); // Correct state propagation
    }
    setShowAddModal(false);
  };

  // Micro Transaction Poster Logic - [TYPO REMOVED & BOUND TO STABLE STATE MATRIX]
  const handlePostTransaction = () => {
    const finalAmount = parseFloat(txAmount) || 0;
    if (finalAmount <= 0) return alert('⚠️ Error: Valid amount enter karein!');

    let computedNote = txNote.trim();
    if (!computedNote) {
      computedNote = txType === 'PURCHASE' ? 'New Stock Purchased' : 'Paid to Wholesaler';
    }

    setWholesalers((prevWholesalers) =>
      prevWholesalers.map((w) => {
        if (w.id === selectedMerchant.id) {
          const currentHistory = w.history && Array.isArray(w.history) ? [...w.history] : [];
          return {
            ...w,
            history: [...currentHistory, { type: txType, amount: finalAmount, date: txDate, note: computedNote }]
          };
        }
        return w;
      })
    );
    setShowLedgerModal(false);
  };

  const triggerWholesalerWhatsApp = (merchant) => {
    const currentBalance = getMerchantBalance(merchant);
    const cleanPhone = merchant.phone.replace(/\D/g, '');
    const text = `Assalam-o-Alaikum,\n\nGul Tailors dashboard par aap ka ledger status checking order/payment balance:\n\n` +
      `🏢 Merchant: *${merchant.name}*\n` +
      `📦 Supply Item: ${merchant.item}\n` +
      `💰 Total Net Outstanding Balance: *Rs. ${currentBalance}*\n\n` +
      `*Gul Tailors Premium Vault • Adhi Kot*`;
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      
      {/* WHOLESALER HEAD MATRIX STRIP */}
      <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-3xl border border-white/5 shadow-lg backdrop-blur-xl">
        <div>
          <h3 className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200 uppercase">🏢 WHOLESALERS VAULT</h3>
          <p className="text-[10px] font-bold text-slate-500">Total System Merchants: {data.length}</p>
        </div>
        <button 
          onClick={openAddManager} 
          className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.2)] active:scale-95 transition-all"
        >
          ➕ Add Merchant
        </button>
      </div>

      {/* AGGREGATED FINANCIAL OUTSTANDING WIDGET */}
      <div className="bg-slate-900/60 p-3.5 rounded-2xl text-center border border-white/5 shadow-inner">
        <span className="text-[10px] font-black text-blue-400 block uppercase tracking-wider">Total Market Payable (Wholesale Udhaar)</span>
        <span className="text-lg font-black text-slate-200 mt-0.5 block">Rs. {totalMarketPayable.toLocaleString('en-IN')}</span>
      </div>

      {/* WHOLESALERS INTERACTIVE CARDS DYNAMIC RENDER */}
      <div className="space-y-3">
        {data.map((ws) => {
          const currentBalance = getMerchantBalance(ws);
          return (
            <div key={ws.id} className="bg-slate-900/30 rounded-3xl p-4 border border-white/5 shadow-xl flex flex-col gap-3 relative overflow-hidden transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-base text-slate-200 tracking-wide">{ws.name}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">📦 Main Supply: <span className="font-black text-yellow-500">{ws.item}</span></p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">📞 {ws.phone}</p>
                </div>
                
                {/* Trigger Ledger Modal on Balance Badge Click */}
                <button
                  onClick={() => openLedgerManager(ws)}
                  className={`text-[11px] font-black px-3 py-2 rounded-xl border text-right transition-all active:scale-95 cursor-pointer ${
                    currentBalance > 0 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                  }`}
                >
                  <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Total Dena Hai</span>
                  Rs. {currentBalance.toLocaleString('en-IN')} 💳
                </button>
              </div>

              {/* Action Buttons Matrix Console */}
              <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => openLedgerManager(ws)} 
                    className="bg-gradient-to-r from-slate-900 to-slate-950 text-slate-300 border border-white/10 hover:border-white/20 font-black text-xs px-3.5 py-2 rounded-xl active:scale-95 transition-all"
                  >
                    ⚖️ Ledger Khata
                  </button>
                  <button 
                    onClick={() => openEditManager(ws)} 
                    className="bg-slate-800/40 text-slate-400 border border-white/5 hover:border-white/10 font-black text-xs px-3 py-2 rounded-xl active:scale-95 transition-colors"
                  >
                    📝 Edit info
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => triggerWholesalerWhatsApp(ws)} 
                    className="bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 font-black text-xs px-3 py-2 rounded-xl active:scale-95 transition-all hover:bg-[#25D366]/20"
                  >
                    💬 WhatsApp
                  </button>
                  <button onClick={() => onDelete(ws.id)} className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 p-2 rounded-xl transition-colors">🗑️</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ⚖️ [MODAL OVERLAY 1] WHOLESALE TRANSACTION ENGINE */}
      {showLedgerModal && selectedMerchant && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-white/10 p-5 shadow-2xl border-t-8 border-yellow-500 space-y-4 max-h-[88vh] overflow-y-auto">
            <div>
              <h4 className="font-black text-slate-200 text-base tracking-wide">⚖️ MERCHANT STATEMENT MANAGER</h4>
              <p className="text-xs font-bold text-slate-400 mt-0.5">Shop: <span className="text-yellow-400 font-black">{selectedMerchant.name}</span></p>
            </div>

            {/* Micro Credit/Debit Navigator Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setTxType('PURCHASE')} 
                className={`text-[10px] font-black py-2 rounded-lg transition-all ${txType === 'PURCHASE' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow-sm' : 'text-slate-400'}`}
              >
                📦 New Stock / Udhaar (+)
              </button>
              <button 
                onClick={() => setTxType('PAYMENT')} 
                className={`text-[10px] font-black py-2 rounded-lg transition-all ${txType === 'PAYMENT' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'}`}
              >
                💵 Give Payment (-)
              </button>
            </div>

            {/* Input Dynamic Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-0.5 tracking-wide">Amount (Rs.)</label>
                <input type="number" placeholder="Enter Amount" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} className="p-2.5 w-full text-xs font-black rounded-lg border border-white/10 bg-slate-900 text-slate-200 focus:outline-none focus:border-yellow-500/30" />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-0.5 tracking-wide">Description Note</label>
                <input type="text" placeholder="e.g. 5 Thaan Cotton, Bill #405" value={txNote} onChange={(e) => setTxNote(e.target.value)} className="w-full p-2.5 text-xs font-bold border border-white/10 bg-slate-900 text-slate-200 rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-0.5 tracking-wide">Transaction Date</label>
                <input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} className="w-full p-2 text-xs font-bold border border-white/10 bg-slate-900 text-slate-300 rounded-xl text-center focus:outline-none" />
              </div>
            </div>

            {/* Ledger History Stream View */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 tracking-wide">📋 Past Statement Timeline Logs</label>
              <div className="bg-slate-950/30 p-2 rounded-xl border border-white/5 max-h-[120px] overflow-y-auto space-y-1.5 border-dashed">
                {selectedMerchant.history && selectedMerchant.history.length > 0 ? (
                  selectedMerchant.history.map((log, index) => (
                    <div key={index} className="flex justify-between items-center text-[10px] bg-slate-900/60 p-1.5 rounded-md border border-white/5 shadow-sm">
                      <div>
                        <span className={`font-black ${log.type === 'PURCHASE' ? 'text-blue-400' : 'text-emerald-400'}`}>
                          {log.type === 'PURCHASE' ? '+' : '-'} Rs. {log.amount.toLocaleString('en-IN')}
                        </span>
                        <p className="text-[8px] text-slate-500 font-medium mt-0.5 leading-tight">{log.note}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold">📅 {log.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-center text-slate-500 py-2 font-medium">Koi transaction statement nahi hai.</p>
                )}
              </div>
            </div>

            {/* Post Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button onClick={handlePostTransaction} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-xs transition-all shadow-md">Post Ledger Log</button>
              <button onClick={() => setShowLedgerModal(false)} className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-black px-4 py-2.5 rounded-xl text-xs border border-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 🏢 [MODAL OVERLAY 2] WHOLESALER MERCHANTS REGISTRATION FORM */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-white/10 p-5 shadow-2xl space-y-4">
            <h4 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 text-sm uppercase border-b border-white/5 pb-2 tracking-wide">
              {isEditing ? '📝 EDIT MERCHANT ARCHITECTURE' : '🏢 NEW WHOLESALER MERCHANT'}
            </h4>
            <form onSubmit={handleSaveWS} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">Merchant / Shop Name</label>
                <input type="text" placeholder="e.g. Faisalabad Cloth House" value={wsName} onChange={(e) => setWsName(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 text-slate-200 font-bold text-sm focus:outline-none focus:border-yellow-500/40" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">WhatsApp Number</label>
                <input type="text" placeholder="e.g. 923007654321" value={wsPhone} onChange={(e) => setWsPhone(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 text-slate-200 font-bold text-sm focus:outline-none focus:border-yellow-500/40" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">Items Supplied</label>
                <input type="text" placeholder="e.g. Latha & Wash n Wear" value={wsItem} onChange={(e) => setWsItem(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 text-slate-200 font-bold text-sm focus:outline-none focus:border-yellow-500/40" />
              </div>
              
              {!isEditing && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">Opening Balance (Dena Hai)</label>
                  <input type="number" placeholder="Opening Debt Balance" value={wsBalance} onChange={(e) => setWsBalance(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 text-blue-400 font-bold text-sm focus:outline-none focus:border-blue-500/40" />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-sm shadow-md transition-colors">
                  {isEditing ? 'Update Configuration' : 'Save Merchant Profile'}
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
