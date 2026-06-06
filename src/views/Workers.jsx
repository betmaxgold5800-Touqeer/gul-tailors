import React, { useState } from 'react';

export default function Workers({ data, setWorkers, onDelete }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [wName, setWName] = useState('');
  const [wPhone, setWPhone] = useState('');
  const [wSpec, setWSpec] = useState('Suit Stitching');
  const [wPayable, setWPayable] = useState('0');

  const triggerWorkerWhatsApp = (phone, name, payable) => {
    const baseUrl = "https://api.whatsapp.com/send";
    const text = `Assalam-o-Alaikum Master ${name} Sahib,\n\nGul Tailors dashboard par aap ka total khata update ho chuka hai. Aap ka baqi bacha commission balance Rs. ${payable} hai.\n\nShukriya!`;
    window.open(`${baseUrl}?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAddWorker = (e) => {
    e.preventDefault();
    if (!wName || !wPhone) return alert('Mukammal data faraham karein!');
    const record = { id: Date.now(), name: wName, phone: wPhone, payable: parseFloat(wPayable) || 0, specializedIn: wSpec, activeSuits: 0 };
    setWorkers([record, ...data]);
    setShowAddModal(false);
    setWName(''); setWPhone(''); setWPayable('0');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-xs font-black tracking-widest text-[#8a6d3b] uppercase">🧳 KARIGAR PORTAL</h3>
          <p className="text-[10px] font-bold text-gray-400">Total Workers: {data.length}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-[#1f1610] text-[#cca464] font-black text-xs px-4 py-2 rounded-xl shadow-md">➕ Add Karigar</button>
      </div>

      <div className="space-y-3">
        {data.map((worker) => (
          <div key={worker.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-md flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-black text-base text-gray-800 tracking-wide">{worker.name}</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">🧵 Specialty: {worker.specializedIn}</p>
              </div>
              <span className="text-xs font-black px-2 py-1 rounded-lg bg-rose-50 text-rose-700">Payable: Rs. {worker.payable}</span>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-50 pt-2">
              <button onClick={() => triggerWorkerWhatsApp(worker.phone, worker.name, worker.payable)} className="bg-[#25D366] text-white text-xs font-black px-2.5 py-1.5 rounded-xl">💬 WhatsApp</button>
              <button onClick={() => onDelete(worker.id)} className="bg-rose-50 text-rose-600 text-xs font-black px-2.5 py-1.5 rounded-xl">🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-[#fdf6e9] p-5 shadow-2xl border border-[#cca464]/30 space-y-3">
            <h4 className="font-black text-gray-800 text-sm">🧳 NEW KARIGAR ENTRY</h4>
            <form onSubmit={handleAddWorker} className="space-y-3">
              <input type="text" placeholder="Karigar Name" value={wName} onChange={(e) => setWName(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold" required />
              <input type="text" placeholder="WhatsApp Number (923...)" value={wPhone} onChange={(e) => setWPhone(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold" required />
              <select value={wSpec} onChange={(e) => setWSpec(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold">
                <option>Suit Stitching</option>
                <option>Cutting Master</option>
                <option>Kaj / Button Press</option>
              </select>
              <input type="number" placeholder="Opening Balance Payable" value={wPayable} onChange={(e) => setWPayable(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold" />
              <div className="flex gap-2 pt-1">
                <button type="submit" className="flex-1 bg-emerald-600 text-white font-black py-2 rounded-xl text-sm">Save Staff</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-200 text-gray-700 font-black px-4 py-2 rounded-xl text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
