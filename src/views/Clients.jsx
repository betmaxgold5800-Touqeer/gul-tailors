import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { UserPlus, Search, Phone, Ruler, DollarSign, ChevronDown, ChevronUp } from 'lucide-react'

export default function Clients() {
  const { clients, setClients, transactions, setTransactions, getClientBalance } = useApp()
  
  // Search aur Local Inputs ki states
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedClient, setExpandedClient] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Naye Client ki form state
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    length: '', teera: '', baazu: '', ghera: '', gala: '', chati: '',
    shalwar: '', mori: '', asan: ''
  })

  // Transaction Form Local States
  const [txAmount, setTxAmount] = useState('')
  const [txType, setTxType] = useState('credit') // credit = Jama (In), debit = Baqi (Out)
  const [txDesc, setTxDesc] = useState('')

  // 1. Client Registeration Handler
  const handleAddClient = (e) => {
    e.preventDefault()
    if (!newClient.name.trim()) return

    const clientObj = {
      id: 'c_' + Date.now(),
      name: newClient.name,
      phone: newClient.phone || 'N/A',
      measurements: {
        length: newClient.length, teera: newClient.teera, baazu: newClient.baazu,
        ghera: newClient.ghera, gala: newClient.gala, chati: newClient.chati,
        shalwar: newClient.shalwar, mori: newClient.mori, asan: newClient.asan
      }
    }

    setClients([clientObj, ...clients])
    setShowAddForm(false)
    setNewClient({
      name: '', phone: '', length: '', teera: '', baazu: '', ghera: '', gala: '', chati: '', shalwar: '', mori: '', asan: ''
    })
  }

  // 2. Ledger Transaction Handler
  const handleAddTransaction = (clientId) => {
    if (!txAmount || Number(txAmount) <= 0) return

    const txnObj = {
      id: 't_' + Date.now(),
      cid: clientId,
      amount: Number(txAmount),
      type: txType,
      desc: txDesc || (txType === 'credit' ? 'Jama Karwaye' : 'Baqi Raqam'),
      date: new Date().toLocaleDateString('en-PK')
    }

    setTransactions([txnObj, ...transactions])
    setTxAmount('')
    setTxDesc('')
  }

  // Filter Search Results
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  )

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Top Header Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-serif font-bold text-[#1a1006]">Clients Matrix</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#1a1006] text-[#e8b84b] text-xs px-3 py-2 rounded-xl border border-[#e2cfa0]/30 flex items-center gap-1 font-medium"
        >
          <UserPlus className="w-3.5 h-3.5" />
          {showAddForm ? 'Band Karein' : 'Naya Client'}
        </button>
      </div>

      {/* Dynamic Client Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddClient} className="bg-white border border-[#e2cfa0] rounded-xl p-4 space-y-3 shadow-inner">
          <h3 className="text-xs font-bold text-[#9a7c44] uppercase tracking-wider border-b border-black/5 pb-1">Basic Info</h3>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text" placeholder="Client Name" required
              value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})}
              className="border border-black/10 rounded-lg p-2 text-xs bg-[#fffdf7] focus:outline-[#c9952a]"
            />
            <input 
              type="tel" placeholder="Phone Number"
              value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})}
              className="border border-black/10 rounded-lg p-2 text-xs bg-[#fffdf7] focus:outline-[#c9952a]"
            />
          </div>

          <h3 className="text-xs font-bold text-[#9a7c44] uppercase tracking-wider border-b border-black/5 pb-1 pt-2">Naap (Measurements)</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            {['length', 'teera', 'baazu', 'ghera', 'gala', 'chati', 'shalwar', 'mori', 'asan'].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-[9px] uppercase font-bold text-[#1a1006]/60 mb-0.5">{field}</label>
                <input 
                  type="text" placeholder='0.0'
                  value={newClient[field]} onChange={e => setNewClient({...newClient, [field]: e.target.value})}
                  className="border border-black/10 rounded-lg p-1.5 text-xs text-center bg-[#fffdf7] focus:outline-[#c9952a]"
                />
              </div>
            ))}
          </div>

          <button type="submit" className="w-full bg-[#c9952a] text-white text-xs font-bold py-2.5 rounded-lg mt-2 shadow-md">
            Save Client Account
          </button>
        </form>
      )}

      {/* Modern Live Search Field */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#9a7c44] absolute left-3 top-2.5" />
        <input 
          type="text" 
          placeholder="Client ka naam ya phone dhoondein..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-black/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-[#c9952a]"
        />
      </div>

      {/* Clients Rendering Stack */}
      <div className="space-y-2">
        {filteredClients.length === 0 ? (
          <p className="text-center text-xs text-black/40 py-6">Koi Client nahi mila.</p>
        ) : (
          filteredClients.map((client) => {
            const balance = getClientBalance(client.id)
            const isExpanded = expandedClient === client.id

            return (
              <div key={client.id} className="bg-[#fffdf7] border border-black/5 rounded-xl shadow-sm overflow-hidden">
                
                {/* Accordion Master Row */}
                <div 
                  onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                  className="p-3 flex justify-between items-center cursor-pointer hover:bg-black/[0.01]"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#1a1006]">{client.name}</h4>
                    <p className="text-[10px] text-black/40 flex items-center gap-1 mt-0.5">
                      <Phone className="w-2.5 h-2.5" /> {client.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-serif font-bold px-2 py-0.5 rounded ${
                      balance < 0 ? 'bg-red-50 text-red-600' : balance > 0 ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {balance === 0 ? 'Clear' : balance < 0 ? `Rs. ${Math.abs(balance)} (Baqaia)` : `Rs. ${balance} (Jama)`}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-black/40" /> : <ChevronDown className="w-3.5 h-3.5 text-black/40" />}
                  </div>
                </div>

                {/* Accordion Expansion Panel */}
                {isExpanded && (
                  <div className="border-t border-black/5 bg-white p-3 space-y-4 animate-slideDown">
                    
                    {/* Measurements Display Layout */}
                    <div>
                      <h5 className="text-[10px] font-bold text-[#9a7c44] uppercase tracking-wider flex items-center gap-1 mb-2">
                        <Ruler className="w-3 h-3" /> Naap ka Record
                      </h5>
                      <div className="grid grid-cols-3 gap-2 bg-[#fdf6e9]/50 p-2 rounded-lg border border-[#e2cfa0]/30 text-center">
                        {Object.entries(client.measurements).map(([key, val]) => (
                          <div key={key} className="border-b border-black/[0.02] pb-1">
                            <p className="text-[8px] uppercase text-black/40 font-bold">{key}</p>
                            <p className="text-xs font-semibold text-[#1a1006]">{val || '-'}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Ledger Transaction Entry Pad */}
                    <div className="pt-2 border-t border-black/5">
                      <h5 className="text-[10px] font-bold text-[#9a7c44] uppercase tracking-wider flex items-center gap-1 mb-2">
                        <DollarSign className="w-3 h-3" /> Khaata (Ledger Entry)
                      </h5>
                      <div className="flex gap-1.5">
                        <select 
                          value={txType} onChange={e => setTxType(e.target.value)}
                          className="border border-black/10 rounded-lg text-[11px] p-1.5 bg-[#fffdf7]"
                        >
                          <option value="credit">Jama (+)</option>
                          <option value="debit">Baqi (-)</option>
                        </select>
                        <input 
                          type="number" placeholder="Raqam" value={txAmount}
                          onChange={e => setTxAmount(e.target.value)}
                          className="border border-black/10 rounded-lg p-1.5 text-xs w-20 focus:outline-[#c9952a]"
                        />
                        <input 
                          type="text" placeholder="Tafseel (Optional)" value={txDesc}
                          onChange={e => setTxDesc(e.target.value)}
                          className="border border-black/10 rounded-lg p-1.5 text-xs flex-1 focus:outline-[#c9952a]"
                        />
                        <button 
                          type="button" onClick={() => handleAddTransaction(client.id)}
                          className="bg-[#1a1006] text-[#e8b84b] text-[11px] px-3 rounded-lg font-medium"
                        >
                          Ok
                        </button>
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
