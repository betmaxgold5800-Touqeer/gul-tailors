import React from 'react';

export default function Dashboard({ navigateTo, clientsCount, workersCount, wholesalersCount }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Premium Digital Vault Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2e1f16] to-[#140d09] p-6 text-center shadow-xl border border-[#cca464]/30">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#cca464]/10 blur-xl" />
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#cca464]/10 border border-[#cca464]/40">
          <span className="text-2xl">✂️</span>
        </div>
        <h2 className="text-2xl font-black tracking-widest text-[#eec784]">GUL TAILORS</h2>
        <p className="text-[11px] font-bold tracking-widest text-[#cca464]/70 uppercase mt-1">
          Premium Digital Vault & Ledger
        </p>
      </div>

      {/* Grid of Clickable Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Card 1: Aaj Aaya */}
        <button 
          onClick={() => navigateTo('clients')}
          className="group flex flex-col justify-between rounded-2xl border-l-4 border-emerald-600 bg-white p-4 text-left shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
        >
          <div className="flex w-full items-center justify-between text-gray-500">
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-gray-600">AAJ AAYA</span>
            <span className="text-emerald-600 font-bold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-700">Rs. 12,500</span>
            <p className="text-[10px] font-medium text-gray-500 mt-1">Click to view active clients ({clientsCount})</p>
          </div>
        </button>

        {/* Card 2: Aaj Kharcha */}
        <button 
          onClick={() => navigateTo('workers')}
          className="group flex flex-col justify-between rounded-2xl border-l-4 border-rose-600 bg-white p-4 text-left shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
        >
          <div className="flex w-full items-center justify-between text-gray-500">
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-gray-600">AAJ KHARCHA</span>
            <span className="text-rose-600 font-bold">↘</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-rose-700">Rs. 3,200</span>
            <p className="text-[10px] font-medium text-gray-500 mt-1">Click to view worker payouts ({workersCount})</p>
          </div>
        </button>

        {/* Card 3: Mahana Aaya */}
        <button 
          onClick={() => navigateTo('clients')}
          className="group flex flex-col justify-between rounded-2xl border-l-4 border-amber-500 bg-white p-4 text-left shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
        >
          <div className="flex w-full items-center justify-between text-gray-500">
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-gray-600">MAHANA AAYA</span>
            <span className="text-amber-500">💼</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#1f1610]">Rs. 185,000</span>
            <p className="text-[10px] font-medium text-gray-500 mt-1">Is mahine ki kul aamdani</p>
          </div>
        </button>

        {/* Card 4: Saaf Munafa */}
        <button 
          onClick={() => navigateTo('aur')}
          className="group flex flex-col justify-between rounded-2xl border-l-4 border-cyan-600 bg-white p-4 text-left shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
        >
          <div className="flex w-full items-center justify-between text-gray-500">
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-gray-600">SAAF MUNAFA</span>
            <span className="text-cyan-600">🛡️</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-cyan-700">Rs. 42,800</span>
            <p className="text-[10px] font-medium text-gray-500 mt-1">Click to view Analytics overview</p>
          </div>
        </button>
      </div>

      {/* Ledger Balance Matrices (Vibrant High Contrast Styling) */}
      <div className="rounded-2xl border border-[#cca464]/30 bg-white p-4 shadow-sm">
        <h3 className="text-xs font-black tracking-widest text-[#8a6d3b] uppercase mb-3 flex items-center gap-1.5">
          📊 LEDGER BALANCE MATRICES
        </h3>
        
        <div className="divide-y divide-gray-100">
          <div onClick={() => navigateTo('clients')} className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-1 transition-colors">
            <span className="text-sm font-bold text-gray-800">Clients Se Lena Hai (Udhaar):</span>
            <span className="text-sm font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Rs. 48,000</span>
          </div>
          
          <div onClick={() => navigateTo('workers')} className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-1 transition-colors">
            <span className="text-sm font-bold text-gray-800">Karigaron Ka Baqi (Payable):</span>
            <span className="text-sm font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded">Rs. 15,500</span>
          </div>
          
          <div onClick={() => navigateTo('ws')} className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-1 transition-colors">
            <span className="text-sm font-bold text-gray-800">Wholesalers Ka Dena Hai:</span>
            <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Rs. 25,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
