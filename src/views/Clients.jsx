import React, { useState } from 'react';

export default function Clients({ data, setClients, onDelete }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNaapModal, setShowNaapModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Form Input States
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSuitType, setNewSuitType] = useState('Shalwar Kameez');
  const [newUdhaar, setNewUdhaar] = useState('0');
  const [newDelivery, setNewDelivery] = useState('');

  // Naap temporary modification states
  const [naapForm, setNaapForm] = useState({ lambaai: '', teera: '', baazu: '', ghera: '', shalwar: '', mora: '', asan: '' });

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
      naap: { lambaai: '39', teera: '17', baazu: '22', ghera: '23', shalwar: '37', mora: '8', asan: '14' } // Standard initial
    };

    setClients([newRecord, ...data]);
    setShowAddModal(false);
    setNewName(''); setNewPhone(''); setNewUdhaar('0'); setNewDelivery('');
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

  const handleEditInline = (client) => {
    const editedName = prompt("Client ka naya naam likhein:", client.name);
    if (editedName) {
      setClients(data.map(c => c.id === client.id ? { ...c, name: editedName } : c));
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Controller Panel */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-xs font-black tracking-widest text-[#8a6d3b] uppercase">👥 CLIENTS ENGINE</h3>
          <p className="text-[10px] font-bold text-gray-400">Total System Entries: {data.length}</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1f1610] hover:bg-[#cca464] hover:text-[#1f1610] text-[#cca464] font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
        >
          ➕ Add Client
        </button>
      </div>

      {/* Main Stream Registry */}
      <div className="space-y-3">
        {data.map((client) => (
          <div key={client.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-md space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-black text-base text-gray-800 tracking-wide">{client.name}</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  ✂️ {client.suitType} • Delivery: <span className="font-bold text-gray-700">{client.deliveryDate}</span>
                </p>
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded-lg ${client.udhaar > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700'}`}>
                {client.udhaar > 0 ? `Udhaar: Rs. ${client.udhaar}` : 'Clear ✅'}
              </span>
            </div>

            {/* Quick Action Matrix */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <button 
                onClick={() => openNaapManager(client)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95"
              >
                📏 Naap System
              </button>
              
              <div className="flex gap-1.5">
                <button 
                  onClick={() => triggerWhatsApp(client.phone, client.name, client.udhaar)}
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black p-1.5 rounded-xl"
                >
                  💬 WhatsApp
                </button>
                <button onClick={() => handleEditInline(client)} className="bg-gray-100 text-gray-700 text-xs font-black p-1.5 rounded-xl">✏️ Edit</button>
                <button onClick={() => onDelete(client.id)} className="bg-rose-50 text-rose-600 text-xs font-black p-1.5 rounded-xl">🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: Add New Client Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#fdf6e9] p-5 shadow-2xl border border-[#cca464]/30 space-y-4">
            <h4 className="font-black text-gray-800 text-base border-b border-gray-200 pb-2">📋 ADD NEW CLIENT REGISTRATION</h4>
            <form onSubmit={handleAddNewClient} className="space-y-3">
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase block mb-1">Full Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm" placeholder="e.g. Tariq Iqbal" required />
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase block mb-1">WhatsApp Phone (923... format)</label>
                <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm" placeholder="e.g. 923001234567" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase block mb-1">Suit Structure</label>
                  <select value={newSuitType} onChange={(e) => setNewSuitType(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm">
                    <option>Shalwar Kameez</option>
                    <option>Kurta Pajama</option>
                    <option>Pent Shirt</option>
                    <option>Sherwani</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase block mb-1">Initial Udhaar</label>
                  <input type="number" value={newUdhaar} onChange={(e) => setNewUdhaar(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase block mb-1">Target Delivery Date</label>
                <input type="date" value={newDelivery} onChange={(e) => setNewDelivery(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 text-white font-black py-2.5 rounded-xl text-sm">Save Registry</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-200 text-gray-700 font-black px-4 py-2.5 rounded-xl text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Tailoring Naap Specifications Vault */}
      {showNaapModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border-t-8 border-amber-500 space-y-4 max-h-[85vh] overflow-y-auto">
            <div>
              <h4 className="font-black text-gray-800 text-base">📏 SIZE SPECIFICATIONS VAULT</h4>
              <p className="text-xs font-bold text-amber-600">Client Profile: {selectedClient.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              {Object.keys(naapForm).map((key) => (
                <div key={key}>
                  <label className="text-[11px] font-black text-gray-400 capitalize block mb-0.5">{key}</label>
                  <input 
                    type="text" 
                    value={naapForm[key]} 
                    onChange={(e) => setNaapForm({ ...naapForm, [key]: e.target.value })} 
                    className="w-full p-2 rounded-lg border border-gray-200 bg-white text-center font-black text-sm text-gray-800"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={saveNaapChanges} className="flex-1 bg-amber-500 text-white font-black py-2 rounded-xl text-sm shadow-md">Save Naap Spec</button>
              <button onClick={() => setShowNaapModal(false)} className="bg-gray-100 text-gray-700 font-black px-4 py-2 rounded-xl text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
