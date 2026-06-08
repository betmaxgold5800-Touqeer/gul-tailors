import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Briefcase, 
  ShieldCheck, 
  Layers, 
  Coins, 
  UserX, 
  Store 
} from 'lucide-react';

export default function Dashboard({ navigateTo, clientsCount, workersCount, wholesalersCount }) {
  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      
      {/* 👑 PREMIUM DIGITAL VAULT HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f1610] to-[#120c08] p-6 text-center shadow-2xl border border-[#cca464]/20">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#cca464]/5 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-amber-500/5 blur-2xl" />
        
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#cca464]/20 to-[#cca464]/5 border border-[#cca464]/30 shadow-inner">
          <span className="text-2xl drop-shadow-md">✂️</span>
        </div>
        <h2 className="text-2xl font-serif font-black tracking-[0.2em] text-[#eec784] drop-shadow">GUL TAILORS</h2>
        <p className="text-[9px] font-black tracking-[0.15em] text-[#cca464]/60 uppercase mt-1 bg-[#cca464]/5 inline-block px-3 py-0.5 rounded-full border border-[#cca464]/10">
          PREMIUM DIGITAL VAULT & LEDGER
        </p>
      </div>

      {/* 📊 LUXURY GRID OF CLICKABLE MATRICES */}
      <div className="grid grid-cols-2 gap-3.5">
        
        {/* Card 1: Aaj Aaya */}
        <button 
          onClick={() => navigateTo('clients')}
          className="group relative flex flex-col justify-between rounded-2xl border border-[#cca464]/20 bg-gradient-to-b from-white to-[#fffdf9] p-4 text-left shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[10px] font-black tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">AAJ AAYA</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black tracking-tight text-[#1f1610]">Rs. 12,500</span>
            <p className="text-[9px] font-bold text-gray-500/80 mt-1.5 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Clients: <span className="text-[#1f1610] font-black">({clientsCount})</span>
            </p>
          </div>
        </button>

        {/* Card 2: Aaj Kharcha */}
        <button 
          onClick={() => navigateTo('workers')}
          className="group relative flex flex-col justify-between rounded-2xl border border-[#cca464]/20 bg-gradient-to-b from-white to-[#fffdf9] p-4 text-left shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[10px] font-black tracking-wider uppercase text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">AAJ KHARCHA</span>
            <ArrowDownRight className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black tracking-tight text-[#1f1610]">Rs. 3,200</span>
            <p className="text-[9px] font-bold text-gray-500/80 mt-1.5">
              Worker Payouts: <span className="text-[#1f1610] font-black">({workersCount})</span>
            </p>
          </div>
        </button>

        {/* Card 3: Mahana Aaya */}
        <button 
          onClick={() => navigateTo('clients')}
          className="group relative flex flex-col justify-between rounded-2xl border border-[#cca464]/20 bg-gradient-to-b from-white to-[#fffdf9] p-4 text-left shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[10px] font-black tracking-wider uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">MAHANA AAYA</span>
            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black tracking-tight text-[#1f1610]">Rs. 185,000</span>
            <p className="text-[9px] font-bold text-gray-500/80 mt-1.5">Is mahine ki kul aamdani</p>
          </div>
        </button>

        {/* Card 4: Saaf Munafa */}
        <button 
          onClick={() => navigateTo('aur')}
          className="group relative flex flex-col justify-between rounded-2xl border border-[#cca464]/20 bg-gradient-to-b from-white to-[#fffdf9] p-4 text-left shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[10px] font-black tracking-wider uppercase text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">SAAF MUNAFA</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black tracking-tight text-cyan-900">Rs. 42,800</span>
            <p className="text-[9px] font-bold text-gray-500/80 mt-1.5">View Analytics overview</p>
          </div>
        </button>
      </div>

      {/* 🏦 DEEPLY INTEGRATED LEDGER BALANCE MATRICES */}
      <div className="rounded-2xl border border-[#cca464]/25 bg-gradient-to-b from-white to-[#fffdfc] p-4 shadow-xl">
        <h3 className="text-[10px] font-black tracking-[0.15em] text-[#8a6d3b] uppercase mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Layers className="w-4 h-4 text-[#cca464]" /> LEDGER BALANCE MATRICES
        </h3>
        
        <div className="space-y-2">
          {/* Item 1: Udhaar */}
          <div 
            onClick={() => navigateTo('clients')} 
            className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-[#fdf9f2] rounded-xl border border-transparent hover:border-[#cca464]/20 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-black text-gray-700 group-hover:text-amber-900 transition-colors">Clients Se Lena Hai (Udhaar):</span>
            </div>
            <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200/50 px-2.5 py-1 rounded-lg shadow-sm">
              Rs. 48,000
            </span>
          </div>
          
          {/* Item 2: Karigar Payable */}
          <div 
            onClick={() => navigateTo('workers')} 
            className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-[#fff5f5] rounded-xl border border-transparent hover:border-rose-200 transition-all group"
          >
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-black text-gray-700 group-hover:text-rose-900 transition-colors">Karigaron Ka Baqi (Payable):</span>
            </div>
            <span className="text-xs font-black text-rose-700 bg-rose-50 border border-rose-200/50 px-2.5 py-1 rounded-lg shadow-sm">
              Rs. 15,500
            </span>
          </div>
          
          {/* Item 3: Wholesalers */}
          <div 
            onClick={() => navigateTo('ws')} 
            className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-[#f0f7ff] rounded-xl border border-transparent hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-black text-gray-700 group-hover:text-blue-900 transition-colors">Wholesalers Ka Dena Hai:</span>
            </div>
            <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200/50 px-2.5 py-1 rounded-lg shadow-sm">
              Rs. 25,000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
