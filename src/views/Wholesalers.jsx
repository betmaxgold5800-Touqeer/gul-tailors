import React, { useState } from 'react';

export default function Wholesalers({ data, setWholesalers, onDelete }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [wsName, setWsName] = useState('');
  const [wsPhone, setWsPhone] = useState('');
  const [wsItem, setWsItem] = useState('');
  const [wsBalance, setWsBalance] = useState('0');

  const triggerWholesalerWhatsApp = (phone, name, balance) => {
    const baseUrl = "https://api.whatsapp.com/send";
    const text = `Assalam-o-Alaikum,\nGul Tailors ki taraf se aap ka ledger status checking pending order/payment balance Rs. ${balance} chal raha hai.`;
    window.open(`${baseUrl}?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAddWS = (e) => {
    e.preventDefault();
    if (!wsName || !wsPhone) return alert('Shop ka naam aur number lazmi hai!');
    const record = { id: Date.now(), name: wsName, phone: wsPhone, balance: parseFloat(wsBalance) || 0, item: wsItem || 'Cloth Material' };
    setWholesalers([record, ...data]);
    setShowAddModal(false);
    setWsName(''); setWsPhone(''); setWsItem(''); setWsBalance('0');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-xs font-black tracking-widest text-[#8a6d3b] uppercase">🏢 WHOLESALERS VAULT</h3>
          <p className="text-[10px] font-bold text-gray-400">Total Merchants: {data.length}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-[#1f1610] text-[#cca464] font-black text-xs px-4 py-2 rounded-xl shadow-md">➕ Add Merchant</button>
      </div>

      <div className="space-y-3">
        {data.map((ws) => (
          <div key={ws.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-md flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-black text-base text-gray-800 tracking-wide">{ws.name}</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">📦 Main Supply: {ws.item}</p>
              </div>
              <span className="text-xs font-black px-2 py-1 rounded-lg bg-blue-50 text-blue-700">Dena Hai: Rs. {ws.balance}</span>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-50 pt-2">
              <button onClick={() => triggerWholesalerWhatsApp(ws.phone, ws.name, ws.balance)} className="bg-[#25D366] text-white text-xs font-black px-2.5 py-1.5 rounded-xl">💬 WhatsApp</button>
              <button onClick={() => onDelete(ws.id)} className="bg-rose-50 text-rose-600 text-xs font-black px-2.5 py-1.5 rounded-xl">🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-[#fdf6e9] p-5 shadow-2xl border border-[#cca464]/30 space-y-3">
            <h4 className="font-black text-gray-800 text-sm">🏢 NEW WHOLESALER MERCHANT</h4>
            <form onSubmit={handleAddWS} className="space-y-3">
              <input type="text" placeholder="Merchant Shop Name" value={wsName} onChange={(e) => setWsName(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold" required />
              <input type="text" placeholder="WhatsApp Phone (923...)" value={wsPhone} onChange={(e) => setWsPhone(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold" required />
              <input type="text" placeholder="Items Supplied (e.g. Latha, Buttons)" value={wsItem} onChange={(e) => setWsItem(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold" />
              <input type="number" placeholder="Balance Amount" value={wsBalance} onChange={(e) => setWsBalance(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold" />
              <div className="flex gap-2 pt-1">
                <button type="submit" className="flex-1 bg-emerald-600 text-white font-black py-2 rounded-xl text-sm">Save Merchant</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-200 text-gray-700 font-black px-4 py-2 rounded-xl text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
