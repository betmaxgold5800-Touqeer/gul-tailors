import React, { useState } from 'react';

export default function Clients({ data, setClients, onDelete }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNaapModal, setShowNaapModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [naapForm, setNaapForm] = useState({ lambaai: '', teera: '', baazu: '', ghera: '', shalwar: '', paincha: '', asan: '', galla: '' });
  const [activeGuide, setActiveGuide] = useState({ field: null, text: '' });

  // Add Client Form States
  const [formData, setFormData] = useState({ name: '', phone: '', suits: 1, isUrgent: false, silayi: 0, pKarhayi: 0, gKarhayi: 0 });

  const guides = {
    galla: "Galla: Inch-tape ko gardan ke gird ghumayen, do ungliyan andar rakhein.",
    paincha: "Paincha: Shalwar ke nichlay hissay ki chorai.",
    lambaai: "Lambaai: Kandhay se nechay daman tak.",
    teera: "Teera: Aik kandhay se dusray tak.",
    baazu: "Baazu: Kandhay se hatheli tak.",
    ghera: "Ghera: Daman ki chaorai.",
    shalwar: "Shalwar: Nemay se ponchay tak.",
    asan: "Asan: Shalwar ka asan."
  };

  const handleAddNewClient = (e) => {
    e.preventDefault();
    const newRecord = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      totalSuits: formData.suits,
      isUrgent: formData.isUrgent,
      billing: { silayi: formData.silayi, pKarhayi: formData.pKarhayi, gKarhayi: formData.gKarhayi },
      naap: { lambaai: '', teera: '', baazu: '', ghera: '', shalwar: '', paincha: '', asan: '', galla: '' }
    };
    setClients([newRecord, ...data]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Controller */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xs font-black text-[#8a6d3b] uppercase">👥 CLIENTS ENGINE</h3>
        <button onClick={() => setShowAddModal(true)} className="bg-[#1f1610] text-[#cca464] font-black text-xs px-4 py-2 rounded-xl active:scale-95 transition-all">➕ Add Client</button>
      </div>

      {/* MODAL: ADD CLIENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form onSubmit={handleAddNewClient} className="w-full max-w-sm bg-[#fdf6e9] p-5 rounded-3xl shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto">
            <h4 className="font-black text-gray-800 border-b pb-2">ADD CLIENT & SUIT ORDER</h4>
            <input type="text" placeholder="Full Name" className="w-full p-2 rounded-xl border" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Total Suits" className="p-2 rounded-xl border" onChange={(e) => setFormData({...formData, suits: e.target.value})} />
              <div className="flex items-center gap-2 p-2"><input type="checkbox" onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})} /> Urgent</div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-dashed border-gray-300 space-y-2">
              <p className="text-[10px] font-black text-gray-400">OPTIONAL BILLING</p>
              <input type="number" placeholder="Silayi" className="w-full p-2 rounded-lg border" onChange={(e) => setFormData({...formData, silayi: e.target.value})} />
              <input type="number" placeholder="Paincha Karhayi" className="w-full p-2 rounded-lg border" onChange={(e) => setFormData({...formData, pKarhayi: e.target.value})} />
              <input type="number" placeholder="Galla Karhayi" className="w-full p-2 rounded-lg border" onChange={(e) => setFormData({...formData, gKarhayi: e.target.value})} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-[#1f1610] text-[#cca464] py-2 rounded-xl font-black">Save</button>
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded-xl font-black">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: NAAP VAULT */}
      {showNaapModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white p-5 rounded-3xl shadow-2xl">
            <h4 className="font-black mb-4">📏 SIZE VAULT</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(naapForm).map((key) => (
                <div key={key} className="relative">
                  <label className="text-[10px] font-bold uppercase">{key}</label>
                  <input value={naapForm[key]} onChange={(e) => setNaapForm({...naapForm, [key]: e.target.value})} className="w-full p-2 border rounded-xl text-center font-bold" />
                  <button onClick={() => setActiveGuide(activeGuide.field === key ? {field: null, text: ''} : {field: key, text: guides[key]})} className="absolute top-6 right-2 text-amber-500 font-black text-xs">?</button>
                  {activeGuide.field === key && <p className="text-[9px] text-amber-600 font-bold mt-1">{activeGuide.text}</p>}
                </div>
              ))}
            </div>
            <button onClick={() => setShowNaapModal(false)} className="w-full mt-4 bg-gray-200 py-2 rounded-xl font-black">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
