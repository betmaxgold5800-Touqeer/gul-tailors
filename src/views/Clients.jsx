import React, { useState } from 'react';

export default function Clients({ data, setClients, onDelete }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', phone: '', suits: 1, isUrgent: false, 
    silayi: 0, pKarhayi: 0, gKarhayi: 0 
  });

  const handleAddNewClient = (e) => {
    e.preventDefault();
    
    // Ensure data is not empty
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill in the Name and Phone Number fields!');
      return;
    }

    const newRecord = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      totalSuits: parseInt(formData.suits) || 1,
      isUrgent: formData.isUrgent,
      udhaar: 0, // Default for new
      billing: { 
        silayi: parseFloat(formData.silayi) || 0, 
        pKarhayi: parseFloat(formData.pKarhayi) || 0, 
        gKarhayi: parseFloat(formData.gKarhayi) || 0 
      },
      naap: { lambaai: '', teera: '', baazu: '', ghera: '', shalwar: '', paincha: '', asan: '', galla: '' }
    };

    // UPDATE STATE CORRECTLY
    setClients((prevData) => [newRecord, ...prevData]);
    
    // Reset form and close modal
    setFormData({ name: '', phone: '', suits: 1, isUrgent: false, silayi: 0, pKarhayi: 0, gKarhayi: 0 });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Trigger Button */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xs font-black text-[#8a6d3b] uppercase">👥 CLIENTS ENGINE</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1f1610] text-[#cca464] font-black text-xs px-4 py-2 rounded-xl active:scale-95 transition-all"
        >
          ➕ Add Client
        </button>
      </div>

      {/* MODAL: ADD CLIENT (FIXED) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#fdf6e9] p-5 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h4 className="font-black text-gray-800 border-b pb-2 mb-4">ADD CLIENT & SUIT ORDER</h4>
            
            <form onSubmit={handleAddNewClient} className="space-y-3">
              <input type="text" placeholder="Full Name" className="w-full p-2.5 rounded-xl border" value={formData.name} required onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="tel" placeholder="WhatsApp Number" className="w-full p-2.5 rounded-xl border" value={formData.phone} required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Total Suits" className="p-2.5 rounded-xl border" value={formData.suits} onChange={(e) => setFormData({...formData, suits: e.target.value})} />
                <div className="flex items-center gap-2 px-2">
                  <input type="checkbox" id="urgent" className="w-5 h-5" checked={formData.isUrgent} onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})} />
                  <label htmlFor="urgent" className="font-bold text-xs">Urgent</label>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-dashed border-gray-300 space-y-2">
                <p className="text-[10px] font-black text-gray-400">OPTIONAL BILLING</p>
                <input type="number" placeholder="Silayi Price" className="w-full p-2 rounded-lg border" value={formData.silayi} onChange={(e) => setFormData({...formData, silayi: e.target.value})} />
                <input type="number" placeholder="Paincha Karhayi" className="w-full p-2 rounded-lg border" value={formData.pKarhayi} onChange={(e) => setFormData({...formData, pKarhayi: e.target.value})} />
                <input type="number" placeholder="Galla Karhayi" className="w-full p-2 rounded-lg border" value={formData.gKarhayi} onChange={(e) => setFormData({...formData, gKarhayi: e.target.value})} />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-[#1f1610] text-[#cca464] py-2.5 rounded-xl font-black">Save</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 bg-gray-200 rounded-xl font-black">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* ... (Naap Modal stays as is) */}
    </div>
  );
}
