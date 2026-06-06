import React, { useState, useEffect } from 'react'
import { Plus, UserPlus, Calculator, CheckCircle, Trash2, ShieldAlert, History } from 'lucide-react'

export default function Workers() {
  const [workers, setWorkers] = useState([])
  const [entries, setEntries] = useState([])
  const [showAddWorker, setShowAddWorker] = useState(false)
  const [showAddEntry, setShowAddEntry] = useState(false)
  
  // Form States Matrix
  const [workerName, setWorkerName] = useState('')
  const [entryData, setEntryData] = useState({
    workerId: '', suitQty: '', rate: '', status: 'Pending', note: ''
  })

  useEffect(() => {
    const savedWorkers = localStorage.getItem('gt_workers')
    const savedEntries = localStorage.getItem('gt_wentries')
    if (savedWorkers) setWorkers(JSON.parse(savedWorkers))
    if (savedEntries) setEntries(JSON.parse(savedEntries))
  }, [])

  const handleAddWorker = (e) => {
    e.preventDefault()
    if (!workerName) return

    const newWorkers = [...workers, { id: Date.now().toString(), name: workerName, khata: 0 }]
    setWorkers(newWorkers)
    localStorage.setItem('gt_workers', JSON.stringify(newWorkers))
    setWorkerName('')
    setShowAddWorker(false)
  }

  const handleAddEntry = (e) => {
    e.preventDefault()
    const { workerId, suitQty, rate, status } = entryData
    if (!workerId || !suitQty || !rate) return alert("Saari fields lazmi hain!")

    const amt = Number(suitQty) * Number(rate)
    const newEntry = {
      ...entryData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount: amt
    }

    const updatedEntries = [newEntry, ...entries]
    setEntries(updatedEntries)
    localStorage.setItem('gt_wentries', JSON.stringify(updatedEntries))

    // Re-calculate individual artisan khata balance matrix
    const updatedWorkers = workers.map(w => {
      if (w.id === workerId) {
        const currentKhata = Number(w.khata || 0)
        return { ...w, khata: status === 'Pending' ? currentKhata + amt : currentKhata }
      }
      return w
    })
    setWorkers(updatedWorkers)
    localStorage.setItem('gt_workers', JSON.stringify(updatedWorkers))

    // Reset Form
    setEntryData({ workerId: '', suitQty: '', rate: '', status: 'Pending', note: '' })
    setShowAddEntry(false)
  }

  const handleUpdateStatus = (entryId) => {
    const updatedEntries = entries.map(entry => {
      if (entry.id === entryId && entry.status === 'Pending') {
        // Deduct from worker khata when status changes to Paid
        const updatedWorkers = workers.map(w => {
          if (w.id === entry.workerId) {
            return { ...w, khata: Math.max(0, Number(w.khata || 0) - entry.amount) }
          }
          return w
        })
        setWorkers(updatedWorkers)
        localStorage.setItem('gt_workers', JSON.stringify(updatedWorkers))
        return { ...entry, status: 'Paid' }
      }
      return entry
    })
    setEntries(updatedEntries)
    localStorage.setItem('gt_wentries', JSON.stringify(updatedEntries))
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Header Pipeline Section */}
      <div className="flex items-center justify-between border-b border-[#e2cfa0]/30 pb-2">
        <h2 className="text-base font-serif font-bold text-[#1a1006] flex items-center gap-1.5">
          🧵 Karigar Log & Wages
        </h2>
        <div className="flex gap-1.5">
          <button onClick={() => { setShowAddWorker(!showAddWorker); setShowAddEntry(false) }} className="bg-[#fffdf7] border border-[#e2cfa0] text-[#9a7c44] text-[10px] font-bold py-1.5 px-2.5 rounded-xl transition-all">
            + Karigar Add
          </button>
          <button onClick={() => { setShowAddEntry(!showAddEntry); setShowAddWorker(false) }} className="bg-[#1a1006] text-[#e8b84b] text-[10px] font-bold py-1.5 px-2.5 rounded-xl border border-[#e2cfa0]/20 transition-all">
            + Kaam Entry
          </button>
        </div>
      </div>

      {/* 1. Add New Artisan Form */}
      {showAddWorker && (
        <form onSubmit={handleAddWorker} className="bg-[#fffdf7] border border-[#e2cfa0] rounded-2xl p-4 shadow-sm space-y-3 animate-slideDown">
          <h3 className="text-xs font-bold text-[#9a7c44] uppercase tracking-wider flex items-center gap-1"><UserPlus className="w-3.5 h-3.5" /> Naye Karigar Ka Naam</h3>
          <div className="flex gap-2">
            <input type="text" value={workerName} onChange={(e) => setWorkerName(e.target.value)} placeholder="e.g. Aslam Darzi" className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#e8b84b]" required />
            <button type="submit" className="bg-[#1a1006] text-[#e8b84b] text-xs font-bold px-4 rounded-xl shrink-0">Save</button>
          </div>
        </form>
      )}

      {/* 2. Add Suit Work Entry Form */}
      {showAddEntry && (
        <form onSubmit={handleAddEntry} className="bg-[#fffdf7] border border-[#e2cfa0] rounded-2xl p-4 shadow-sm space-y-4 animate-slideDown">
          <h3 className="text-xs font-bold text-[#9a7c44] uppercase tracking-wider flex items-center gap-1"><Calculator className="w-3.5 h-3.5" /> Silai / Kaam Ka Hisab Form</h3>
          
          <div className="grid grid-cols-2 gap-2.5">
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-black/50 block mb-0.5">Karigar Select Karein</label>
              <select value={entryData.workerId} onChange={(e) => setEntryData({...entryData, workerId: e.target.value})} className="w-full bg-white border border-black/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none" required>
                <option value="">-- Karigar Chunien --</option>
                {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-black/50 block mb-0.5">Suits Qty (Tadaad)</label>
              <input type="number" value={entryData.suitQty} onChange={(e) => setEntryData({...entryData, suitQty: e.target.value})} placeholder="e.g. 5" className="w-full bg-white border border-black/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-black/50 block mb-0.5">Per Suit Rate (Silai)</label>
              <input type="number" value={entryData.rate} onChange={(e) => setEntryData({...entryData, rate: e.target.value})} placeholder="e.g. 400" className="w-full bg-white border border-black/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none" required />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-black/50 block mb-0.5">Payment Status</label>
              <select value={entryData.status} onChange={(e) => setEntryData({...entryData, status: e.target.value})} className="w-full bg-white border border-black/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none">
                <option value="Pending">Baqi/Udhaar (Add to Khata)</option>
                <option value="Paid">Usi Waqt Cash De Diya</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#1a1006] text-[#e8b84b] font-bold py-2 rounded-xl text-xs border border-[#e2cfa0]/20 shadow-md">
            Save Wage Entry
          </button>
        </form>
      )}

      {/* 3. Artisan Balances Summary Cards */}
      <div className="bg-[#fffdf7] border border-[#e2cfa0]/60 rounded-2xl p-3.5 shadow-sm space-y-2">
        <h3 className="text-[10px] font-bold text-[#9a7c44] uppercase tracking-widest border-b border-black/5 pb-1.5">
          👥 Current Karigar Khata Summary
        </h3>
        {workers.length === 0 ? (
          <p className="text-[11px] text-black/40 text-center py-2">Koi karigar registered nahi hai.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {workers.map(w => (
              <div key={w.id} className="bg-white border border-black/5 rounded-xl p-2.5 flex items-center justify-between shadow-inner">
                <span className="text-xs font-bold text-slate-700 truncate mr-1">{w.name}</span>
                <span className={`text-xs font-mono font-black shrink-0 ${Number(w.khata) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  Rs.{w.khata || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Recent Wage Ledger Entries Matrix */}
      <div className="bg-white border border-black/5 rounded-2xl p-3.5 shadow-sm space-y-3">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <History className="w-3.5 h-3.5 text-[#9a7c44]" /> Halia Silai Ledger History
        </h3>

        <div className="overflow-hidden rounded-xl border border-black/5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1a1006] text-[#e8b84b] font-serif text-[10px] uppercase tracking-wider">
                <th className="p-2.5 font-normal">Karigar/Tarikh</th>
                <th className="p-2.5 font-normal text-center">Details</th>
                <th className="p-2.5 font-normal text-right">Amount</th>
                <th className="p-2.5 font-normal text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-black/40 text-[11px]">Koi ledger entry nahi mili.</td>
                </tr>
              ) : (
                entries.map((entry, idx) => {
                  const workerObj = workers.find(w => w.id === entry.workerId)
                  return (
                    <tr key={entry.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="p-2.5">
                        <span className="font-bold text-slate-800 block">{workerObj ? workerObj.name : 'Unknown'}</span>
                        <span className="text-[9px] text-black/30 font-mono">{entry.date}</span>
                      </td>
                      <td className="p-2.5 text-center text-slate-600 font-medium">
                        {entry.suitQty} Suits <br />
                        <span className="text-[9px] text-black/40 font-mono">@{entry.rate}</span>
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-700">
                        Rs.{entry.amount}
                      </td>
                      <td className="p-2.5 text-center">
                        {entry.status === 'Pending' ? (
                          <button 
                            type="button" 
                            onClick={() => handleUpdateStatus(entry.id)}
                            className="bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs block mx-auto animate-pulse"
                          >
                            Pay Due
                          </button>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-emerald-100 block w-max mx-auto">
                            Clear
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
