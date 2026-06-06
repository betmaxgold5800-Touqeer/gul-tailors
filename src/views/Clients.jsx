import React, { useState } from 'react';

export default function Clients({ data, setClients, onDelete }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNaapModal, setShowNaapModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSuitType, setNewSuitType] = useState('Shalwar Kameez');
  const [newUdhaar, setNewUdhaar] = useState('0');
  const [newDelivery, setNewDelivery] = useState('');

  // UPDATED NAAP FIELDS: Galla & Paincha included
  const [naapForm, setNaapForm] = useState({ 
    lambaai: '', teera: '', baazu: '', ghera: '', 
    shalwar: '', paincha: '', asan: '', galla: '' 
  });

  // VISUAL INSTRUCTION GUIDE
  const showGuide = (field) => {
    const guides = {
      galla: "Galla: Inch-tape ko gardan ke gird ghumayen, do ungliyan andar rakhein.",
      paincha: "Paincha: Shalwar ke nichlay hissay ki chorai (in inches).",
      lambaai: "Lambaai: Kandhay (shoulder) ki silai se nechay daman tak.",
      teera: "Teera: Aik kandhay ki haddi se dusray kandhay ki haddi tak.",
      baazu: "Baazu: Kandhay ki silai se hatheli ke nichlay hissay tak.",
      ghera: "Ghera: Daman ki chaorai.",
      shalwar: "Shalwar: Nemay (belt) se ponchay tak.",
      asan: "Asan: Shalwar ka asan (crotch length)."
    };
    alert(guides[field] || "Tape ko seedha aur tann kar rakhein.");
  };

  const triggerWhatsApp = (phone, name, udhaar) => {
    const baseUrl = "https://api.whatsapp.com/send";
    const text = `Assalam-o-Alaikum ${name} Bhai,\n\nGul Tailors ki taraf se aap ke suit ke ledger ka baqi bacha balance Rs. ${udhaar} hai. Baraye meherbani jald az jald isay clear karwadein.\n\nShukriya!\n*Gul Tailors Premium Vault*`;
    window.open(`${baseUrl}?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAddNewClient = (e) => {
    e.preventDefault();
    if (!newName || !newPhone) return alert('Name aur Phone Number lazmi likhein!');
    
    const newRecord = {
      id: Date.now(),
      name: newName,
      phone: newPhone,
      suitType: newSuitType,
      udhaar: parseFloat(newUdhaar) || 0,
      deliveryDate: newDelivery || '2026-06-30',
      naap: { lambaai: '', teera: '', baazu: '', ghera: '', shalwar: '', paincha: '', asan: '', galla: '' }
    };

    setClients([newRecord, ...data]);
    setShowAddModal(false);
  };

  const openNaapManager = (client) => {
    setSelectedClient(client);
    setNaapForm(client.naap);
    setShowNaapModal(true);
  };

  const saveNaapChanges = () => {
    setClients(data.map(c => c.id === selectedClient.id ? { ...c, naap: naapForm } : c));
    setShowNaapModal(false);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-xs font-black tracking-widest text-[#8a6d3b] uppercase">👥 CLIENTS ENGINE</h3>
          <p className="text-[10px] font-bold text-gray-400">Total Entries: {data.length}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-[#1f1610] text-[#cca464] font-black text-xs px-4 py-2 rounded-xl">➕ Add Client</button>
      </div>

      {/* Registry Display */}
      <div className="space-y-3">
        {data.map((client) => (
          <div key={client.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-md space-y-3">
            <div className="flex justify-between">
              <h4 className="font-black text-base">{client.name}</h4>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${client.udhaar > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {client.udhaar > 0 ? `Udhaar: ${client.udhaar}` : 'Clear'}
              </span>
            </div>
            <button onClick={() => openNaapManager(client)} className="w-full bg-amber-500 text-white font-black text-xs py-2 rounded-xl">📏 Manage Naap</button>
          </div>
        ))}
      </div>

      {/* NAAP MODAL WITH INSTRUCTION GUIDES */}
      {showNaapModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border-t-8 border-amber-500 max-h-[85vh] overflow-y-auto">
            <h4 className="font-black text-gray-800 mb-4">📏 {selectedClient.name} - SIZE VAULT</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(naapForm).map((key) => (
                <div key={key} className="relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase capitalize">{key}</label>
                  <input 
                    type="text" 
                    value={naapForm[key]} 
                    onChange={(e) => setNaapForm({ ...naapForm, [key]: e.target.value })} 
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 font-bold text-sm text-center"
                  />
                  <button onClick={() => showGuide(key)} className="absolute top-6 right-2 text-amber-600 font-black text-xs">?</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={saveNaapChanges} className="flex-1 bg-emerald-600 text-white font-black py-2.5 rounded-xl">Save</button>
              <button onClick={() => setShowNaapModal(false)} className="bg-gray-200 text-gray-700 font-black px-4 py-2.5 rounded-xl">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
