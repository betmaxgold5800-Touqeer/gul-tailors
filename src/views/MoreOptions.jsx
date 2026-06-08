import React, { useState } from 'react';
import { Download, Upload, Trash2, Database, ShieldAlert, Activity } from 'lucide-react';

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
      <div className="bg-slate-900/40 p-4 rounded-3xl border border-white/5 shadow-lg backdrop-blur-xl">
        <h2 className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200 uppercase mb-3 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-yellow-500" /> Quick Console Analytics
        </h2>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Total Orders</p>
            <p className="text-base font-black text-slate-200 mt-0.5">{totalSuits}</p>
          </div>
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Active Pending</p>
            <p className="text-base font-black text-amber-400 mt-0.5">{pendingSuits}</p>
          </div>
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Urgent Alert</p>
            <p className="text-base font-black text-rose-500 mt-0.5">{urgentOrders}</p>
          </div>
        </div>
      </div>

      {/* Status Toaster Messages */}
      {statusMessage.text && (
        <div className={`p-3.5 rounded-xl text-xs font-black border animate-fadeIn ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.05)]'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* Backup Export Section */}
      <div className="bg-slate-900/20 border border-white/5 rounded-3xl p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Database className="w-4 h-4 text-yellow-500" /> One-Click File Backup
        </h3>
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          Apne clients ka naap, karigar ka khata aur saari transactions ki standalone secure encrypted JSON file mobile storage me download karein.
        </p>
        <button 
          onClick={exportBackup}
          className="w-full bg-gradient-to-r from-slate-900 to-slate-950 text-slate-200 hover:text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 transition-all active:scale-95 shadow-md"
        >
          <Download className="w-4 h-4 text-yellow-500" /> Download Master File Backup (.json)
        </button>
      </div>

      {/* Backup Restore Section */}
      <div className="bg-slate-900/20 border border-white/5 rounded-3xl p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Upload className="w-4 h-4 text-amber-500" /> Direct Text Restore
        </h3>
        <p className="text-[11px] text-slate-400 font-medium">
          Agar aapke paas backup file ka text copy hua pada hai, to use nichay diye gaye text box me paste karke matrix restore kar sakte hain.
        </p>
        <textarea 
          rows="3" 
          placeholder='{"clients": [...] , "workers": [...] }'
          value={restoreText}
          onChange={(e) => setRestoreText(e.target.value)}
          className="w-full border border-white/10 rounded-xl p-3 text-[11px] bg-slate-950 text-emerald-400 font-mono focus:outline-none focus:border-white/20 placeholder-slate-600"
        />
        <button 
          onClick={handleTextRestore}
          className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 text-xs font-black py-3 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.1)] active:scale-95 transition-all"
        >
          Inject Paste Data Matrix
        </button>
      </div>

      {/* Danger Reset Zone */}
      <div className="bg-rose-950/20 border border-rose-500/20 rounded-3xl p-4 space-y-3">
        <h3 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" /> System Safety Danger Zone
        </h3>
        <p className="text-[11px] text-rose-500/70 font-medium leading-relaxed">
          Yeh dabane se aap ke local device storage se saare clients, naap, aur karigaro ka khata permanently clear ho jayein ge.
        </p>
        <button 
          onClick={handleWipeDatabase}
          className="w-full bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
        >
          <Trash2 className="w-4 h-4" /> Wipe & Reset Whole Database
        </button>
      </div>

    </div>
  );
}
