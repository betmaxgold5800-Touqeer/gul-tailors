import React from 'react';

export default function MoreSection({ navigateTo }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-sm font-black tracking-widest text-[#8a6d3b] uppercase mb-1">
        ✨ BUSINESS CONTROLS & METRICS
      </h3>

      {/* KPI Stats Analytics row */}
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

      {/* Actionable Senior Dev Controls */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-md space-y-3">
        <button className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50/50 hover:bg-amber-50 border border-amber-100 transition-colors text-left">
          <div className="flex items-center gap-3">
            <span className="text-xl">💰</span>
            <div>
              <span className="text-sm font-black text-gray-800 block">Stitching Rate List</span>
              <span className="text-xs text-gray-500">Shalwar Kameez, Pent Shirt pricing matrix</span>
            </div>
          </div>
          <span className="text-gray-400">⚙️</span>
        </button>

        <button className="w-full flex items-center justify-between p-3 rounded-xl bg-cyan-50/50 hover:bg-cyan-50 border border-cyan-100 transition-colors text-left">
          <div className="flex items-center gap-3">
            <span className="text-xl">🧵</span>
            <div>
              <span className="text-sm font-black text-gray-800 block">Karigar Commissions</span>
              <span className="text-xs text-gray-500">Manage rates per piece for master tailors</span>
            </div>
          </div>
          <span className="text-gray-400">⚙️</span>
        </button>

        <button className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-50/50 hover:bg-purple-50 border border-purple-100 transition-colors text-left">
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <div>
              <span className="text-sm font-black text-gray-800 block">Expense Registry</span>
              <span className="text-xs text-gray-500">Thread, buttons, utility bill logs</span>
            </div>
          </div>
          <span className="text-gray-400">➕</span>
        </button>
      </div>

      {/* System info */}
      <div className="text-center py-2">
        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          Gul Tailors Engine v2.1.0 • Connected to Firebase
        </span>
      </div>
    </div>
  );
}
