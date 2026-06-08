import React, { useState, useEffect } from 'react';

export default function MoreSection({ navigateTo }) {
  // Master Accordion Panel State Control
  const [activePanel, setActivePanel] = useState(null); // 'RATES' | 'COMMISSIONS' | 'EXPENSES' | 'PROFILE' | null
  const [statusMessage, setStatusMessage] = useState('');

  // 1️⃣ Stitching Rate State Matrix (Default Auto Fix: Rs. 1000)
  const [stitchingRate, setStitchingRate] = useState(() => {
    return Number(localStorage.getItem('gt_stitching_rate')) || 1000;
  });

  // 2️⃣ Expense Registry State Trackers
  const [expenses, setExpenses] = useState(() => {
    return JSON.parse(localStorage.getItem('gt_expenses') || '[]');
  });
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Raw Material'); // Raw Material | Utilities | Daily Tea
  const [expNote, setExpNote] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

  // 3️⃣ Shop Profile Settings State Registry
  const [profileName, setProfileName] = useState(() => localStorage.getItem('gt_profile_name') || 'Waseem Gul Baghoor');
  const [profilePhone, setProfilePhone] = useState(() => localStorage.getItem('gt_profile_phone') || '03007614329');
  const [profileAddress, setProfileAddress] = useState(() => localStorage.getItem('gt_profile_address') || 'Main Bazar Adhi Kot, Syed Market');

  // Automatic Persistence Layers via Hooks
  useEffect(() => {
    localStorage.setItem('gt_stitching_rate', stitchingRate.toString());
  }, [stitchingRate]);

  useEffect(() => {
    localStorage.setItem('gt_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Flash Status Message Handler
  const showToaster = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Toggle Panel Layer
  const togglePanel = (panelName) => {
    setActivePanel(activePanel === panelName ? null : panelName);
  };

  // Expense Data Persistence Poster
  const handleAddExpense = (e) => {
    e.preventDefault();
    const amt = parseFloat(expAmount) || 0;
    if (amt <= 0) return alert('Valid expense amount darj karein!');

    const newExpense = {
      id: Date.now(),
      amount: amt,
      category: expCategory,
      note: expNote.trim() || `${expCategory} Kharcha`,
      date: expDate
    };

    setExpenses([newExpense, ...expenses]);
    setExpAmount('');
    setExpNote('');
    showToaster('✅ Dukan ka kharcha kamyabi se ledger mein plus ho gaya!');
  };

  // Delete Expense Log Row
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(item => item.id !== id));
    showToaster('🗑️ Expense entry log code removed.');
  };

  // Shop Profile Data Sync Handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('gt_profile_name', profileName.trim());
    localStorage.setItem('gt_profile_phone', profilePhone.trim());
    localStorage.setItem('gt_profile_address', profileAddress.trim());
    showToaster('✨ Shop Profile configuration updated safely!');
    setActivePanel(null);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      <h3 className="text-sm font-black tracking-widest text-[#8a6d3b] uppercase mb-1">
        ✨ BUSINESS CONTROLS & METRICS
      </h3>

      {/* KPI Stats Analytics row [UNTOUCHED BASE ARCHITECTURE] */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-xl border border-gray-100 text-center shadow-xs">
          <span className="text-[10px] font-black text-gray-400 block uppercase">Suits Done</span>
          <span className="text-lg font-black text-emerald-600">142</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 text-center shadow-xs">
          <span className="text-[10px] font-black text-gray-400 block uppercase">Pending</span>
          <span className="text-lg font-black text-amber-500">18</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 text-center shadow-xs">
          <span className="text-[10px] font-black text-gray-400 block uppercase">Urgent Orders</span>
          <span className="text-lg font-black text-rose-600">4</span>
        </div>
      </div>

      {/* Local Flash Toaster Notification Block */}
      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold p-2.5 rounded-xl shadow-xs text-center animate-slideDown">
          {statusMessage}
        </div>
      )}

      {/* Active Senior Dev Functional Controls Container */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-md space-y-3">
        
        {/* 1. STITCHING RATES CONTROLLER */}
        <div className="space-y-2">
          <button 
            onClick={() => togglePanel('RATES')} 
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${activePanel === 'RATES' ? 'bg-amber-100/70 border-amber-300 shadow-xs' : 'bg-amber-50 hover:bg-amber-100 border-amber-100'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">💰</span>
              <div>
                <span className="text-sm font-black text-gray-800 block">Stitching Rate List</span>
                <span className="text-xs text-gray-500 font-bold">Standard Setup Pricing • <span className="text-amber-800 font-black">Rs. {stitchingRate}</span></span>
              </div>
            </div>
            <span className={`text-gray-400 transition-transform duration-200 ${activePanel === 'RATES' ? 'rotate-90' : ''}`}>⚙️</span>
          </button>

          {activePanel === 'RATES' && (
            <div className="bg-gray-50 p-3 rounded-xl border border-dashed space-y-2.5 animate-slideDown">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase">Default Custom Suit Rate (Rs.)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={stitchingRate} 
                    onChange={(e) => setStitchingRate(Number(e.target.value) || 0)}
                    className="flex-1 p-2 bg-white border border-gray-200 rounded-xl text-sm font-black text-amber-900 text-center focus:outline-none" 
                  />
                  <button 
                    onClick={() => { togglePanel('RATES'); showToaster('💰 New standard stitching rate implemented!'); }}
                    className="bg-[#8a6d3b] text-white text-xs font-black px-4 rounded-xl active:scale-95 transition-transform shadow-xs"
                  >
                    Lock Rate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. KARIGAR COMMISSIONS ACTION ROUTER */}
        <div className="space-y-2">
          <button 
            onClick={() => togglePanel('COMMISSIONS')} 
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${activePanel === 'COMMISSIONS' ? 'bg-cyan-100/70 border-cyan-300 shadow-xs' : 'bg-cyan-50 hover:bg-cyan-100 border-cyan-100'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🧵</span>
              <div>
                <span className="text-sm font-black text-gray-800 block">Karigar Commissions</span>
                <span className="text-xs text-gray-500">Manage rates per piece configurations</span>
              </div>
            </div>
            <span className="text-gray-400">⚙️</span>
          </button>

          {activePanel === 'COMMISSIONS' && (
            <div className="bg-cyan-50/40 p-3 rounded-xl border border-cyan-100 text-[10px] text-cyan-800 font-bold leading-relaxed animate-slideDown shadow-2xs">
              💡 <span className="font-black">Senior Developer Sync:</span> Har karigar ka piece rate directly unke individual profile matrix panel (`Workers.jsx`) ke andar se adjust aur compile hota hai.
            </div>
          )}
        </div>

        {/* 3. EXPENSE REGISTRY (DUKAN KA EXPENSE LEDGER SYSTEM) */}
        <div className="space-y-2">
          <button 
            onClick={() => togglePanel('EXPENSES')} 
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${activePanel === 'EXPENSES' ? 'bg-purple-100/70 border-purple-300 shadow-xs' : 'bg-purple-50 hover:bg-purple-100 border-purple-100'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📊</span>
              <div>
                <span className="text-sm font-black text-gray-800 block">Expense Registry</span>
                <span className="text-xs text-gray-500">Thread, buttons, utility bills, cash registry</span>
              </div>
            </div>
            <span className="text-gray-400">➕</span>
          </button>

          {activePanel === 'EXPENSES' && (
            <div className="bg-gray-50 p-3.5 rounded-xl border space-y-3.5 animate-slideDown">
              {/* Add Expense Horizontal Sub Form */}
              <form onSubmit={handleAddExpense} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Amount (Rs.)</label>
                    <input type="number" placeholder="e.g. 500" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} className="w-full p-2 text-xs font-black bg-white border rounded-lg focus:outline-none" required />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Category</label>
                    <select value={expCategory} onChange={(e) => setExpCategory(e.target.value)} className="w-full p-2 text-xs font-black bg-white border rounded-lg focus:outline-none">
                      <option value="Raw Material">🧵 Raw Material</option>
                      <option value="Utilities">⚡ Utilities Bill</option>
                      <option value="Daily Tea">☕ Tea / Daily</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Expense Details Note</label>
                    <input type="text" placeholder="e.g. Bukram purchase, Nalkiyan" value={expNote} onChange={(e) => setExpNote(e.target.value)} className="w-full p-2 text-xs font-bold bg-white border rounded-lg focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Date</label>
                    <input type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} className="w-full p-1.5 text-xs font-bold bg-white border rounded-lg text-center focus:outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#8a6d3b] text-white font-black py-2 rounded-xl text-xs shadow-xs active:scale-98 transition-transform">
                  Post Expense Entry
                </button>
              </form>

              {/* Dynamic Scrolling Expense Statement Loop */}
              <div className="space-y-1.5 border-t pt-2.5">
                <span className="text-[9px] font-black text-gray-400 uppercase block">📋 Recent Expense Statement History</span>
                <div className="max-h-[130px] overflow-y-auto space-y-1 pr-1">
                  {expenses.length > 0 ? (
                    expenses.map((exp) => (
                      <div key={exp.id} className="flex justify-between items-center bg-white p-2 rounded-lg border text-[10px] shadow-2xs">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-rose-600">Rs. {exp.amount}</span>
                            <span className="bg-gray-100 text-gray-500 font-extrabold px-1 rounded text-[7px] uppercase tracking-wider">{exp.category}</span>
                          </div>
                          <p className="text-[8px] text-gray-400 font-bold mt-0.5">{exp.note}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] text-gray-400 font-bold">{exp.date}</span>
                          <button type="button" onClick={() => handleDeleteExpense(exp.id)} className="text-gray-300 hover:text-rose-600 font-bold active:scale-90 transition-transform">🗑️</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[9px] text-center text-gray-400 py-3 font-bold">Dukan ka koi expense note darj nahi hai.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. SHOP PROFILE (NEW SHOP IDENTITY CONTROLLER) */}
        <div className="space-y-2">
          <button 
            onClick={() => togglePanel('PROFILE')} 
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${activePanel === 'PROFILE' ? 'bg-gray-100 border-gray-300 shadow-xs' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <div>
                <span className="text-sm font-black text-gray-800 block">Shop Profile</span>
                <span className="text-xs text-gray-500 font-bold">{profileName} • {profilePhone} • Adhi Kot</span>
              </div>
            </div>
            <span className="text-gray-400">👤</span>
          </button>

          {activePanel === 'PROFILE' && (
            <form onSubmit={handleSaveProfile} className="bg-gray-50 p-3.5 rounded-xl border space-y-3 animate-slideDown">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Shop Header Title</label>
                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full p-2 bg-white border rounded-lg text-xs font-bold focus:outline-none" required />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">WhatsApp Billing Contact</label>
                <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full p-2 bg-white border rounded-lg text-xs font-bold focus:outline-none" required />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Physical Address Directory</label>
                <textarea rows="2" value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)} className="w-full p-2 bg-white border rounded-lg text-xs font-bold focus:outline-none" required />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-black py-2 rounded-xl text-xs shadow-xs">
                Save Profile Configuration
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Footer Branding Matrix Block [UNTOUCHED] */}
      <div className="text-center py-2">
        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          Gul Tailors Engine v2.1.0 • Connected to Firebase
        </span>
      </div>
    </div>
  );
}
