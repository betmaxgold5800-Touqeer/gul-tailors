import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Briefcase, 
  ShieldCheck, 
  Layers, 
  Coins, 
  UserCheck, 
  Store 
} from 'lucide-react';

export default function Dashboard({ navigateTo, clientsCount, workersCount, wholesalersCount }) {
  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      
      {/* 👑 PREMIUM NEON HEADER BANNER */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-yellow-900/20 via-[#020617] to-[#020617] border border-yellow-500/20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.15),transparent)]" />
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-2xl">✂️</span>
        </div>
        <h2 className="text-xl font-black tracking-[0.2em] text-white">GUL TAILORS</h2>
        <p className="text-[9px] font-black tracking-[0.2em] text-yellow-500 uppercase mt-1">DIGITAL VAULT & LEDGER</p>
      </div>

      {/* 📊 NEON CLICKABLE METRICS */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Card: Aaj Aaya */}
        <button 
          onClick={() => navigateTo('clients')}
          className="p-4 rounded-3xl bg-slate-900/50 border border-emerald-500/20 hover:border-emerald-500/50 transition-all shadow-[0_0_15px_-5px_rgba(16,185,129,0.1)] active:scale-95"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-emerald-400">AAJ AAYA</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-black text-white">Rs. 12,500</p>
          <p className="text-[9px] text-slate-500 font-bold mt-1">Clients ({clientsCount})</p>
        </button>

        {/* Card: Aaj Kharcha */}
        <button 
          onClick={() => navigateTo('workers')}
          className="p-4 rounded-3xl bg-slate-900/50 border border-rose-500/20 hover:border-rose-500/50 transition-all shadow-[0_0_15px_-5px_rgba(244,63,94,0.1)] active:scale-95"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-rose-400">AAJ KHARCHA</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-lg font-black text-white">Rs. 3,200</p>
          <p className="text-[9px] text-slate-500 font-bold mt-1">Workers ({workersCount})</p>
        </button>
      </div>

      {/* 🏦 NEON LEDGER MATRICES */}
      <div className="bg-slate-900/40 border border-white/5 p-5 rounded-3xl">
        <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-yellow-500" /> LEDGER BALANCE
        </h3>
        
        <div className="space-y-3">
          <div onClick={() => navigateTo('clients')} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold text-slate-300">Udhaar</span>
            </div>
            <span className="text-xs font-black text-yellow-400">Rs. 48,000</span>
          </div>
          
          <div onClick={() => navigateTo('workers')} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-slate-300">Payable</span>
            </div>
            <span className="text-xs font-black text-rose-400">Rs. 15,500</span>
          </div>
          
          <div onClick={() => navigateTo('ws')} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-slate-300">Wholesalers</span>
            </div>
            <span className="text-xs font-black text-blue-400">Rs. 25,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
