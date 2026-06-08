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
      {/* Wholesaler Head Matrix Strip */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-xs font-black tracking-widest text-[#8a6d3b] uppercase">🏢 WHOLESALERS VAULT</h3>
          <p className="text-[10px] font-bold text-gray-400">Total Merchants: {data.length}</p>
        </div>
        <button onClick={openAddManager} className="bg-[#1f1610] text-[#cca464] font-black text-xs px-5 py-2.5 rounded-xl shadow-md active:scale-95 transition-all">
          ➕ Add Merchant
        </button>
      </div>

      {/* Aggregate Financial Outstanding Widget */}
      <div className="bg-gradient-to-r from-[#1f1610] to-[#2d221a] p-3 rounded-2xl text-center shadow-xs">
        <span className="text-[10px] font-bold text-blue-400 block uppercase tracking-wider">Total Market Payable (Wholesale Udhaar)</span>
        <span className="text-sm font-black text-white">Rs. {totalMarketPayable}</span>
      </div>

      {/* Wholesalers Interactive Cards Dynamic Render */}
      <div className="space-y-3">
        {data.map((ws) => {
          const currentBalance = getMerchantBalance(ws);
          return (
            <div key={ws.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-base text-gray-800 tracking-wide">{ws.name}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">📦 Main Supply: <span className="font-bold text-gray-700">{ws.item}</span></p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">📞 {ws.phone}</p>
                </div>
                
                {/* Trigger Ledger Modal on Balance Badge Click */}
                <button
                  onClick={() => openLedgerManager(ws)}
                  className={`text-[11px] font-black px-3 py-2 rounded-xl border text-right transition-all active:scale-95 cursor-pointer ${
                    currentBalance > 0 ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }`}
                >
                  <span className="block text-[7px] uppercase tracking-wider text-gray-400 font-bold">Total Dena Hai</span>
                  Rs. {currentBalance} 💳
                </button>
              </div>

              {/* Action Buttons Matrix Console */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openLedgerManager(ws)} className="bg-[#1f1610] text-[#cca464] font-black text-xs px-3.5 py-2 rounded-xl active:scale-95 transition-all">
                    ⚖️ Ledger Khata
                  </button>
                  <button onClick={() => openEditManager(ws)} className="bg-gray-50 text-gray-600 font-black text-xs px-3 py-2 rounded-xl active:scale-95 transition-colors">
                    📝 Edit info
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button onClick={() => triggerWholesalerWhatsApp(ws)} className="bg-[#25D366] text-white text-xs font-black px-3 py-2 rounded-xl active:scale-95 transition-all">
                    💬 WhatsApp
                  </button>
                  <button onClick={() => onDelete(ws.id)} className="bg-rose-50 text-rose-600 p-2 rounded-xl transition-colors">🗑️</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ⚖️ [MODAL OVERLAY 1] WHOLESALE TRANSACTION ENGINE */}
      {showLedgerModal && selectedMerchant && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border-t-8 border-[#1f1610] space-y-4 max-h-[88vh] overflow-y-auto">
            <div>
              <h4 className="font-black text-gray-800 text-base">⚖️ MERCHANT STATEMENT MANAGER</h4>
              <p className="text-xs font-bold text-gray-500">Shop: <span className="text-gray-900 font-black">{selectedMerchant.name}</span></p>
            </div>

            {/* Micro Credit/Debit Navigator Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-xl border">
              <button onClick={() => setTxType('PURCHASE')} className={`text-xs font-black py-2 rounded-lg transition-all ${txType === 'PURCHASE' ? 'bg-[#1f1610] text-white shadow-xs' : 'text-gray-500'}`}>📦 New Stock / Udhaar (+)</button>
              <button onClick={() => setTxType('PAYMENT')} className={`text-xs font-black py-2 rounded-lg transition-all ${txType === 'PAYMENT' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-500'}`}>💵 Give Payment (-)</button>
            </div>

            {/* Input Dynamic Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Amount (Rs.)</label>
                <input type="number" placeholder="Enter Amount" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} className="p-2.5 w-full text-xs font-black rounded-lg border bg-white focus:outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Description Note</label>
                <input type="text" placeholder="e.g. 5 Thaan Cotton, Bill #405" value={txNote} onChange={(e) => setTxNote(e.target.value)} className="w-full p-2.5 text-xs font-bold bg-gray-50 border rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Transaction Date</label>
                <input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} className="w-full p-2 text-xs font-bold bg-gray-50 border rounded-xl text-center focus:outline-none" />
              </div>
            </div>

            {/* Ledger History Stream View */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase block">📋 Past Statement Timeline Logs</label>
              <div className="bg-gray-50 p-2 rounded-xl border max-h-[120px] overflow-y-auto space-y-1.5">
                {selectedMerchant.history && selectedMerchant.history.length > 0 ? (
                  selectedMerchant.history.map((log, index) => (
                    <div key={index} className="flex justify-between items-center text-[10px] bg-white p-1.5 rounded-md border shadow-2xs">
                      <div>
                        <span className={`font-black ${log.type === 'PURCHASE' ? 'text-blue-600' : 'text-emerald-600'}`}>
                          {log.type === 'PURCHASE' ? '+' : '-'} Rs. {log.amount}
                        </span>
                        <p className="text-[8px] text-gray-400 font-medium leading-tight">{log.note}</p>
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold">{log.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-center text-gray-400 py-2 font-medium">Koi transaction statement nahi hai.</p>
                )}
              </div>
            </div>

            {/* Post Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button onClick={handlePostTransaction} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-xs transition-all shadow-xs">Post Ledger Log</button>
              <button onClick={() => setShowLedgerModal(false)} className="bg-gray-100 text-gray-600 font-black px-4 py-2.5 rounded-xl text-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 🏢 [MODAL OVERLAY 2] WHOLESALER MERCHANTS REGISTRATION FORM */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-[#fdf6e9] p-5 shadow-2xl border border-[#cca464]/30 space-y-4">
            <h4 className="font-black text-gray-800 text-sm uppercase border-b pb-2 tracking-wide">
              {isEditing ? '📝 EDIT MERCHANT ARCHITECTURE' : '🏢 NEW WHOLESALER MERCHANT'}
            </h4>
            <form onSubmit={handleSaveWS} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Merchant / Shop Name</label>
                <input type="text" placeholder="e.g. Faisalabad Cloth House" value={wsName} onChange={(e) => setWsName(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">WhatsApp Number</label>
                <input type="text" placeholder="e.g. 923007654321" value={wsPhone} onChange={(e) => setWsPhone(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Items Supplied</label>
                <input type="text" placeholder="e.g. Latha & Wash n Wear" value={wsItem} onChange={(e) => setWsItem(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold" />
              </div>
              
              {!isEditing && (
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Opening Balance (Dena Hai)</label>
                  <input type="number" placeholder="Opening Debt Balance" value={wsBalance} onChange={(e) => setWsBalance(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-blue-700" />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 active:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-sm shadow-md">
                  {isEditing ? 'Update Configuration' : 'Save Merchant Profile'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-200 text-gray-700 font-black px-4 py-2.5 rounded-xl text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
