import React, { useState, useEffect } from 'react'
import { Plus, Store, CreditCard, CheckCircle, Trash2, History, AlertCircle } from 'lucide-react'

export default function Wholesalers() {
  const [wholesalers, setWholesalers] = useState([])
  const [txns, setTxns] = useState([])
  const [showAddWS, setShowAddWS] = useState(false)
  const [showAddTxn, setShowAddTxn] = useState(false)

  // Form Initial State Matrices
  const [wsName, setWsName] = useState('')
  const [txnData, setTxnData] = useState({
    wsId: '', amount: '', type: 'Due', note: ''
  })

  useEffect(() => {
    const savedWS = localStorage.getItem('gt_wholesalers')
    const savedTxns = localStorage.getItem('gt_ws_txns')
    if (savedWS) setWholesalers(JSON.parse(savedWS))
    if (savedTxns) setTxns(JSON.parse(savedTxns))
  }, [])

  const handleAddWS = (e) => {
    e.preventDefault()
    if (!wsName) return

    const newWS = [...wholesalers, { id: Date.now().toString(), name: wsName, khata: 0 }]
    setWholesalers(newWS)
    localStorage.setItem('gt_wholesalers', JSON.stringify(newWS))
    setWsName('')
    setShowAddWS(false)
  }

  const handleAddTxn = (e) => {
    e.preventDefault()
    const { wsId, amount, type, note } = txnData
    if (!wsId || !amount) return alert("Wholesaler aur Amount lazmi hain!")

    const amt = Number(amount)
    const newTxn = {
      ...txnData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount: amt
    }

    const updatedTxns = [newTxn, ...txns]
    setTxns(updatedTxns)
    localStorage.setItem('gt_ws_txns', JSON.stringify(updatedTxns))

    // Real-time calculation of Wholesaler balance matrix
    const updatedWS = wholesalers.map(ws => {
      if (ws.id === wsId) {
        const currentKhata = Number(ws.khata || 0)
        // Due means we bought material on credit (khata increases), Paid means we paid them (khata decreases)
        return { 
          ...ws, 
          khata: type === 'Due' ? currentKhata + amt : Math.max(0, currentKhata - amt) 
        }
      }
      return ws
    })
    setWholesalers(updatedWS)
    localStorage.setItem('gt_wholesalers', JSON.stringify(updatedWS))

    // Reset Form Matrix
    setTxnData({ wsId: '', amount: '', type: 'Due', note: '' })
    setShowAddTxn(false)
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Top Bar Header Matrix */}
      <div className="flex items-center justify-between border-b border-[#e2cfa0]/30 pb-2">
        <h2 className="text-base font-serif font-bold text-[#1a1006] flex items-center gap-1.5">
          🏢 Wholesalers & Dealers Ledger
        </h2>
        <div className="flex gap-1.5">
          <button onClick={() => { setShowAddWS(!showAddWS); setShowAddTxn(false) }} className="bg-[#fffdf7] border border-[#e2cfa0] text-[#9a7c44] text-[10px] font-bold py-1.5 px-2.5 rounded-xl transition-all">
            + Shop/Seth Add
          </button>
          <button onClick={() => { setShowAddTxn(!showAddTxn); setShowAddWS(false) }} className="bg-[#1a1006] text-[#e8b84b] text-[10px] font-bold py-1.5 px-2.5 rounded-xl border border-[#e2cfa0]/20 transition-all">
            + Transaction
          </button>
        </div>
      </div>

      {/* 1. Add Merchant/Wholesaler Shop Form */}
      {showAddWS && (
        <form onSubmit={handleAddWS} className="bg-[#fffdf7] border border-[#e2cfa0] rounded-2xl p-4 shadow-sm space-y-3 animate-slideDown">
          <h3 className="text-xs font-bold text-[#9a7c44] uppercase tracking-wider flex items-center gap-1"><Store className="w-3.5 h-3.5" /> Naye Wholesaler / Shop Ka Naam</h3>
          <div className="flex gap-2">
            <input type="text" value={wsName} onChange={(e) => setWsName(e.target.value)} placeholder="e.g. Faisalabad Cloth House" className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#e8b84b]" required />
            <button type="submit" className="bg-[#1a1006] text-[#e8b84b] text-xs font-bold px-4 rounded-xl shrink-0">Save</button>
          </div>
        </form>
      )}

      {/* 2. Add Balance Ledger Credit/Debit Form */}
      {showAddTxn && (
        <form onSubmit={handleAddTxn} className="bg-[#fffdf7] border border-[#e2cfa0] rounded-2xl p-4 shadow-sm space-y-4 animate-slideDown">
          <h3 className="text-xs font-bold text-[#9a7c44] uppercase tracking-wider flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Khata / Payment Transaction Form</h3>
          
          <div className="grid grid-cols-2 gap-2.5">
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-black/50 block mb-0.5">Wholesaler Select Chunien</label>
              <select value={txnData.wsId} onChange={(e) => setTxnData({...txnData, wsId: e.target.value})} className="w-full bg-white border border-black/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none" required>
                <option value="">-- Wholesaler Market Selection --</option>
                {wholesalers.map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-black/50 block mb-0.5">Raqam (Amount)</label>
              <input type="number" value={txnData.amount} onChange={(e) => setTxnData({...txnData, amount: e.target.value})} placeholder="e.g. 5000" className="w-full bg-white border border-black/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-black/50 block mb-0.5">Transaction Type</label>
              <select value={txnData.type} onChange={(e) => setTxnData({...txnData, type: e.target.value})} className="w-full bg-white border border-black/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none">
                <option value="Due">Kapra/Maal Liya (Dena Baqi)</option>
                <option value="Paid">Raqam Di (Cash Paid)</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-black/50 block mb-0.5">Note Details (Bill Number / Quality)</label>
              <input type="text" value={txnData.note} onChange={(e) => setTxnData({...txnData, note: e.target.value})} placeholder="e.g. Latha Fabric Bill #402" className="w-full bg-white border border-black/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none" />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#1a1006] text-[#e8b84b] font-bold py-2 rounded-xl text-xs border border-[#e2cfa0]/20 shadow-md">
            Save Ledger Transaction
          </button>
        </form>
      )}

      {/* 3. Merchant Accounts Balance Directory Summary */}
      <div className="bg-[#fffdf7] border border-[#e2cfa0]/60 rounded-2xl p-3.5 shadow-sm space-y-2">
        <h3 className="text-[10px] font-bold text-[#9a7c44] uppercase tracking-widest border-b border-black/5 pb-1.5">
          🏬 Outstanding Wholesaler Net Balances
        </h3>
        {wholesalers.length === 0 ? (
          <p className="text-[11px] text-black/40 text-center py-2">Koi dealers registered nahi hain.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {wholesalers.map(ws => (
              <div key={ws.id} className="bg-white border border-black/5 rounded-xl p-2.5 flex items-center justify-between shadow-inner">
                <span className="text-xs font-bold text-slate-700 truncate mr-1">{ws.name}</span>
                <span className={`text-xs font-mono font-black shrink-0 ${Number(ws.khata) > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  Rs.{ws.khata || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Ledger Historic Matrix Grid Table */}
      <div className="bg-white border border-black/5 rounded-2xl p-3.5 shadow-sm space-y-3">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <History className="w-3.5 h-3.5 text-[#9a7c44]" /> Fabric / Purchase History Audit
        </h3>

        <div className="overflow-hidden rounded-xl border border-black/5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1a1006] text-[#e8b84b] font-serif text-[10px] uppercase tracking-wider">
                <th className="p-2.5 font-normal">Merchant/Tarikh</th>
                <th className="p-2.5 font-normal">Remarks</th>
                <th className="p-2.5 font-normal text-right">Amount</th>
                <th className="p-2.5 font-normal text-center">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {txns.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-black/40 text-[11px]">Koi merchant transaction entry nahi mili.</td>
                </tr>
              ) : (
                txns.map((t, idx) => {
                  const wsObj = wholesalers.find(w => w.id === t.wsId)
                  return (
                    <tr key={t.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="p-2.5">
                        <span className="font-bold text-slate-800 block">{wsObj ? wsObj.name : 'Unknown'}</span>
                        <span className="text-[9px] text-black/30 font-mono">{t.date}</span>
                      </td>
                      <td className="p-2.5 text-slate-500 font-medium max-w-[100px] truncate">
                        {t.note || '-'}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-700">
                        Rs.{t.amount}
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border block w-max mx-auto ${
                          t.type === 'Due' 
                            ? 'bg-amber-50 text-amber-700 border-amber-100' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          {t.type === 'Due' ? 'Maal Liya' : 'Cash Paid'}
                        </span>
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
