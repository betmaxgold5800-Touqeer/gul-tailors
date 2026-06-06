import React, { useState, useEffect } from 'react'
import { Plus, Search, User, Phone, Ruler, CheckCircle, Trash2, HelpCircle, ArrowRightLeft } from 'lucide-react'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedClient, setExpandedClient] = useState(null)
  
  // Active Field Tracker for Live Measurement Guidance Indicator
  const [activeGuide, setActiveGuide] = useState('general')

  // Measurement Input Fields State Matrix
  const [formData, setFormData] = useState({
    name: '', phone: '', lambai: '', teera: '', bazu: '', 
    gala: '', chati: '', kamar: '', ghera: '', shalwar: '', 
    pacha: '', baqi: '0', note: ''
  })

  // Visual Indicator Guide Dictionary Matrix
  const guideBook = {
    general: "Naap ki field par click karein. Senior guide indicator yahan aap ko sahi naapne ka tarika bataye ga.",
    lambai: "📏 LAMBAI GUIDE: Gale ka jor (neck-shoulder point) jahan se shuru hota hai, wahan se tape rakh kar seedha neeche ghtnay se 2 inch neeche ya client ki pasand tak napein.",
    teera: "📐 TEERA (SHOULDER) GUIDE: Peeth ki taraf se aik kandhay ki aakhri hadd (shoulder bone edge) se shuru karein aur gardan ke nichay se guzartay huway doosray kandhay ki hadd tak napein.",
    bazu: "💪 BAZU GUIDE: Kandhay ke jor (jahan teera khatam hua tha) se lekar kalai ki hadd (wrist bone) tak lambai napein. Agar cuff lagana ho to 1/2 inch kam rakhein.",
    gala: "👔 COLLAR / GALA GUIDE: Gardan ke gird tape ko narm rakh kar ghumayein. Poore circle mein do ungliyan (2 fingers) andar rakh kar naap lein taaki collar tight na ho.",
    chati: "👕 CHATI (CHEST) GUIDE: Bagalon ke bulkul neeche se poore jism ke gird tape ghumayein. Client ko kahein ke saans normal rakhe, zyada tight na karein.",
    ghera: "👗 GHERA / DAAMAN GUIDE: Kameez ke ghere ka naap sethay ghere ki soorat mein aakhri corner se doosray corner tak lein, ya ghol ghere ki paimaish client ke jism ke mutabik karein.",
    shalwar: "👖 SHALWAR GUIDE: Nafay (waistband line) se lekar takhno (ankle bone) tak ya jitni client shalwar nichi ya oonchi pehenta ho, wahan tak lambai napein.",
    pacha: "👣 PACHA (BOTTOM) GUIDE: Shalwar ke paon wale khulay hissay ka naap flat rukh mein lein. Standard pacha 7 se 9-1/2 inch tak hota hai."
  }

  useEffect(() => {
    const saved = localStorage.getItem('gt_clients')
    if (saved) setClients(JSON.parse(saved))
  }, [])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddFieldFocus = (fieldName) => {
    if (guideBook[fieldName]) {
      setActiveGuide(fieldName)
    } else {
      setActiveGuide('general')
    }
  }

  const handleSaveClient = (e) => {
    e.preventDefault()
    if (!formData.name) return alert("Client ka naam zaroori hai!")

    const newClients = [...clients, { ...formData, id: Date.now().toString() }]
    setClients(newClients)
    localStorage.setItem('gt_clients', JSON.stringify(newClients))
    
    // Reset Form Matrix
    setFormData({
      name: '', phone: '', lambai: '', teera: '', bazu: '', 
      gala: '', chati: '', kamar: '', ghera: '', shalwar: '', 
      pacha: '', baqi: '0', note: ''
    })
    setShowAddForm(false)
    setActiveGuide('general')
  }

  const handleDeleteClient = (id) => {
    if (window.confirm("Kya aap is client ka naap hamesha ke liye delete karna chahte hain?")) {
      const updated = clients.filter(c => c.id !== id)
      setClients(updated)
      localStorage.setItem('gt_clients', JSON.stringify(updated))
    }
  }

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  )

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Header Matrix */}
      <div className="flex items-center justify-between border-b border-[#e2cfa0]/30 pb-2">
        <h2 className="text-base font-serif font-bold text-[#1a1006] flex items-center gap-1.5">
          📖 Measurement Book <span className="text-[10px] bg-[#e8b84b]/20 text-[#9a7c44] px-1.5 py-0.5 rounded-full font-sans font-normal">{clients.length} Records</span>
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#1a1006] text-[#e8b84b] hover:bg-[#1a1006]/90 text-xs font-bold py-1.5 px-3 rounded-xl flex items-center gap-1 border border-[#e2cfa0]/20 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> {showAddForm ? 'Band Karein' : 'Naya Naap'}
        </button>
      </div>

      {/* Senior Dynamic Add Client Form Layer */}
      {showAddForm && (
        <form onSubmit={handleSaveClient} className="bg-[#fffdf7] border-2 border-[#e2cfa0] rounded-2xl p-4 shadow-md space-y-4 animate-slideDown">
          
          {/* Real-time Visual Indicator Guidance Box */}
          <div className="bg-[#1a1006] text-white rounded-xl p-3 border-l-4 border-[#e8b84b] text-[11px] leading-relaxed flex gap-2 shadow-inner">
            <HelpCircle className="w-4 h-4 text-[#e8b84b] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#e8b84b] font-bold block uppercase tracking-wider text-[9px] mb-0.5">📐 Live Measurement Guide Indicator</span>
              <p className="text-white/80 font-medium">{guideBook[activeGuide]}</p>
            </div>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-[#9a7c44] border-b border-black/5 pb-1">👤 Profile Info</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-bold text-black/50 block mb-0.5">Client Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} onFocus={() => handleAddFieldFocus('general')} className="w-full bg-white border border-black/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#e8b84b]" placeholder="e.g. Asif Raza" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-black/50 block mb-0.5">Mobile Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} onFocus={() => handleAddFieldFocus('general')} className="w-full bg-white border border-black/10 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#e8b84b]" placeholder="e.g. 03001234567" />
            </div>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-[#9a7c44] border-b border-black/5 pb-1 pt-1">📏 Suit Measurement Grids (Inches)</h3>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Lambai (L)</label>
              <input type="number" step="0.1" name="lambai" value={formData.lambai} onChange={handleInputChange} onFocus={() => handleAddFieldFocus('lambai')} className="w-full bg-white border border-black/10 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold" placeholder="40" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Teera (T)</label>
              <input type="number" step="0.1" name="teera" value={formData.teera} onChange={handleInputChange} onFocus={() => handleAddFieldFocus('teera')} className="w-full bg-white border border-black/10 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold" placeholder="18" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Bazu (B)</label>
              <input type="number" step="0.1" name="bazu" value={formData.bazu} onChange={handleInputChange} onFocus={() => handleAddFieldFocus('bazu')} className="w-full bg-white border border-black/10 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold" placeholder="23" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Collar/Gala</label>
              <input type="number" step="0.1" name="gala" value={formData.gala} onChange={handleInputChange} onFocus={() => handleAddFieldFocus('gala')} className="w-full bg-white border border-black/10 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold" placeholder="14.5" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Chati (Chest)</label>
              <input type="number" step="0.1" name="chati" value={formData.chati} onChange={handleInputChange} onFocus={() => handleAddFieldFocus('chati')} className="w-full bg-white border border-black/10 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold" placeholder="36" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Ghera</label>
              <input type="number" step="0.1" name="ghera" value={formData.ghera} onChange={handleInputChange} onFocus={() => handleAddFieldFocus('ghera')} className="w-full bg-white border border-black/10 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold" placeholder="22" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Shalwar (S)</label>
              <input type="number" step="0.1" name="shalwar" value={formData.shalwar} onChange={handleInputChange} onFocus={() => handleAddFieldFocus('shalwar')} className="w-full bg-white border border-black/10 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold" placeholder="38" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Pacha</label>
              <input type="number" step="0.1" name="pacha" value={formData.pacha} onChange={handleInputChange} onFocus={() => handleAddFieldFocus('pacha')} className="w-full bg-white border border-black/10 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold" placeholder="8.5" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-rose-600 block mb-0.5">Baqi (Udhaar)</label>
              <input type="number" name="baqi" value={formData.baqi} onChange={handleInputChange} onFocus={() => handleAddFieldFocus('general')} className="w-full bg-white border border-rose-200 text-rose-700 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-rose-500 font-mono font-bold" placeholder="0" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-black/50 block mb-0.5">Special Design Note (Kadhai, Pocket style etc.)</label>
            <textarea name="note" value={formData.note} onChange={handleInputChange} onFocus={() => handleAddFieldFocus('general')} rows="2" className="w-full bg-white border border-black/10 rounded-xl p-2 text-xs focus:outline-none focus:border-[#e8b84b]" placeholder="e.g. Double silai, round pacha, front pocket left side..."></textarea>
          </div>

          <button type="submit" className="w-full bg-[#e8b84b] text-[#1a1006] font-bold py-2 rounded-xl text-xs shadow-md border border-[#c9952a] flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" /> Save Measurement Book
          </button>
        </form>
      )}

      {/* Live Real-time Search Infrastructure */}
      <div className="relative">
        <Search className="w-4 h-4 text-black/30 absolute left-3 top-2.5" />
        <input 
          type="text" 
          placeholder="Search client by name or mobile number..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#fffdf7] border border-[#e2cfa0] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#e8b84b] font-sans shadow-sm"
        />
      </div>

      {/* Clients Vault Render Grid */}
      <div className="space-y-2">
        {filteredClients.length === 0 ? (
          <div className="text-center text-xs text-black/40 py-8 bg-white/50 border border-black/5 rounded-xl">
            Koi client record nahi mila. "Naya Naap" button daba kar entry karein.
          </div>
        ) : (
          filteredClients.map((client) => {
            const isExpanded = expandedClient === client.id
            return (
              <div key={client.id} className="bg-white border border-black/5 rounded-xl p-3 shadow-sm transition-all duration-200">
                
                {/* Header Metadata Summary Row */}
                <div 
                  onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="bg-[#1a1006]/5 p-2 rounded-full text-[#9a7c44]">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{client.name}</h4>
                      <p className="text-[10px] text-black/40 font-mono flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" /> {client.phone || 'No Number'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="text-[9px] text-black/40 uppercase block tracking-wider">Baqi</span>
                      <span className={`text-xs font-mono font-bold ${Number(client.baqi) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        Rs.{client.baqi || 0}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#9a7c44] font-bold">
                      {isExpanded ? '🔺 Close' : '📐 Naap'}
                    </div>
                  </div>
                </div>

                {/* Smooth Expandable Measurement Blueprint Matrix */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-black/5 space-y-3 animate-fadeIn">
                    
                    <div className="text-[10px] font-bold text-[#9a7c44] uppercase tracking-wider flex items-center gap-1">
                      <Ruler className="w-3 h-3" /> Suit Technical Dimensions:
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-center font-sans">
                      <div className="bg-[#fffdf7] border border-[#e2cfa0]/40 rounded-lg p-1.5">
                        <span className="text-[9px] text-black/40 block uppercase font-bold">Lambai</span>
                        <span className="text-xs font-mono font-black text-slate-800">{client.lambai || '-'}</span>
                      </div>
                      <div className="bg-[#fffdf7] border border-[#e2cfa0]/40 rounded-lg p-1.5">
                        <span className="text-[9px] text-black/40 block uppercase font-bold">Teera</span>
                        <span className="text-xs font-mono font-black text-slate-800">{client.teera || '-'}</span>
                      </div>
                      <div className="bg-[#fffdf7] border border-[#e2cfa0]/40 rounded-lg p-1.5">
                        <span className="text-[9px] text-black/40 block uppercase font-bold">Bazu</span>
                        <span className="text-xs font-mono font-black text-slate-800">{client.bazu || '-'}</span>
                      </div>
                      <div className="bg-[#fffdf7] border border-[#e2cfa0]/40 rounded-lg p-1.5">
                        <span className="text-[9px] text-black/40 block uppercase font-bold">Gala</span>
                        <span className="text-xs font-mono font-black text-slate-800">{client.gala || '-'}</span>
                      </div>
                      <div className="bg-[#fffdf7] border border-[#e2cfa0]/40 rounded-lg p-1.5">
                        <span className="text-[9px] text-black/40 block uppercase font-bold">Chati</span>
                        <span className="text-xs font-mono font-black text-slate-800">{client.chati || '-'}</span>
                      </div>
                      <div className="bg-[#fffdf7] border border-[#e2cfa0]/40 rounded-lg p-1.5">
                        <span className="text-[9px] text-black/40 block uppercase font-bold">Ghera</span>
                        <span className="text-xs font-mono font-black text-slate-800">{client.ghera || '-'}</span>
                      </div>
                      <div className="bg-[#fffdf7] border border-[#e2cfa0]/40 rounded-lg p-1.5">
                        <span className="text-[9px] text-black/40 block uppercase font-bold">Shalwar</span>
                        <span className="text-xs font-mono font-black text-slate-800">{client.shalwar || '-'}</span>
                      </div>
                      <div className="bg-[#fffdf7] border border-[#e2cfa0]/40 rounded-lg p-1.5">
                        <span className="text-[9px] text-black/40 block uppercase font-bold">Pacha</span>
                        <span className="text-xs font-mono font-black text-slate-800">{client.pacha || '-'}</span>
                      </div>
                    </div>

                    {client.note && (
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-[11px] text-slate-600 leading-normal">
                        <span className="font-bold text-slate-700 block text-[9px] uppercase tracking-wider mb-0.5">🎨 Tailoring Remarks:</span>
                        {client.note}
                      </div>
                    )}

                    {/* Operational Destruct Matrix */}
                    <div className="flex justify-end pt-1">
                      <button 
                        type="button"
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-rose-600 hover:text-rose-700 text-[10px] font-bold flex items-center gap-0.5 border border-rose-100 bg-rose-50/50 px-2 py-1 rounded-lg"
                      >
                        <Trash2 className="w-3 h-3" /> Delete Record
                      </button>
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
