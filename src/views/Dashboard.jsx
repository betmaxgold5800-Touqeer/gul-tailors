import React from 'react'
import { useApp } from '../context/AppContext'
import { TrendingUp, Users, Briefcase, Scissors } from 'lucide-react'

export default function Dashboard() {
  const { clients, workers, getClientBalance, transactions } = useApp()

  // --- Senior Architecture Matrix Logic ---
  
  // 1. Total Receivables (Clients se kul kitna udhaar lena hai)
  const totalReceivables = clients.reduce((acc, c) => {
    const bal = getClientBalance(c.id)
    return bal < 0 ? acc + Math.abs(bal) : acc
  }, 0)

  // 2. Active Orders Dummy Stats (Jab orders feature dalay ga, yeh dynamic ho jaye ga)
  const activeOrdersCount = 0 

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Welcome Greetings Banner */}
      <div className="bg-[#1a1006] text-[#fdf6e9] p-5 rounded-2xl border border-[#e2cfa0]/20 shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-white/5 opacity-10 pointer-events-none">
          <Scissors className="w-32 h-32 rotate-45" />
        </div>
        <p className="text-xs text-[#e8b84b] uppercase font-semibold tracking-wider">Khush Amdeed</p>
        <h2 className="text-xl font-serif font-bold mt-1">Gul Tailors Portal</h2>
        <p className="text-xs text-white/60 mt-1">Dukaan ka khata aur karobar aaj ka summary.</p>
      </div>

      {/* Premium Analytics Grid Matrix */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Card 1: Total Receivables */}
        <div className="bg-[#fffdf7] border border-[#e2cfa0]/60 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center text-[#9a7c44]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Kul Udhaar (Lena)</span>
            <TrendingUp className="w-4 h-4 text-[#c9952a]" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1a1006] mt-2">
            Rs. {totalReceivables.toLocaleString('en-PK')}
          </h3>
          <p className="text-[9px] text-[#9a7c44]/80 mt-1">Clients ke baqi joray</p>
        </div>

        {/* Card 2: Active Clients Count */}
        <div className="bg-[#fffdf7] border border-[#e2cfa0]/60 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center text-[#9a7c44]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Clients</span>
            <Users className="w-4 h-4 text-[#c9952a]" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1a1006] mt-2">
            {clients.length}
          </h3>
          <p className="text-[9px] text-[#9a7c44]/80 mt-1">Khata-daar registereed</p>
        </div>

        {/* Card 3: Total Karigar Workers */}
        <div className="bg-[#fffdf7] border border-[#e2cfa0]/60 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center text-[#9a7c44]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Kul Karigar</span>
            <Briefcase className="w-4 h-4 text-[#c9952a]" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1a1006] mt-2">
            {workers.length}
          </h3>
          <p className="text-[9px] text-[#9a7c44]/80 mt-1">Dukaan ke darzi worker</p>
        </div>

        {/* Card 4: Orders Status */}
        <div className="bg-[#fffdf7] border border-[#e2cfa0]/60 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center text-[#9a7c44]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Chaltay Suits</span>
            <Scissors className="w-4 h-4 text-[#c9952a]" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1a1006] mt-2">
            {activeOrdersCount}
          </h3>
          <p className="text-[9px] text-[#9a7c44]/80 mt-1">Silaye ho rahay hain</p>
        </div>

      </div>

      {/* Quick Links / Recent Activity Placeholder */}
      <div className="bg-white border border-black/5 rounded-2xl p-4 text-center py-8">
        <p className="text-xs text-[#1a1006]/50">Abhi koi haliya activity nahi hai.</p>
        <p className="text-[10px] text-[#9a7c44] mt-1">Jab aap clients aur ledgers add karein ge, activity yahan dikhe gi.</p>
      </div>

    </div>
  )
}
