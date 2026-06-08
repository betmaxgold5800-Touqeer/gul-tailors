import React, { useState } from 'react';
import { Download, Upload, Trash2, Database, ShieldAlert } from 'lucide-react';

/* 🔥 ACCEPTING PROPS: App.jsx ke main engine aur states se connects ho gaya hai */
export default function MoreOptions({ data, exportBackup, importBackup }) {
  const [restoreText, setRestoreText] = useState('');
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // 1. Live Counters Metrics (Calculated dynamically from live active memory)
  const totalSuits = data ? data.length : 0;
  const pendingSuits = data ? data.filter(c => c.status === 'Pending').length : 0;
  const urgentOrders = data ? data.filter(c => c.isUrgent && c.status === 'Pending').length : 0;

  // 2. Text-Area Paste Restore Handler (Synchronized with App.jsx engine keys)
  const handleTextRestore = () => {
    if (!restoreText.trim()) return;

    try {
      const parsed = JSON.parse(restoreText);
      
      // Strict Schema Check matching your v3.5 specifications
      if (!parsed.clients && !parsed.workers && !parsed.wholesalers) {
        setStatusMessage({ text: '❌ Galt backup format! Meharbani karke sahi JSON text paste karein.', type: 'error' });
        return;
      }

      // Inject directly into local storages to sync matching parent components
      if (parsed.clients) localStorage.setItem('gul_tailors_clients', JSON.stringify(parsed.clients));
      if (parsed.workers) localStorage.setItem('gul_tailors_workers', JSON.stringify(parsed.workers));
      if (parsed.wholesalers) localStorage.setItem('gul_tailors_wholesalers', JSON.stringify(parsed.wholesalers));

      setStatusMessage({ text: '✅ Data text se kamyabi se restore ho gaya hai! System reload ho raha hai...', type: 'success' });
      setRestoreText('');
      
      // Auto reload to re-hydrate memory instantly
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setStatusMessage({ text: '❌ JSON text theek nahi hai. Paste kiye gaye data ko check karein.', type: 'error' });
    }
  };

  // 3. Danger Zone: Pure Database System Reset
  const handleWipeDatabase = () => {
    if (window.confirm('⚠️ WARNING: Kya aap waqai Gul Tailors ka poora data saaf karna chahte hain? Saare naap aur khate urr jayein ge!')) {
      localStorage.removeItem('gul_tailors_clients');
      localStorage.removeItem('gul_tailors_workers');
      localStorage.removeItem('gul_tailors_wholesalers');
      setStatusMessage({ text: '🚨 Saara data permanently saaf ho chuka hai. System Reset Successfully!', type: 'error' });
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Dynamic Header Metrics Dashboard Panel */}
      <div className="bg-[#1f1610] text-white p-4 rounded-2xl shadow-lg border border-[#cca464]/25">
        <h2 className="text-sm font-black tracking-wider text-[#cca464] uppercase mb-3">✨ Quick Console Analytics</h2>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Total Orders</p>
            <p className="text-lg font-black text-[#cca464]">{totalSuits}</p>
          </div>
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Active Pending</p>
            <p className="text-lg font-black text-amber-400">{pendingSuits}</p>
          </div>
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Urgent Alert</p>
            <p className="text-lg font-black text-red-400">{urgentOrders}</p>
          </div>
        </div>
      </div>

      {/* Status Toaster Messages */}
      {statusMessage.text && (
        <div className={`p-3 rounded-xl text-xs font-bold border ${
          statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* Backup Export Section */}
      <div className="bg-[#fffdf7] border border-[#cca464]/30 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-black text-[#1f1610] uppercase tracking-wider flex items-center gap-1.5">
          <Database className="w-4 h-4 text-[#cca464]" /> One-Click File Backup
        </h3>
        <p className="text-[11px] text-black/60 leading-relaxed font-medium">
          Apne clients ka naap, karigar ka khata aur saari transactions ki standalone secure encryped JSON file mobile storage me download karein.
        </p>
        <button 
          onClick={exportBackup}
          className="w-full bg-[#1f1610] text-[#cca464] text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 border border-[#cca464]/25 hover:bg-[#2d2118] transition-all active:scale-95"
        >
          <Download className="w-4 h-4" /> Download Master File Backup (.json)
        </button>
      </div>

      {/* Backup Restore Section */}
      <div className="bg-[#fffdf7] border border-[#cca464]/30 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-black text-[#1f1610] uppercase tracking-wider flex items-center gap-1.5">
          <Upload className="w-4 h-4 text-[#cca464]" /> Direct Text Restore
        </h3>
        <p className="text-[11px] text-black/60 font-medium">
          Agar aapke paas backup file ka text copy hua pada hai, to use nichay diye gaye text box me paste karke matrix restore kar sakte hain.
        </p>
        <textarea 
          rows="3" 
          placeholder='{"clients": [...] , "workers": [...] }'
          value={restoreText}
          onChange={(e) => setRestoreText(e.target.value)}
          className="w-full border border-[#cca464]/30 rounded-xl p-3 text-[11px] bg-white font-mono focus:outline-[#cca464]"
        />
        <button 
          onClick={handleTextRestore}
          className="w-full bg-[#cca464] text-[#1f1610] text-xs font-black py-3 rounded-xl hover:bg-[#bfa15c] transition-all active:scale-95"
        >
          Inject Paste Data Matrix
        </button>
      </div>

      {/* Danger Reset Zone */}
      <div className="bg-red-50/60 border border-red-200 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-black text-red-700 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" /> System Safety Danger Zone
        </h3>
        <p className="text-[11px] text-red-600/90 font-medium leading-relaxed">
          Yeh dabane se aap ke local device storage se saare clients, naap, aur karigaro ka khata permanently clear ho jayein ge.
        </p>
        <button 
          onClick={handleWipeDatabase}
          className="w-full bg-red-600 text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-red-700 transition active:scale-95"
        >
          <Trash2 className="w-4 h-4" /> Wipe & Reset Whole Database
        </button>
      </div>

    </div>
  );
}
