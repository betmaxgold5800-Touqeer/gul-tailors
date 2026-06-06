import React, { useState } from 'react'
import { UserPlus, ShoppingBag, Phone, DollarSign, ChevronDown, ChevronUp } from 'lucide-react'

// Local storage key constants
const WS_KEY = 'gt_wholesalers'
const WS_TX_KEY = 'gt_ws_txns'

export default function Wholesalers() {
  // Initialization directly from LocalStorage
  const [wholesalers, setWholesalers] = useState(() => {
    const saved = localStorage.getItem(WS_KEY)
    return saved ? JSON.parse(saved) : []
  })

  const [wsTxns, setWsTxns] = useState(() => {
    const saved = localStorage.getItem(WS_TX_KEY)
    return saved ? JSON.parse(saved) : []
  })

  // UI Toggles & Form States
  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedWs, setExpandedWs] = useState(null)
  
  const [newWs, setNewWs] = useState({ name: '', phone: '', shop: '' })
  const [txAmount, setTxAmount] = useState('')
  const [txType, setTxType] = useState('debit') // debit = Maal Khareeda (Baqi), credit = Payment Di (Jama)
  const [txDesc, setTxDesc] = useState('')

  // Sync to LocalStorage on state modifications
  const saveWs = (data) => {
    setWholesalers(data)
    localStorage.setItem(WS_KEY, JSON.stringify(data))
  }

  const saveTxns = (data) => {
    setWsTxns(data)
    localStorage.setItem(WS_TX_KEY, JSON.stringify(data))
  }

  // 1. Wholesaler Registration
  const handleAddWs = (e) => {
    e.preventDefault()
    if (!newWs.name.trim()) return

    const wsObj = {
      id: 'ws_' + Date.now(),
      name: newWs.name,
      phone: newWs.phone || 'N/A',
      shop: newWs.shop || 'Bazaar'
    }

    saveWs([wsObj, ...wholesalers])
    setShowAddForm(false)
    setNewWs({ name: '', phone: '', shop: '' })
  }

  // 2. Transaction Logger
  const handleAddTxn = (wsId) => {
    if (!txAmount || Number(txAmount) <= 0) return

    const txnObj = {
      id: 'wst_' + Date.now(),
      wsid: wsId,
      amount: Number(txAmount),
      type: txType,
      desc: txDesc || (txType === 'debit' ? 'Maal Khareeda' : 'Payment Ada Ki'),
      date: new Date().toLocaleDateString('en-PK')
    }

    saveTxns([txnObj, ...wsTxns])
    setTxAmount('')
    setTxDesc('')
  }

  // 3. Balance Calculator Matrix
  const getWsBalance = (wsId) => {
    return wsTxns
      .filter(t => t.wsid === wsId)
      .reduce((acc, t) => t.type === 'debit' ? acc - Number(t.amount) : acc + Number(t.amount), 0)
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* View Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-serif font-bold text-[#1a1006]">Wholesalers Matrix</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#1a1006] text-[#e8b84b] text-xs px-3 py-2 rounded-xl border border-[#e2cfa0]/30 flex items-center gap-1 font-medium"
        >
          <UserPlus className="w-3.5 h-3.5" />
          {showAddForm ? 'Band Karein' : 'Naya Merchant'}
        </button>
      </div>

      {/* Add Wholesaler Form */}
      {showAddForm && (
        <form onSubmit={handleAddWs} className="bg-white border border-[#e2cfa0] rounded-xl p-4 space-y-3 shadow-inner">
          <h3 className="text-xs font-bold text-[#9a7c44] uppercase tracking-wider border-b border-black/5 pb-1">Merchant Profile</h3>
          <div className="grid grid-cols-3 gap-2">
            <input 
              type="text" placeholder="Seth / Name" required value={newWs.name}
              onChange={e => setNewWs({...newWs, name: e.target.value})}
              className="border border-black/10 rounded-lg p-2 text-xs bg-[#fffdf7] focus:outline-[#c9952a]"
            />
            <input 
              type="tel" placeholder="Phone No" value={newWs.phone}
              onChange={e => setNewWs({...newWs, phone: e.target.value})}
              className="border border-black/10 rounded-lg p-2 text-xs bg-[#fffdf7] focus:outline-[#c9952a]"
            />
            <input 
              type="text" placeholder="Shop/Market" value={newWs.shop}
              onChange={e => setNewWs({...newWs, shop: e.target.value})}
              className="border border-black/10 rounded-lg p-2 text-xs bg-[#fffdf7] focus:outline-[#c9952a]"
            />
          </div>
          <button type="submit" className="w-full bg-[#c9952a] text-white text-xs font-bold py-2 rounded-lg shadow-md">
            Save Merchant Account
          </button>
        </form>
      )}

      {/* Wholesalers Rendering Loop */}
      <div className="space-y-2">
        {wholesalers.length === 0 ? (
          <p className="text-center text-xs text-black/40 py-6">Koi Wholesale Merchant register nahi hai.</p>
        ) : (
          wholesalers.map((ws) => {
            const balance = getWsBalance(ws.id)
            const isExpanded = expandedWs === ws.id
            const history = wsTxns.filter(t => t.wsid === ws.id)

            return (
              <div key={ws.id} className="bg-[#fffdf7] border border-black/5 rounded-xl shadow-sm overflow-hidden">
                
                {/* Header Selector */}
                <div 
                  onClick={() => setExpandedWs(isExpanded ? null : ws.id)}
                  className="p-3 flex justify-between items-center cursor-pointer hover:bg-black/[0.01]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#1a1006]/5 rounded-full flex items-center justify-center text-xs">
                      <ShoppingBag className="w-4 h-4 text-[#9a7c44]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1a1006]">{ws.name}</h4>
                      <p className="text-[9px] text-black/40">
                        Market: {ws.shop} | <span className="font-mono">{ws.phone}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-serif font-bold px-2 py-0.5 rounded ${
                      balance < 0 ? 'bg-red-50 text-red-600' : balance > 0 ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {balance === 0 ? 'Clear' : balance < 0 ? `Rs. ${Math.abs(balance)} (Hamein Dena Hai)` : `Rs. ${balance} (Advance Matrix)`}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-black/40" /> : <ChevronDown className="w-3.5 h-3.5 text-black/40" />}
                  </div>
                </div>

                {/* Expanded Ledger Segment */}
                {isExpanded && (
                  <div className="border-t border-black/5 bg-white p-3 space-y-4 animate-slideDown">
                    
                    {/* Add Ledger Action Pad */}
                    <div>
                      <h5 className="text-[10px] font-bold text-[#9a7c44] uppercase tracking-wider flex items-center gap-1 mb-2">
                        <DollarSign className="w-3 h-3" /> Ledger Entry Record Karein
                      </h5>
                      <div className="flex gap-1.5">
                        <select 
                          value={txType} onChange={e => setTxType(e.target.value)}
                          className="border border-black/10 rounded-lg text-[11px] p-1.5 bg-[#fffdf7]"
                        >
                          <option value="debit">Maal Khareeda (-)</option>
                          <option value="credit">Payment Di (+)</option>
                        </select>
                        <input 
                          type="number" placeholder="Raqam" value={txAmount}
                          onChange={e => setTxAmount(e.target.value)}
                          className="border border-black/10 rounded-lg p-1.5 text-xs w-20 focus:outline-[#c9952a]"
                        />
                        <input 
                          type="text" placeholder="Tafseel" value={txDesc}
                          onChange={e => setTxDesc(e.target.value)}
                          className="border border-black/10 rounded-lg p-1.5 text-xs flex-1 focus:outline-[#c9952a]"
                        />
                        <button 
                          type="button" onClick={() => handleAddTxn(ws.id)}
                          className="bg-[#1a1006] text-[#e8b84b] text-[11px] px-3 rounded-lg font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    {/* History Log */}
                    <div className="pt-2 border-t border-black/5">
                      <h5 className="text-[10px] font-bold text-[#9a7c44] uppercase tracking-wider mb-1.5">Haliya Transactions Ledger</h5>
                      <div className="max-h-24 overflow-y-auto space-y-1 text-[10px]">
                        {history.length === 0 ? (
                          <p className="text-black/30 italic text-center py-2">Koi transactions record nahi hain.</p>
                        ) : (
                          history.map((h) => (
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
