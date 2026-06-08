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
      
      {/* 👑 PREMIUM DIGITAL VAULT HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 text-center shadow-sm border border-gray-100">
        <div className="absolute right-0 top-0 w-24 h-24 bg-[#b5924b]/5 rounded-bl-full pointer-events-none" />
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#b5924b]/5 border border-[#b5924b]/20">
          <span className="text-2xl">✂️</span>
        </div>
        <h2 className="text-lg font-black tracking-[0.2em] text-gray-900">GUL TAILORS</h2>
        <p className="text-[9px] font-black tracking-[0.15em] text-[#b5924b] uppercase mt-1 bg-[#b5924b]/5 inline-block px-3 py-0.5 rounded-full border border-[#b5924b]/10">
          PREMIUM DIGITAL VAULT & LEDGER
        </p>
      </div>

      {/* 📊 LUXURY GRID OF CLICKABLE MATRICES */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Card 1: Aaj Aaya */}
        <button 
          onClick={() => navigateTo('clients')}
          className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:border-[#b5924b]/40 hover:shadow-md active:scale-95"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[10px] font-black tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">AAJ AAYA</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black tracking-tight text-gray-900">Rs. 12,500</span>
            <p className="text-[10px] text-gray-400 font-bold mt-1">Active Clients: ({clientsCount})</p>
          </div>
        </button>

        {/* Card 2: Aaj Kharcha */}
        <button 
          onClick={() => navigateTo('workers')}
          className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:border-[#b5924b]/40 hover:shadow-md active:scale-95"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[10px] font-black tracking-wider uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">AAJ KHARCHA</span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black tracking-tight text-gray-900">Rs. 3,200</span>
            <p className="text-[10px] text-gray-400 font-bold mt-1">Worker Payouts: ({workersCount})</p>
          </div>
        </button>

        {/* Card 3: Mahana Aaya */}
        <button 
          onClick={() => navigateTo('clients')}
          className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:border-[#b5924b]/40 hover:shadow-md active:scale-95"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[10px] font-black tracking-wider uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">MAHANA AAYA</span>
            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black tracking-tight text-gray-900">Rs. 185,000</span>
            <p className="text-[10px] text-gray-400 font-bold mt-1">Is mahine ki kul aamdani</p>
          </div>
        </button>

        {/* Card 4: Saaf Munafa */}
        <button 
          onClick={() => navigateTo('aur')}
          className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:border-[#b5924b]/40 hover:shadow-md active:scale-95"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[10px] font-black tracking-wider uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">SAAF MUNAFA</span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black tracking-tight text-gray-900">Rs. 42,800</span>
            <p className="text-[10px] text-gray-400 font-bold mt-1">View Analytics overview</p>
          </div>
        </button>
      </div>

      {/* 🏦 LEDGER BALANCE MATRICES */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-[11px] font-black tracking-[0.15em] text-[#b5924b] uppercase mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <Layers className="w-4 h-4" /> LEDGER BALANCE MATRICES
        </h3>
        
        <div className="space-y-1">
          <div onClick={() => navigateTo('clients')} className="flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-xl transition-all">
            <div className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-gray-700">Clients Se Lena Hai (Udhaar)</span>
            </div>
            <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">Rs. 48,000</span>
          </div>
          
          <div onClick={() => navigateTo('workers')} className="flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-xl transition-all">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-gray-700">Karigaron Ka Baqi (Payable)</span>
            </div>
            <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">Rs. 15,500</span>
          </div>
          
          <div onClick={() => navigateTo('ws')} className="flex items-center justify-between py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-xl transition-all">
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-gray-700">Wholesalers Ka Dena Hai</span>
            </div>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">Rs. 25,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
