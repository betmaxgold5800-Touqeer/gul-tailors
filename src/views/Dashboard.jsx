import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Briefcase, 
  ShieldCheck, 
  Layers, 
  Coins, 
  Store,
  CloudSun,
  Thermometer,
  Wind
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

  // ⏰ NEON CLOCK STATE ENGINE (PKT)
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
    <div className="space-y-6 animate-fadeIn pb-6 selection:bg-amber-500/30">
      
      {/* 👑 PREMIUM NEON HERO DISPLAY BANNER (BALANCED DUAL-WIDGET EDITION) */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0b1329] to-[#020617] text-center overflow-hidden border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent)]" />
        
        {/* =========================================================
            HEADER GRID PANEL: CLOCK (LEFT) & WEATHER (RIGHT)
           ========================================================= */}
        <div className="w-full flex items-center justify-between relative z-10 mb-2">
          
          {/* ⚡ LEFT SIDE: DIGITAL CLOCK (NEON EMERALD INTERFACE) */}
          <div className="flex items-center gap-2 p-2 px-3 rounded-2xl bg-black/40 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="text-left">
              <p className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 tracking-tight leading-none">
                {currentTime}
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                {currentDate} • PKT
              </p>
            </div>
          </div>

          {/* 🌤️ RIGHT SIDE: ADHI KOT WEATHER WIDGET */}
          <div className="flex items-center gap-2 p-2 px-3 rounded-2xl bg-black/40 border border-sky-500/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
            <CloudSun className="w-4 h-4 text-sky-400 animate-pulse" />
            <div className="text-right">
              <p className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-300 tracking-tight leading-none">
                34°C
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Adhi Kot
              </p>
            </div>
          </div>

        </div>

        {/* =========================================================
            PROACTIVE BRANDING AREA: SYMMETRICAL DOUBLE BRANDING
           ========================================================= */}
        <div className="flex items-center justify-center gap-5 mx-auto mb-5 max-w-sm mt-6 relative">
          
          {/* Logo 1: Core Gold Scissor Identity */}
          <div className="h-16 w-16 rounded-2xl bg-slate-950 border border-white/10 p-1 shadow-[0_0_25px_rgba(234,179,8,0.15)] flex-shrink-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-amber-500/5 blur-xl"></div>
            <img 
              src="/logo.png" 
              alt="Gul Tailors Core Emblem" 
              className="h-full w-full object-cover scale-110 rounded-xl relative z-10"
            />
          </div>

          {/* Symmetrical High-Tech Modular Joint Barrier Vector */}
          <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-white/15 to-transparent flex-shrink-0" />

          {/* Logo 2: Master Profile Custom Visual */}
          <div className="h-16 w-16 rounded-2xl bg-slate-950 border border-white/10 p-1 shadow-[0_0_25px_rgba(59,130,246,0.15)] flex-shrink-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-500/5 blur-xl"></div>
            <img 
              src="/waseem.png" 
              alt="Waseem Signature Profile" 
              className="h-full w-full object-cover scale-110 rounded-xl relative z-10"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden h-full w-full items-center justify-center text-xs bg-blue-500/10 text-blue-400 font-black relative z-10">WGM</div>
          </div>

        </div>

        <h2 className="text-xl font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 uppercase leading-tight">
          GUL TAILORS
        </h2>
        <p className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase mt-2.5 bg-white/5 inline-block px-3.5 py-1 rounded-full border border-white/10">
          PREMIUM DIGITAL VAULT & LEDGER
        </p>
      </div>

      {/* 📊 REAL-TIME FINANCIAL SUMMARY GRID */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Card 1: Aaj Aaya */}
        <button 
          onClick={() => navigateTo('clients')}
          className="group p-4 rounded-3xl bg-slate-900/40 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] active:scale-95 text-left focus:outline-none"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[9px] font-black tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 uppercase">AAJ AAYA</span>
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
            <span className="text-[9px] font-black tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20 uppercase">AAJ KHARCHA</span>
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
            <span className="text-[9px] font-black tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 uppercase">MAHANA AAYA</span>
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
            <span className="text-[9px] font-black tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 uppercase">SAAF MUNAFA</span>
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

      {/* 🚨 TIMELINE RADAR: DELIVERY PROXIMITY ALERTS */}
      <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
        <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          DELIVERY PROXIMITY TIMELINE ALERTS
        </h3>
        
        {proximityAlerts.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.04] bg-slate-950/20 p-4 text-center">
            <p className="text-xs text-slate-500 font-medium">✅ Agle 5 din mein koi urgent delivery pending nahi hai.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {proximityAlerts.map((order) => (
              <div 
                key={order.id} 
                onClick={() => navigateTo('clients')}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer bg-slate-950/40 active:scale-98 ${
                  order.zone === 'crisis' 
                    ? 'border-rose-500/20 hover:border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.02)]' 
                    : 'border-amber-500/20 hover:border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.02)]'
                }`}
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-200">{order.name}</span>
                    {order.isUrgent && (
                      <span className="text-[7px] font-black tracking-widest bg-rose-500/10 border border-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded-md uppercase animate-pulse">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    {order.suitType || 'Suit'} • <span className="text-slate-500">Target: {order.deliveryDate}</span>
                  </p>
                </div>
                
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-xl uppercase tracking-wider border flex-shrink-0 ${
                  order.zone === 'crisis'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.05)]'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]'
                }`}>
                  {order.remainingDays <= 0 
                    ? `Overdue (${Math.abs(order.remainingDays)} Days)` 
                    : `${order.remainingDays} Days Left`
                  }
                </span>
              </div>
            ))}
          </div>
        )}
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
            <div className="flex items-center gap-2.5 pr-2">
              <Coins className="w-4 h-4 text-amber-500 group-hover:scale-110 flex-shrink-0 transition-transform" />
              <span className="text-xs font-bold text-slate-300 group-hover:text-slate-200 transition-colors">Clients Se Lena Hai (Udhaar)</span>
            </div>
            <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)] flex-shrink-0">
              Rs. {totalClientUdhaar.toLocaleString('en-IN')}
            </span>
          </div>
          
          {/* Row 2: Worker Payable */}
          <div 
            onClick={() => navigateTo('workers')} 
            className="group flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5"
          >
            <div className="flex items-center gap-2.5 pr-2">
              <ShieldCheck className="w-4 h-4 text-rose-500 group-hover:scale-110 flex-shrink-0 transition-transform" />
              <span className="text-xs font-bold text-slate-300 group-hover:text-slate-200 transition-colors">Karigaron Ka Baqi (Payable)</span>
            </div>
            <span className="text-xs font-black text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.05)] flex-shrink-0">
              Rs. {totalWorkerPayable.toLocaleString('en-IN')}
            </span>
          </div>
          
          {/* Row 3: Wholesaler Balance */}
          <div 
            onClick={() => navigateTo('ws')} 
            className="group flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5"
          >
            <div className="flex items-center gap-2.5 pr-2">
              <Store className="w-4 h-4 text-blue-500 group-hover:scale-110 flex-shrink-0 transition-transform" />
              <span className="text-xs font-bold text-slate-300 group-hover:text-slate-200 transition-colors">Wholesalers Ka Dena Hai</span>
            </div>
            <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.05)] flex-shrink-0">
              Rs. {totalWholesalerBalance.toLocaleString('en-IN')}
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
