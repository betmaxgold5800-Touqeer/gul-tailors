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

export default function Dashboard({ 
  navigateTo, 
  clientsCount, 
  workersCount, 
  wholesalersCount, 
  financials = {} 
}) {
  
  // Safely fallback to 0 if the state metric is not computed yet
  const {
    todayRevenue = 0,
    todayExpense = 0,
    monthlyRevenue = 0,
    netProfit = 0,
    totalClientUdhaar = 0,
    totalWorkerPayable = 0,
    totalWholesalerBalance = 0
  } = financials;

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      
      {/* 👑 PREMIUM NEON HERO DISPLAY BANNER */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0b1329] to-[#020617] border border-white/5 text-center overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent)]" />
        
        {/* BIG HERO LOGO */}
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 border border-white/10 p-1 shadow-[0_0_25px_rgba(59,130,246,0.2)]">
          <img 
            src="/logo.png" 
            alt="Gul Tailors Main Logo" 
            className="h-full w-full object-cover scale-110 rounded-xl"
          />
        </div>
        <h2 className="text-xl font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500">
          GUL TAILORS
        </h2>
        <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase mt-2 bg-white/5 inline-block px-3 py-0.5 rounded-full border border-white/10">
          PREMIUM DIGITAL VAULT & LEDGER
        </p>
      </div>

      {/* 📊 NEON MATRIX GRID (REAL-TIME COMPUTED) */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Card 1: Aaj Aaya */}
        <button 
          onClick={() => navigateTo('clients')}
          className="group p-4 rounded-3xl bg-slate-900/40 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] active:scale-95 text-left focus:outline-none"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[9px] font-black tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">AAJ AAYA</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <span className="text-xl font-black tracking-tight text-slate-100 group-hover:text-white transition-colors">
              Rs. {todayRevenue.toLocaleString('en-IN')}
            </span>
            <p className="text-[9px] text-slate-500 font-bold mt-1">Active Clients: ({clientsCount})</p>
          </div>
        </button>

        {/* Card 2: Aaj Kharcha */}
        <button 
          onClick={() => navigateTo('workers')}
          className="group p-4 rounded-3xl bg-slate-900/40 border border-rose-500/20 hover:border-rose-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.05)] hover:shadow-[0_0_20px_rgba(244,63,94,0.1)] active:scale-95 text-left focus:outline-none"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[9px] font-black tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">AAJ KHARCHA</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <span className="text-xl font-black tracking-tight text-slate-100 group-hover:text-white transition-colors">
              Rs. {todayExpense.toLocaleString('en-IN')}
            </span>
            <p className="text-[9px] text-slate-500 font-bold mt-1">Worker Payouts: ({workersCount})</p>
          </div>
        </button>

        {/* Card 3: Mahana Aaya */}
        <button 
          onClick={() => navigateTo('clients')}
          className="group p-4 rounded-3xl bg-slate-900/40 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] active:scale-95 text-left focus:outline-none"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[9px] font-black tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">MAHANA AAYA</span>
            <Briefcase className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-4">
            <span className="text-xl font-black tracking-tight text-slate-100 group-hover:text-white transition-colors">
              Rs. {monthlyRevenue.toLocaleString('en-IN')}
            </span>
            <p className="text-[9px] text-slate-500 font-bold mt-1">Is mahine ki kul aamdani</p>
          </div>
        </button>

        {/* Card 4: Saaf Munafa */}
        <button 
          onClick={() => navigateTo('aur')}
          className="group p-4 rounded-3xl bg-slate-900/40 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.05)] hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] active:scale-95 text-left focus:outline-none"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[9px] font-black tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">SAAF MUNAFA</span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-6 transition-transform" />
          </div>
          <div className="mt-4">
            <span className="text-xl font-black tracking-tight text-slate-100 group-hover:text-white transition-colors">
              Rs. {netProfit.toLocaleString('en-IN')}
            </span>
            <p className="text-[9px] text-slate-500 font-bold mt-1">View Analytics overview</p>
          </div>
        </button>
      </div>

      {/* 🏦 LIVE LEDGER BALANCE MATRICES */}
      <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
        <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Layers className="w-4 h-4 text-yellow-500" /> LEDGER BALANCE MATRICES
        </h3>
        
        <div className="space-y-2">
          
          {/* Row 1: Clients Udhaar */}
          <div 
            onClick={() => navigateTo('clients')} 
            className="group flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5"
          >
            <div className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-300 group-hover:text-slate-200 transition-colors">Clients Se Lena Hai (Udhaar)</span>
            </div>
            <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
              Rs. {totalClientUdhaar.toLocaleString('en-IN')}
            </span>
          </div>
          
          {/* Row 2: Worker Payable */}
          <div 
            onClick={() => navigateTo('workers')} 
            className="group flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5"
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-300 group-hover:text-slate-200 transition-colors">Karigaron Ka Baqi (Payable)</span>
            </div>
            <span className="text-xs font-black text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.05)]">
              Rs. {totalWorkerPayable.toLocaleString('en-IN')}
            </span>
          </div>
          
          {/* Row 3: Wholesaler Balance */}
          <div 
            onClick={() => navigateTo('ws')} 
            className="group flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5"
          >
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-300 group-hover:text-slate-200 transition-colors">Wholesalers Ka Dena Hai</span>
            </div>
            <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.05)]">
              Rs. {totalWholesalerBalance.toLocaleString('en-IN')}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
