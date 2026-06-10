import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Briefcase, 
  ShieldCheck, 
  Layers, 
  Coins, 
  Store,
  CloudSun
} from 'lucide-react';

export default function Dashboard({ 
  navigateTo, 
  clientsCount, 
  workersCount, 
  wholesalersCount, 
  financials = {},
  proximityAlerts = [], 
  workersData = []      
}) {
  
  const {
    todayRevenue = 0,
    todayExpense = 0,
    monthlyRevenue = 0,
    netProfit = 0,
    totalClientUdhaar = 0,
    totalWorkerPayable = 0,
    totalWholesalerBalance = 0
  } = financials;

  // ⏰ NEON TIME ENGINE (PKT STANDARDS)
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updatePKTDateTime = () => {
      const timeOptions = { 
        timeZone: 'Asia/Karachi', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      };
      const dateOptions = {
        timeZone: 'Asia/Karachi',
        month: 'short', 
        day: 'numeric'
      };

      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-PK', timeOptions));
      setCurrentDate(now.toLocaleDateString('en-PK', dateOptions));
    };

    updatePKTDateTime();
    const timerId = setInterval(updatePKTDateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="space-y-4 animate-fadeIn pb-6 selection:bg-amber-500/30 text-slate-200">
      
      {/* 👑 COMPACT EXECUTIVE HERO DISPLAY BANNER */}
      <div className="relative p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0b1329] to-[#020617] overflow-hidden border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent)]" />
        
        {/* TOP STATUS BAR: CLOCK & WEATHER IN ONE ROW */}
        <div className="w-full flex items-center justify-between relative z-10 border-b border-white/[0.03] pb-2.5 mb-3">
          
          {/* LEFT: NEON TIME */}
          <div className="flex items-center gap-1.5 py-1 px-2 rounded-xl bg-black/40 border border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.05)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <div className="text-left leading-none">
              <span className="text-[11px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                {currentTime}
              </span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider ml-1.5 border-l border-white/10 pl-1.5">
                {currentDate}
              </span>
            </div>
          </div>

          {/* RIGHT: ADHI KOT WEATHER */}
          <div className="flex items-center gap-1.5 py-1 px-2 rounded-xl bg-black/40 border border-sky-500/10 shadow-[0_0_10px_rgba(56,189,248,0.05)]">
            <CloudSun className="w-3.5 h-3.5 text-sky-400" />
            <div className="text-right leading-none">
              <span className="text-[11px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-300">
                34°C
              </span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider ml-1.5 border-l border-white/10 pl-1.5">
                ADHI KOT
              </span>
            </div>
          </div>

        </div>

        {/* IDENTITY AREA: LOGOS AND TITLE COMBINED TO REDUCE HEIGHT */}
        <div className="flex items-center justify-between mt-1 relative z-10">
          
          {/* TEXT SIDE */}
          <div className="text-left">
            <h2 className="text-lg font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 uppercase leading-none">
              GUL TAILORS
            </h2>
            <p className="text-[8px] font-black tracking-[0.15em] text-slate-400 uppercase mt-1">
              PREMIUM DIGITAL LEDGER
            </p>
          </div>

          {/* COMPACT DUAL LOGOS */}
          <div className="flex items-center gap-2">
            {/* Core Gold Scissor */}
            <div className="h-10 w-10 rounded-xl bg-slate-950 border border-white/15 p-0.5 shadow-[0_0_15px_rgba(234,179,8,0.1)] overflow-hidden">
              <img src="/logo.png" alt="Emblem" className="h-full w-full object-cover scale-110 rounded-lg" />
            </div>
            
            <div className="h-6 w-[1px] bg-white/10" />

            {/* Master Waseem Profile */}
            <div className="h-10 w-10 rounded-xl bg-slate-950 border border-white/15 p-0.5 shadow-[0_0_15px_rgba(59,130,246,0.1)] overflow-hidden flex items-center justify-center">
              <img 
                src="/waseem.png" 
                alt="Profile" 
                className="h-full w-full object-cover scale-110 rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-full w-full items-center justify-center text-[10px] bg-blue-500/10 text-blue-400 font-black">WGM</div>
            </div>
          </div>

        </div>

      </div>

      {/* 📊 OPTION 2: STANDARDIZED UPPERCASE ROMAN-URDU FINANCIAL GRID */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* CARD 1: AAJ AAYA */}
        <button 
          onClick={() => navigateTo('clients')}
          className="group p-3.5 rounded-2xl bg-slate-900/40 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.02)] active:scale-95 text-left focus:outline-none"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[9px] font-black tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase">AAJ AAYA</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-lg font-black tracking-tight text-slate-100 group-hover:text-white transition-colors">
              Rs. {todayRevenue.toLocaleString('en-IN')}
            </span>
            <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider mt-0.5">CLIENTS COUNTER: {clientsCount}</p>
          </div>
        </button>

        {/* CARD 2: AAJ KHARCHA */}
        <button 
          onClick={() => navigateTo('workers')}
          className="group p-3.5 rounded-2xl bg-slate-900/40 border border-rose-500/10 hover:border-rose-500/30 transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.02)] active:scale-95 text-left focus:outline-none"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[9px] font-black tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md uppercase">AAJ KHARCHA</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-lg font-black tracking-tight text-slate-100 group-hover:text-white transition-colors">
              Rs. {todayExpense.toLocaleString('en-IN')}
            </span>
            <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider mt-0.5">KARIGAR PAYOUTS: {workersCount}</p>
          </div>
        </button>

        {/* CARD 3: MAHANA AAYA */}
        <button 
          onClick={() => navigateTo('clients')}
          className="group p-3.5 rounded-2xl bg-slate-900/40 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.02)] active:scale-95 text-left focus:outline-none"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[9px] font-black tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md uppercase">MAHANA AAYA</span>
            <Briefcase className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-lg font-black tracking-tight text-slate-100 group-hover:text-white transition-colors">
              Rs. {monthlyRevenue.toLocaleString('en-IN')}
            </span>
            <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider mt-0.5">KUL MAHANA AAMDANI</p>
          </div>
        </button>

        {/* CARD 4: SAAF MUNAFA */}
        <button 
          onClick={() => navigateTo('aur')}
          className="group p-3.5 rounded-2xl bg-slate-900/40 border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.02)] active:scale-95 text-left focus:outline-none"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[9px] font-black tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md uppercase">SAAF MUNAFA</span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-6 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-lg font-black tracking-tight text-slate-100 group-hover:text-white transition-colors">
              Rs. {netProfit.toLocaleString('en-IN')}
            </span>
            <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider mt-0.5">NET ANALYTICS LEDGER</p>
          </div>
        </button>
      </div>

      {/* 🚨 DELIVERY PROXIMITY TIMELINE ALERTS */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
        <h3 className="text-[9px] font-black tracking-[0.15em] text-slate-400 uppercase mb-3 flex items-center gap-1.5 border-b border-white/5 pb-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
          </span>
          DELIVERY TIMELINE RADAR
        </h3>
        
        {proximityAlerts.length === 0 ? (
          <div className="rounded-xl border border-white/[0.02] bg-slate-950/20 p-3 text-center">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">✅ AGLE 5 DIN MEIN KOI URGENT DELIVERY PENDING NAHI HAI</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
            {proximityAlerts.map((order) => (
              <div 
                key={order.id} 
                onClick={() => navigateTo('clients')}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer bg-slate-950/40 active:scale-98 ${
                  order.zone === 'crisis' ? 'border-rose-500/10 hover:border-rose-500/30' : 'border-amber-500/10 hover:border-amber-500/30'
                }`}
              >
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-200">{order.name}</span>
                    {order.isUrgent && (
                      <span className="text-[7px] font-black bg-rose-500/10 border border-rose-500/20 text-rose-400 px-1 rounded uppercase tracking-widest animate-pulse">URGENT</span>
                    )}
                  </div>
                  <p className="text-[8px] text-slate-500 font-black uppercase mt-0.5 tracking-wider">
                    {order.suitType || 'SUIT'} • TARGET: {order.deliveryDate}
                  </p>
                </div>
                
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${
                  order.zone === 'crisis' ? 'bg-rose-500/5 text-rose-400 border-rose-500/10' : 'bg-amber-500/5 text-amber-400 border-amber-500/10'
                }`}>
                  {order.remainingDays <= 0 ? `Overdue (${Math.abs(order.remainingDays)} Days)` : `${order.remainingDays} Days Left`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🏦 LEDGER BALANCE MATRICES */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
        <h3 className="text-[9px] font-black tracking-[0.15em] text-slate-400 uppercase mb-3 flex items-center gap-1.5 border-b border-white/5 pb-2">
          <Layers className="w-3.5 h-3.5 text-yellow-500" /> LEDGER BALANCE MATRICES
        </h3>
        
        <div className="space-y-1.5">
          {/* Row 1 */}
          <div onClick={() => navigateTo('clients')} className="group flex items-center justify-between p-2 cursor-pointer hover:bg-white/5 rounded-xl transition-all">
            <div className="flex items-center gap-2 pr-2">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-black tracking-wide text-slate-300 uppercase">CLIENTS SE LENA HAI (UDHAAR)</span>
            </div>
            <span className="text-xs font-black text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded-lg border border-amber-500/10">
              Rs. {totalClientUdhaar.toLocaleString('en-IN')}
            </span>
          </div>
          
          {/* Row 2 */}
          <div onClick={() => navigateTo('workers')} className="group flex items-center justify-between p-2 cursor-pointer hover:bg-white/5 rounded-xl transition-all">
            <div className="flex items-center gap-2 pr-2">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-xs font-black tracking-wide text-slate-300 uppercase">KARIGARON KA BAQI (PAYABLE)</span>
            </div>
            <span className="text-xs font-black text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded-lg border border-rose-500/10">
              Rs. {totalWorkerPayable.toLocaleString('en-IN')}
            </span>
          </div>
          
          {/* Row 3 */}
          <div onClick={() => navigateTo('ws')} className="group flex items-center justify-between p-2 cursor-pointer hover:bg-white/5 rounded-xl transition-all">
            <div className="flex items-center gap-2 pr-2">
              <Store className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-black tracking-wide text-slate-300 uppercase">WHOLESALERS KA DENA HAI</span>
            </div>
            <span className="text-xs font-black text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded-lg border border-blue-500/10">
              Rs. {totalWholesalerBalance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
