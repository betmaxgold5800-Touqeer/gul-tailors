import React, { useState } from 'react';

export default function Clients({ data, setClients, onDelete }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNaapModal, setShowNaapModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  // NEW: Inline Help State
  const [activeGuide, setActiveGuide] = useState({ field: null, text: '' });

  // ... (Keep existing states)

  const guides = {
    galla: "Galla: Inch-tape ko gardan ke gird ghumayen, do ungliyan andar rakhein.",
    paincha: "Paincha: Shalwar ke nichlay hissay ki chorai (in inches).",
    // ... add other guides
  };

  const handleGuideToggle = (field) => {
    setActiveGuide(prev => prev.field === field ? { field: null, text: '' } : { field, text: guides[field] });
  };

  return (
    <div className="space-y-4">
      {/* ADD CLIENT BUTTON FIX */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xs font-black text-[#8a6d3b] uppercase">👥 CLIENTS ENGINE</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1f1610] text-[#cca464] font-black text-xs px-4 py-2 rounded-xl active:scale-95 transition-all"
        >
          ➕ Add Client
        </button>
      </div>

      {/* MODAL 2: NAAP VAULT */}
      {showNaapModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white p-5 rounded-3xl shadow-2xl">
            <h4 className="font-black mb-4">📏 SIZE VAULT</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(naapForm).map((key) => (
                <div key={key} className="relative">
                  <label className="text-[10px] font-bold uppercase">{key}</label>
                  <input 
                    value={naapForm[key]} 
                    onChange={(e) => setNaapForm({...naapForm, [key]: e.target.value})}
                    className="w-full p-2 border rounded-xl font-bold text-center"
                  />
                  <button 
                    onClick={() => handleGuideToggle(key)} 
                    className="absolute top-6 right-2 text-amber-500 font-black text-xs"
                  >?</button>
                  
                  {/* INLINE CONTEXTUAL HELP */}
                  {activeGuide.field === key && (
                    <p className="text-[9px] text-amber-600 font-bold mt-1 leading-tight animate-fadeIn">
                      {activeGuide.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setShowNaapModal(false)} className="w-full mt-4 bg-gray-200 py-2 rounded-xl font-black">Close</button>
          </div>
        </div>
      )}
      {/* ... rest of the code */}
    </div>
  );
}
