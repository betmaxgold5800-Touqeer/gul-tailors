import React, { useState } from 'react';

export default function Clients({ data, setClients, onDelete }) {
  // Modal controllers
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNaapModal, setShowNaapModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  
  // [NEW STATE] Search & Filter Controls Matrix
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Urgent', 'Udhaar'

  // Real-time Master Guide Status Bar state
  const [activeGuideText, setActiveGuideText] = useState('💡 Kisi bhi field par tap karein tailoring instruction dekhne ke liye.');

  // Flat & Control-Driven Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [suitCount, setSuitCount] = useState(1);
  const [isUrgent, setIsUrgent] = useState(false);
  const [silayiPrice, setSilayiPrice] = useState('');
  const [pKarhayiPrice, setPKarhayiPrice] = useState('');
  const [gKarhayiPrice, setGKarhayiPrice] = useState('');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [orderStatus, setOrderStatus] = useState('Pending');

  // Sizing Vault State Model
  const [naapForm, setNaapForm] = useState({
    lambaai: '', teera: '', baazu: '', ghera: '', 
    shalwar: '', paincha: '', asan: '', galla: ''
  });

  const guides = {
    galla: "Galla: Inch-tape ko gardan ke gird ghumayen, do ungliyan andar rakhein.",
    paincha: "Paincha: Shalwar ke nichlay hissay ki total chaorai (poncha).",
    lambaai: "Lambaai: Kandhay ki top silai se le kar nechay daman tak.",
    teera: "Teera: Aik kandhay ki haddi se dusray kandhay ki haddi tak.",
    baazu: "Baazu: Kandhay ki jor se hatheli ke nichlay hissay tak.",
    ghera: "Ghera: Kameez ke daman ki total chaorai.",
    shalwar: "Shalwar: Jahan nemah/belt bandha jata hai wahan se ponchay tak.",
    asan: "Asan: Shalwar ki guthni/crotch length ka standard naap."
  };

  // [NEW LOGIC] Real-time Metrics Calculations for the Top Strip
  const metrics = data.reduce((acc, curr) => {
    const totalBill = (curr.silayi + curr.pKarhayi + curr.gKarhayi) * curr.totalSuits;
    acc.totalSuits += curr.totalSuits || 0;
    if (curr.isUrgent) acc.urgentCount += 1;
    acc.totalUdhaar += Math.max(0, totalBill - (curr.received || 0));
    return acc;
  }, { totalSuits: 0, urgentCount: 0, totalUdhaar: 0 });

  // Real-time Math Ledger Calculations (Strict Ground Reality: Udhaar depends ONLY on Cash Paid)
  const currentTotalBill = ((Number(silayiPrice) || 0) + (Number(pKarhayiPrice) || 0) + (Number(gKarhayiPrice) || 0)) * (Number(suitCount) || 1);
  const currentUdhaar = Math.max(0, currentTotalBill - Number(receivedAmount || 0));

  // Inline Status Changer Switch (Direct State Lifter without opening Modal)
  const toggleStatusDirectly = (clientId, currentStatus) => {
    const nextStatus = currentStatus === 'Delivered' ? 'Pending' : 'Delivered';
    setClients((prevClients) =>
      prevClients.map((c) => (c.id === clientId ? { ...c, status: nextStatus } : c))
    );
  };

  // Open modal in edit mode
  const openEditManager = (client) => {
    setIsEditing(true);
    setEditingClientId(client.id);
    setClientName(client.name);
    setClientPhone(client.phone);
    setSuitCount(client.totalSuits);
    setIsUrgent(client.isUrgent);
    setSilayiPrice(client.silayi || '');
    setPKarhayiPrice(client.pKarhayi || '');
    setGKarhayiPrice(client.gKarhayi || '');
    setReceivedAmount(client.received || '');
    setDeliveryDate(client.deliveryDate || '');
    setOrderStatus(client.status || 'Pending');
    setShowAddModal(true);
  };

  // Open modal in add mode cleanly
  const openAddManager = () => {
    setIsEditing(false);
    setEditingClientId(null);
    setClientName('');
    setClientPhone('');
    setSuitCount(1);
    setIsUrgent(false);
    setSilayiPrice('');
    setPKarhayiPrice('');
    setGKarhayiPrice('');
    setReceivedAmount('');
    setDeliveryDate('');
    setOrderStatus('Pending');
    setShowAddModal(true);
  };

  // Atomic Custom Save / Update Handler
  const executeSaveClient = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('⚠️ Error: Client Name aur Phone Number likhna lazmi hai!');
      return;
    }

    const finalBill = currentTotalBill;
    const finalReceived = Number(receivedAmount) || 0;
    const finalUdhaar = Math.max(0, finalBill - finalReceived);

    if (isEditing) {
      setClients((prevClients) =>
        prevClients.map((c) =>
          c.id === editingClientId
            ? {
                ...c,
                name: clientName.trim(),
                phone: clientPhone.trim(),
                totalSuits: Number(suitCount) || 1,
                isUrgent: isUrgent,
                silayi: Number(silayiPrice) || 0,
                pKarhayi: Number(pKarhayiPrice) || 0,
                gKarhayi: Number(gKarhayiPrice) || 0,
                received: finalReceived,
                udhaar: finalUdhaar,
                deliveryDate: deliveryDate,
                status: orderStatus
              }
            : c
        )
      );
    } else {
      const today = new Date().toISOString().split('T')[0];
      const newClientRecord = {
        id: Date.now(),
        name: clientName.trim(),
        phone: clientPhone.trim(),
        totalSuits: Number(suitCount) || 1,
        isUrgent: isUrgent,
        silayi: Number(silayiPrice) || 0,
        pKarhayi: Number(pKarhayiPrice) || 0,
        gKarhayi: Number(gKarhayiPrice) || 0,
        received: finalReceived,
        udhaar: finalUdhaar,
        orderDate: today,
        deliveryDate: deliveryDate,
        status: orderStatus,
        naap: { lambaai: '', teera: '', baazu: '', ghera: '', shalwar: '', paincha: '', asan: '', galla: '' }
      };
      setClients((prevClients) => [newClientRecord, ...prevClients]);
    }

    setShowAddModal(false);
  };

  // WhatsApp Automated Invoice & Billing Engine
  const dispatchWhatsAppInvoice = (client) => {
    const calculatedTotal = (client.silayi + client.pKarhayi + client.gKarhayi) * client.totalSuits;
    const cleanPhone = client.phone.replace(/\D/g, '');
    
    const message = `Assalam-o-Alaikum *${client.name}* Bhai,\n\nGul Tailors ki taraf se aap ke order ka status ledger ready hai:\n\n` +
      `📦 Total Suits: ${client.totalSuits}\n` +
      `${client.isUrgent ? '🚨 Order Type: Urgent Delivery\n' : ''}` +
      `📅 Order Date: ${client.orderDate || 'N/A'}\n` +
      `📅 Delivery Date: ${client.deliveryDate || 'N/A'}\n` +
      `⚡ Status: *${client.status || 'Pending'}*\n` +
      `💰 Total Bill: Rs. ${calculatedTotal}\n` +
      `💵 Paid Cash: Rs. ${client.received}\n` +
      `📉 Baqi Udhaar Balance: *Rs. ${client.udhaar}*\n\n` +
      `*Gul Tailors Premium Vault • Adhi Kot*`;

    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const openNaapManager = (client) => {
    setSelectedClient(client);
    setNaapForm(client.naap || { lambaai: '', teera: '', baazu: '', ghera: '', shalwar: '', paincha: '', asan: '', galla: '' });
    setActiveGuideText('💡 Kisi bhi field par tap karein tailoring instruction dekhne ke liye.');
    setShowNaapModal(true);
  };

  const executeSaveNaap = () => {
    setClients((prevClients) =>
      prevClients.map((c) => (c.id === selectedClient.id ? { ...c, naap: naapForm } : c))
    );
    setShowNaapModal(false);
  };

  // [NEW FILTER LOGIC] Integrated Dynamic Filtration System
  const filteredData = data.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (activeFilter === 'Urgent') return client.isUrgent;
    if (activeFilter === 'Udhaar') return client.udhaar > 0;
    
    return true;
  });

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Premium Top Controller */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-xs font-black tracking-widest text-[#8a6d3b] uppercase">👥 CLIENTS ENGINE v3.0</h3>
          <p className="text-[10px] font-bold text-gray-400">Active Records: {data.length}</p>
        </div>
        <button 
          onClick={openAddManager} 
          className="bg-[#1f1610] text-[#cca464] font-black text-xs px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-md"
        >
          ➕ Add Client Order
        </button>
      </div>

      {/* UPDATE 1: 📊 Ledger Metrics Summary Strip (Top Bar) */}
      <div className="grid grid-cols-3 gap-2 bg-gradient-to-r from-[#1f1610] to-[#2d221a] p-3 rounded-2xl text-center shadow-xs">
        <div>
          <span className="text-[9px] font-bold text-[#cca464]/80 block uppercase">Total Suits</span>
          <span className="text-xs font-black text-white">{metrics.totalSuits} Qty</span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-rose-400 block uppercase">🚨 Urgent</span>
          <span className="text-xs font-black text-white">{metrics.urgentCount} Orders</span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-emerald-400 block uppercase">Total Udhaar</span>
          <span className="text-xs font-black text-white">Rs. {metrics.totalUdhaar}</span>
        </div>
      </div>

      {/* UPDATE 2: 🔍 Dynamic Search Engine Row */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="🔍 Client ka Naam ya Phone number se dhundein..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-4 pr-10 rounded-2xl border border-gray-100 bg-white font-bold text-xs shadow-xs focus:outline-none focus:border-amber-400 transition-colors"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* UPDATE 3: 🎛️ Quick Filter Matrix (Pills Row) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button 
          onClick={() => setActiveFilter('All')}
          className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap active:scale-95 ${
            activeFilter === 'All' ? 'bg-[#1f1610] text-[#cca464]' : 'bg-white text-gray-500 border border-gray-100'
          }`}
        >
          📁 All Orders
        </button>
        <button 
          onClick={() => setActiveFilter('Urgent')}
          className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap active:scale-95 ${
            activeFilter === 'Urgent' ? 'bg-rose-500 text-white shadow-xs' : 'bg-white text-gray-500 border border-gray-100'
          }`}
        >
          🚨 Urgent Orders
        </button>
        <button 
          onClick={() => setActiveFilter('Udhaar')}
          className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap active:scale-95 ${
            activeFilter === 'Udhaar' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-gray-500 border border-gray-100'
          }`}
        >
          📉 Baqi Udhaar
        </button>
      </div>

      {/* Main Stream System Cards */}
      <div className="space-y-3">
        {filteredData.map((client) => {
          const clientTotalBill = (client.silayi + client.pKarhayi + client.gKarhayi) * client.totalSuits;
          const displayUdhaar = client.udhaar; // Pure Udhaar Tracking independent of status
          const currentStatus = client.status || 'Pending';

          // UPDATE 4: ⚠️ Overdue & Pending Delivery Warning System Verification
          const todayStr = "2026-06-07"; // Production Anchored Current System Time
          const isOverdue = currentStatus === 'Pending' && client.deliveryDate && client.deliveryDate < todayStr;

          return (
            <div 
              key={client.id} 
              className={`bg-white rounded-3xl p-4 border shadow-sm space-y-3 relative overflow-hidden transition-all duration-300 ${
                isOverdue ? 'border-rose-500 ring-2 ring-rose-500/10 animate-[pulse_2s_infinite]' : 'border-gray-100'
              }`}
            >
              {/* Card Status Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-base text-gray-800 tracking-wide">{client.name}</h4>
                    {client.isUrgent && (
                      <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md animate-pulse">URGENT</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">📞 {client.phone}</p>
                  <p className={`text-[10px] font-bold mt-0.5 ${isOverdue ? 'text-rose-600 font-black' : 'text-gray-400'}`}>
                    📅 Delivery: {client.deliveryDate || 'Not Set'} {isOverdue && '⚠️ OVERDUE'}
                  </p>
                </div>
                
                {/* INLINE STATUS BUTTON CONTROLLER (Directly on the main UI Card) */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => toggleStatusDirectly(client.id, currentStatus)}
                    className={`text-[10px] font-black px-3 py-1.5 rounded-xl transition-all active:scale-95 border ${
                      currentStatus === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {currentStatus === 'Delivered' ? '📦 Delivered' : '⏳ Pending'}
                  </button>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl block ${displayUdhaar > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                    {displayUdhaar > 0 ? `Udhaar: Rs. ${displayUdhaar}` : 'Clear ✅'}
                  </span>
                </div>
              </div>

              {/* Order Load Framework Metrics */}
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-100 text-center">
                <div>
                  <span className="text-[9px] font-black text-gray-400 block uppercase">Suits</span>
                  <span className="text-xs font-black text-gray-700">{client.totalSuits} Qty</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-gray-400 block uppercase">Total Bill</span>
                  <span className="text-xs font-black text-gray-700">Rs. {clientTotalBill || 0}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-gray-400 block uppercase">Paid Cash</span>
                  <span className="text-xs font-black text-emerald-600">Rs. {client.received || 0}</span>
                </div>
              </div>

              {/* Actions Console Panel */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => openNaapManager(client)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all active:scale-95"
                  >
                    📏 Size Vault
                  </button>
                  <button 
                    onClick={() => openEditManager(client)}
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-black text-xs px-3 py-2 rounded-xl transition-colors active:scale-95"
                  >
                    📝 Edit Profile
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => dispatchWhatsAppInvoice(client)}
                    className="bg-[#25D366] text-white flex items-center gap-1 text-xs font-black px-3 py-2 rounded-xl active:scale-95 transition-all shadow-xs"
                  >
                    <span>💬</span> WhatsApp
                  </button>
                  <button 
                    onClick={() => onDelete(client.id)} 
                    className="bg-rose-50 text-rose-600 hover:bg-rose-100 p-2 rounded-xl transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredData.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-xs font-bold text-gray-400">Kuch nahi mila! Search query ya filter check karein.</p>
          </div>
        )}
      </div>

      {/* PORTAL OVERLAY 1: THE REGISTRATION & EDITING FLOW FORM */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-[#fdf6e9] p-5 shadow-2xl border border-[#cca464]/30 space-y-4 max-h-[92vh] overflow-y-auto">
            <h4 className="font-black text-gray-800 text-base border-b border-gray-200 pb-2">
              {isEditing ? '📝 EDIT CLIENT PROFILE ORDER' : '📋 CLIENT SUIT ORDER REGISTRY'}
            </h4>
            
            <div className="space-y-3">
              {/* Identity Segment */}
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Customer Full Name</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm" placeholder="e.g. Asif Ali" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">WhatsApp Mobile (923... Format)</label>
                <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm" placeholder="e.g. 923001234567" />
              </div>

              {/* Status and Custom Dates segment */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Order Status</label>
                  <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 bg-white font-black text-xs text-gray-700">
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Delivery Date</label>
                  <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full p-2 rounded-xl border border-gray-200 bg-white font-bold text-xs text-center" />
                </div>
              </div>

              {/* Quantity Counter & Priority Framework */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Total Suits</label>
                  <div className="flex items-center bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button type="button" onClick={() => setSuitCount(Math.max(1, suitCount - 1))} className="px-3 py-2 bg-gray-100 font-black text-gray-600 text-sm active:bg-gray-200">-</button>
                    <span className="flex-1 text-center font-black text-sm text-gray-800">{suitCount}</span>
                    <button type="button" onClick={() => setSuitCount(suitCount + 1)} className="px-3 py-2 bg-gray-100 font-black text-gray-600 text-sm active:bg-gray-200">+</button>
                  </div>
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-gray-200 select-none">
                    <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} className="w-4 h-4 accent-rose-600 rounded" />
                    <span className="text-xs font-black text-gray-700">Urgent Order</span>
                  </label>
                </div>
              </div>

              {/* Split Optional Ledger Section */}
              <div className="bg-white p-3 rounded-2xl border border-dashed border-[#cca464]/40 bg-amber-50/20 space-y-2">
                <p className="text-[10px] font-black text-[#8a6d3b] uppercase tracking-wider">🪡 Split Optional Billing Matrix</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <input type="number" placeholder="Silayi" value={silayiPrice} onChange={(e) => setSilayiPrice(e.target.value)} className="w-full p-2 text-xs rounded-lg border bg-white font-bold text-center" />
                  <input type="number" placeholder="Paincha K." value={pKarhayiPrice} onChange={(e) => setPKarhayiPrice(e.target.value)} className="w-full p-2 text-xs rounded-lg border bg-white font-bold text-center" />
                  <input type="number" placeholder="Galla K." value={gKarhayiPrice} onChange={(e) => setGKarhayiPrice(e.target.value)} className="w-full p-2 text-xs rounded-lg border bg-white font-bold text-center" />
                </div>
                
                {/* Real-time Math Feedback Feeder */}
                <div className="pt-2 border-t border-gray-100 grid grid-cols-2 text-left gap-1 text-[11px] font-black text-gray-600">
                  <div>Bill: <span className="text-gray-900">Rs. {currentTotalBill}</span></div>
                  <div>Udhaar: <span className={currentUdhaar > 0 ? "text-rose-600" : "text-emerald-600"}>Rs. {currentUdhaar}</span></div>
                </div>

                <input type="number" placeholder="Received Paid Amount (Rs.)" value={receivedAmount} onChange={(e) => setReceivedAmount(e.target.value)} className="w-full p-2.5 text-sm rounded-xl border bg-white font-black text-emerald-700 placeholder-emerald-400" />
              </div>

              {/* Save Framework Matrix Trigger */}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={executeSaveClient} className="flex-1 bg-emerald-600 active:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-sm shadow-md transition-colors">
                  {isEditing ? 'Update Profile' : 'Save Registry'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-200 text-gray-700 font-black px-4 py-2.5 rounded-xl text-sm active:bg-gray-300">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL OVERLAY 2: SPECIFICATIONS VAULT WITH INLINE STATUS GUIDE */}
      {showNaapModal && selectedClient && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border-t-8 border-amber-500 space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <h4 className="font-black text-gray-800 text-base">📏 SIZE SPECIFICATIONS VAULT</h4>
              <p className="text-xs font-bold text-amber-600">Client Profile: {selectedClient.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
              {Object.keys(naapForm).map((key) => (
                <div key={key} className="focus-within:ring-2 focus-within:ring-amber-400 rounded-xl p-1 transition-all">
                  <label className="text-[10px] font-black text-gray-400 capitalize block mb-0.5">{key}</label>
                  <input 
                    type="text" 
                    value={naapForm[key]} 
                    onFocus={() => setActiveGuideText(`💡 ${guides[key] || "Tape ko bilkul straight aur tight rakhein."}`)}
                    onChange={(e) => setNaapForm({ ...naapForm, [key]: e.target.value })} 
                    className="w-full p-2 rounded-xl border border-gray-200 bg-white text-center font-black text-sm text-gray-800 focus:outline-none"
                    placeholder="--"
                  />
                </div>
              ))}
            </div>

            {/* Permanent Contextual Live Master Guide Bar (Zero alerts) */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 min-h-[50px] flex items-center">
              <p className="text-[11px] font-bold text-[#8a6d3b] leading-tight transition-all duration-200">
                {activeGuideText}
              </p>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={executeSaveNaap} className="flex-1 bg-amber-500 text-white font-black py-2.5 rounded-xl text-sm shadow-md active:bg-amber-600 transition-colors">
                Save Naap Spec
              </button>
              <button type="button" onClick={() => setShowNaapModal(false)} className="bg-gray-100 text-gray-700 font-black px-4 py-2.5 rounded-xl text-sm active:bg-gray-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
