import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { UserPlus, Briefcase, Phone, DollarSign, ChevronDown, ChevronUp, History } from 'lucide-react'

export default function Workers() {
  const { workers, setWorkers, workerEntries, setWorkerEntries, getWorkerBalance } = useApp()

  // Local Toggles & Form States
  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedWorker, setExpandedWorker] = useState(null)
  
  // Naye Karigar ki state
  const [newWorker, setNewWorker] = useState({ name: '', phone: '', rate: '' })

  // Karigar Ledger ki entry state
  const [entryAmount, setEntryAmount] = useState('')
  const [entryType, setEntryType] = useState('credit') // credit = Kaam kiya (In), debit = Advance uthaya (Out)
  const [entryDesc, setEntryDesc] = useState('')

  // 1. Worker Registration Handler
  const handleAddWorker = (e) => {
    e.preventDefault()
    if (!newWorker.name.trim()) return

    const workerObj = {
      id: 'w_' + Date.now(),
      name: newWorker.name,
      phone: newWorker.phone || 'N/A',
      rate: Number(newWorker.rate) || 0
    }

    setWorkers([workerObj, ...workers])
    setShowAddForm(false)
    setNewWorker({ name: '', phone: '', rate: '' })
  }

  // 2. Worker Ledger Entry Handler
  const handleAddWorkerEntry = (workerId) => {
    if (!entryAmount || Number(entryAmount) <= 0) return

    const entryObj = {
      id: 'we_' + Date.now(),
      wid: workerId,
      amount: Number(entryAmount),
      type: entryType,
      desc: entryDesc || (entryType === 'credit' ? 'Suit Silaye Kaam' : 'Advance Payment'),
      date: new Date().toLocaleDateString('en-PK')
    }

    setWorkerEntries([entryObj, ...workerEntries])
    setEntryAmount('')
    setEntryDesc('')
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Header Pad */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-serif font-bold text-[#1a1006]">Karigar Grid</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#1a1006] text-[#e8b84b] text-xs px-3 py-2 rounded-xl border border-[#e2cfa0]/30 flex items-center gap-1 font-medium"
        >
          <UserPlus className="w-3.5 h-3.5" />
          {showAddForm ? 'Band Karein' : 'Naya Karigar'}
        </button>
      </div>

      {/* Add Worker Inline Form */}
      {showAddForm && (
        <form onSubmit={handleAddWorker} className="bg-white border border-[#e2cfa0] rounded-xl p-4 space-y-3 shadow-inner">
          <h3 className="text-xs font-bold text-[#9a7c44] uppercase tracking-wider border-b border-black/5 pb-1">Karigar Profile</h3>
          <div className="grid grid-cols-3 gap-2">
            <input 
              type="text" placeholder="Karigar Name" required value={newWorker.name}
              onChange={e => setNewWorker({...newWorker, name: e.target.value})}
              className="border border-black/10 rounded-lg p-2 text-xs bg-[#fffdf7] col-span-1 focus:outline-[#c9952a]"
            />
            <input 
              type="tel" placeholder="Mobile No" value={newWorker.phone}
              onChange={e => setNewWorker({...newWorker, phone: e.target.value})}
              className="border border-black/10 rounded-lg p-2 text-xs bg-[#fffdf7] col-span-1 focus:outline-[#c9952a]"
            />
            <input 
              type="number" placeholder="Stitch Rate" value={newWorker.rate}
              onChange={e => setNewWorker({...newWorker, rate: e.target.value})}
              className="border border-black/10 rounded-lg p-2 text-xs bg-[#fffdf7] col-span-1 focus:outline-[#c9952a]"
            />
          </div>
          <button type="submit" className="w-full bg-[#c9952a] text-white text-xs font-bold py-2 rounded-lg shadow-md">
            Register Karigar
          </button>
        </form>
      )}

      {/* Workers Stack List */}
      <div className="space-y-2">
        {workers.length === 0 ? (
          <p className="text-center text-xs text-black/40 py-6">Abhi koi Karigar register nahi hai.</p>
        ) : (
          workers.map((worker) => {
            const balance = getWorkerBalance(worker.id)
            const isExpanded = expandedWorker === worker.id
            const history = workerEntries.filter(e => e.wid === worker.id)

            return (
              <div key={worker.id} className="bg-[#fffdf7] border border-black/5 rounded-xl shadow-sm overflow-hidden">
                
                {/* Accordion Trigger Header */}
                <div 
                  onClick={() => setExpandedWorker(isExpanded ? null : worker.id)}
                  className="p-3 flex justify-between items-center cursor-pointer hover:bg-black/[0.01]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#1a1006]/5 rounded-full flex items-center justify-center text-xs font-bold text-[#9a7c44]">
                      {worker.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1a1006]">{worker.name}</h4>
                      <p className="text-[9px] text-black/40 flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" /> {worker.phone} | Rate: Rs.{worker.rate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-serif font-bold px-2 py-0.5 rounded ${
                      balance > 0 ? 'bg-green-50 text-green-600' : balance < 0 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {balance === 0 ? 'Clear' : balance > 0 ? `Rs. ${balance} (Dena)` : `Rs. ${Math.abs(balance)} (Advance)`}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-black/40" /> : <ChevronDown className="w-3.5 h-3.5 text-black/40" />}
                  </div>
                </div>

                {/* Expansion Panel Content */}
                {isExpanded && (
                  <div className="border-t border-black/5 bg-white p-3 space-y-4 animate-slideDown">
                    
                    {/* Add Ledger Work/Advance */}
                    <div>
                      <h5 className="text-[10px] font-bold text-[#9a7c44] uppercase tracking-wider flex items-center gap-1 mb-2">
                        <DollarSign className="w-3 h-3" /> Ledger Entry Add Karein
                      </h5>
                      <div className="flex gap-1.5">
                        <select 
                          value={entryType} onChange={e => setEntryType(e.target.value)}
                          className="border border-black/10 rounded-lg text-[11px] p-1.5 bg-[#fffdf7]"
                        >
                          <option value="credit">Kaam Kiya (+)</option>
                          <option value="debit">Advance Dia (-)</option>
                        </select>
                        <input 
                          type="number" placeholder="Raqam" value={entryAmount}
                          onChange={e => setEntryAmount(e.target.value)}
                          className="border border-black/10 rounded-lg p-1.5 text-xs w-20 focus:outline-[#c9952a]"
                        />
                        <input 
                          type="text" placeholder="Tafseel" value={entryDesc}
                          onChange={e => setEntryDesc(e.target.value)}
                          className="border border-black/10 rounded-lg p-1.5 text-xs flex-1 focus:outline-[#c9952a]"
                        />
                        <button 
                          type="button" onClick={() => handleAddWorkerEntry(worker.id)}
                          className="bg-[#1a1006] text-[#e8b84b] text-[11px] px-3 rounded-lg font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    {/* Mini History Log */}
                    <div className="pt-2 border-t border-black/5">
                      <h5 className="text-[10px] font-bold text-[#9a7c44] uppercase tracking-wider flex items-center gap-1 mb-1.5">
                        <History className="w-3 h-3" /> Haliya History Logs
                      </h5>
                      <div className="max-h-24 overflow-y-auto space-y-1 text-[10px]">
                        {history.length === 0 ? (
                          <p className="text-black/30 italic text-center py-2">Haliya koi transactions nahi hain.</p>
                        ) : (
                          history.slice(0, 5).map((h) => (
                            <div key={h.id} className="flex justify-between items-center bg-gray-50/60 p-1.5 rounded border border-black/[0.02]">
                              <span className="text-black/50">{h.date}</span>
                              <span className="font-medium text-black/70 flex-1 px-3 truncate">{h.desc}</span>
                              <span className={h.type === 'credit' ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                                {h.type === 'credit' ? '+' : '-'} Rs.{h.amount}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
