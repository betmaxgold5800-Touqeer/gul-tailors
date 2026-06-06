import React, { useState, useEffect } from 'react'
import { Wallet, ShieldCheck, ArrowUpRight, ArrowDownRight, Users, Briefcase, ShoppingBag, MapPin, Phone, User } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    aajAaya: 0,
    aajKharcha: 0,
    mahanaAaya: 0,
    mahanaKharcha: 0,
    clientBaqi: 0,
    wsBaqi: 0,
    workerBaqi: 0,
    netProfit: 0,
    totalClients: 0,
    totalWorkers: 0,
    totalWS: 0
  })

  useEffect(() => {
    // Senior Pipeline Syncing with local database matrices
    const clients = JSON.parse(localStorage.getItem('gt_clients') || '[]')
    const ctxns = JSON.parse(localStorage.getItem('gt_ctxns') || '[]')
    const workers = JSON.parse(localStorage.getItem('gt_workers') || '[]')
    const wentries = JSON.parse(localStorage.getItem('gt_wentries') || '[]')
    const wholesalers = JSON.parse(localStorage.getItem('gt_wholesalers') || '[]')
    const wstxns = JSON.parse(localStorage.getItem('gt_ws_txns') || '[]')

    const todayStr = new Date().toISOString().split('T')[0]
    const currentMonth = todayStr.substring(0, 7) // YYYY-MM

    // Calculates Client Cashflows
    let aajIn = 0, mahanaIn = 0, totalClientBaqi = 0
    ctxns.forEach(t => {
      if (t.date === todayStr) aajIn += Number(t.amount || 0)
      if (t.date.startsWith(currentMonth)) mahanaIn += Number(t.amount || 0)
    })
    clients.forEach(c => {
      totalClientBaqi += Number(c.baqi || 0)
    })

    // Calculates Worker Cashflows
    let aajOutWorkers = 0, mahanaOutWorkers = 0, totalWorkerBaqi = 0
    wentries.forEach(w => {
      const amt = Number(w.rate || 0) * Number(w.suitQty || 0)
      if (w.date === todayStr && w.status === 'Paid') aajOutWorkers += amt
      if (w.date.startsWith(currentMonth) && w.status === 'Paid') mahanaOutWorkers += amt
    })
    workers.forEach(w => {
      totalWorkerBaqi += Number(w.khata || 0)
    })

    // Calculates Wholesaler Cashflows
    let aajOutWS = 0, mahanaOutWS = 0, totalWsBaqi = 0
    wstxns.forEach(w => {
      if (w.date === todayStr && w.type === 'Paid') aajOutWS += Number(w.amount || 0)
      if (w.date.startsWith(currentMonth) && w.type === 'Paid') mahanaOutWS += Number(w.amount || 0)
    })
    wholesalers.forEach(ws => {
      totalWsBaqi += Number(ws.khata || 0)
    })

    const totalAajKharcha = aajOutWorkers + aajOutWS
    const totalMahanaKharcha = mahanaOutWorkers + mahanaOutWS
    const netProfit = mahanaIn - totalMahanaKharcha

    setStats({
      aajAaya: aajIn,
      aajKharcha: totalAajKharcha,
      mahanaAaya: mahanaIn,
      mahanaKharcha: totalMahanaKharcha,
      clientBaqi: totalClientBaqi,
      wsBaqi: totalWsBaqi,
      workerBaqi: totalWorkerBaqi,
      netProfit: netProfit,
      totalClients: clients.length,
      totalWorkers: workers.length,
      totalWS: wholesalers.length
    })
  }, [])

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      
      {/* 1. Royal Identity Luxury Badge */}
      <div className="relative overflow-hidden bg-[#1a1006] text-[#e8b84b] rounded-2xl p-5 shadow-xl border border-[#e2cfa0]/20">
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#e8b84b]/5 rounded-full blur-xl"></div>
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-[#e8b84b]/10 p-3 rounded-full border border-[#e8b84b]/20">
            <span className="text-3xl">✂️</span>
          </div>
          <h2 className="text-2xl font-serif font-black tracking-widest uppercase">Gul Tailors</h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#e8b84b] to-transparent"></div>
          <p className="text-[10px] uppercase tracking-widest text-[#e8b84b]/70 font-medium">Premium Digital Vault</p>
        </div>
      </div>

      {/* 2. Professional Cashflow Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        
        {/* Aaj Ka Aaya */}
        <div className="bg-[#fffdf7] border-l-4 border-emerald-600 rounded-xl p-3.5 shadow-sm space-y-1 border border-t-black/5 border-b-black/5 border-r-black/5">
          <div className="flex items-center justify-between text-black/40">
            <span className="text-[10px] font-bold uppercase tracking-wider">Aaj Aaya</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-base font-bold text-slate-800">Rs.{stats.aajAaya}</div>
          <p className="text-[9px] text-black/40">Halia client payments</p>
        </div>

        {/* Aaj Ka Kharcha */}
        <div className="bg-[#fffdf7] border-l-4 border-rose-600 rounded-xl p-3.5 shadow-sm space-y-1 border border-t-black/5 border-b-black/5 border-r-black/5">
          <div className="flex items-center justify-between text-black/40">
            <span className="text-[10px] font-bold uppercase tracking-wider">Aaj Kharcha</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-base font-bold text-slate-800">Rs.{stats.aajKharcha}</div>
          <p className="text-[9px] text-black/40">Karigar + Wholesaler paid</p>
        </div>

        {/* Mahana Aaya */}
        <div className="bg-[#fffdf7] border-l-4 border-amber-500 rounded-xl p-3.5 shadow-sm space-y-1 border border-t-black/5 border-b-black/5 border-r-black/5">
          <div className="flex items-center justify-between text-black/40">
            <span className="text-[10px] font-bold uppercase tracking-wider">Mahana Aaya</span>
            <Wallet className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-base font-bold text-slate-800">Rs.{stats.mahanaAaya}</div>
          <p className="text-[9px] text-black/40">Is mahine ki kul aamdani</p>
        </div>

        {/* Net Profit Core */}
        <div className={`border-l-4 rounded-xl p-3.5 shadow-sm space-y-1 border border-t-black/5 border-b-black/5 border-r-black/5 ${
          stats.netProfit >= 0 ? 'bg-emerald-50/30 border-emerald-600' : 'bg-rose-50/30 border-rose-600'
        }`}>
          <div className="flex items-center justify-between text-black/40">
            <span className="text-[10px] font-bold uppercase tracking-wider">Saaf Munafa</span>
            <ShieldCheck className={`w-3.5 h-3.5 ${stats.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
          </div>
          <div className={`text-base font-black ${stats.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            Rs.{stats.netProfit}
          </div>
          <p className="text-[9px] text-black/40">Aamdani minus kul kharche</p>
        </div>

      </div>

      {/* 3. Deep Ledger Balances */}
      <div className="bg-[#fffdf7] border border-[#e2cfa0]/60 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-[11px] font-bold text-[#9a7c44] uppercase tracking-widest border-b border-[#e2cfa0]/30 pb-2 flex items-center gap-1.5">
          📊 Ledger Balance Matrices
        </h3>
        
        <div className="space-y-2.5">
          {/* Clients Remaining */}
          <div className="flex items-center justify-between bg-white border border-black/5 rounded-xl p-2.5">
            <span className="text-xs text-black/70 font-medium">Clients Se Lena Hai (Udhaar):</span>
            <span className="text-xs font-bold text-amber-600">Rs.{stats.clientBaqi}</span>
          </div>

          {/* Workers Balance */}
          <div className="flex items-center justify-between bg-white border border-black/5 rounded-xl p-2.5">
            <span className="text-xs text-black/70 font-medium">Karigaron Ka Baqi (Payable):</span>
            <span className="text-xs font-bold text-rose-600">Rs.{stats.workerBaqi}</span>
          </div>

          {/* Wholesalers Balance */}
          <div className="flex items-center justify-between bg-white border border-black/5 rounded-xl p-2.5">
            <span className="text-xs text-black/70 font-medium">Wholesalers Ka Dena Hai:</span>
            <span className="text-xs font-bold text-slate-700">Rs.{stats.wsBaqi}</span>
          </div>
        </div>
      </div>

      {/* 4. Registry Metrics Quick Info */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-white/60 border border-black/5 rounded-xl p-2">
          <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1"><Users className="w-3 h-3 text-[#c9952a]" /> {stats.totalClients}</div>
          <div className="text-[9px] text-black/40 mt-0.5">Total Clients</div>
        </div>
        <div className="bg-white/60 border border-black/5 rounded-xl p-2">
          <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1"><Briefcase className="w-3 h-3 text-[#c9952a]" /> {stats.totalWorkers}</div>
          <div className="text-[9px] text-black/40 mt-0.5">Total Workers</div>
        </div>
        <div className="bg-white/60 border border-black/5 rounded-xl p-2">
          <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1"><ShoppingBag className="w-3 h-3 text-[#c9952a]" /> {stats.totalWS}</div>
          <div className="text-[9px] text-black/40 mt-0.5">Wholesalers</div>
        </div>
      </div>

      {/* 5. Official Business Branding & Contact Card */}
      <div className="bg-[#1a1006] text-white/90 rounded-2xl p-4 border border-[#e2cfa0]/20 space-y-3 shadow-lg">
        <h4 className="text-[10px] font-bold text-[#e8b84b] uppercase tracking-widest border-b border-white/10 pb-1.5 flex items-center gap-1">
          📍 Official Atelier Showroom
        </h4>
        
        <div className="space-y-2.5 text-[11px] font-sans">
          {/* Honor Details */}
          <div className="flex items-start gap-2.5">
            <User className="w-3.5 h-3.5 text-[#e8b84b] shrink-0 mt-0.5" />
            <div>
              <span className="text-white/40 block text-[9px] uppercase tracking-wider">Owner / Master</span>
              <span className="font-serif font-bold text-[#e8b84b] text-xs">Waseem Gul Baghoor</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex items-start gap-2.5">
            <Phone className="w-3.5 h-3.5 text-[#e8b84b] shrink-0 mt-0.5" />
            <div>
              <span className="text-white/40 block text-[9px] uppercase tracking-wider">WhatsApp Helpline</span>
              <span className="font-mono font-semibold tracking-wider">03007614329</span>
            </div>
          </div>

          {/* Location Address Details */}
          <div className="flex items-start gap-2.5">
            <MapPin className="w-3.5 h-3.5 text-[#e8b84b] shrink-0 mt-0.5" />
            <div>
              <span className="text-white/40 block text-[9px] uppercase tracking-wider">Showroom Address</span>
              <p className="text-white/70 leading-relaxed font-medium">
                Main Bazar Adhi Kot, Syed Market (Al-Maroof Tailors Market), Left Side, Last Shop.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
