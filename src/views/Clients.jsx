import React, { useState } from 'react';

export default function Clients({ data, setClients, onDelete }) {
  // Modal controllers
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNaapModal, setShowNaapModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  
  // Udhaar Recovery History Modal State
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryAmount, setRecoveryAmount] = useState('');
  const [recoveryDate, setRecoveryDate] = useState(new Date().toISOString().split('T')[0]);

  // Search & Filter Controls Matrix
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); 

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

  const getClientTotalReceived = (client) => {
    if (!client.payments || !Array.isArray(client.payments)) {
      return Number(client.received) || 0;
    }
    return client.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  };

  // Real-time Metrics Calculations for the Top Strip
  const metrics = data.reduce((acc, curr) => {
    const totalBill = ((Number(curr.silayi) || 0) + (Number(curr.pKarhayi) || 0) + (Number(curr.gKarhayi) || 0)) * (Number(curr.totalSuits) || 1);
    const totalReceived = getClientTotalReceived(curr);
    const currentStatus = curr.status || 'Pending';
    
    acc.totalSuits += Number(curr.totalSuits) || 0;
    if (curr.isUrgent && currentStatus === 'Pending') acc.urgentCount += 1;
    acc.totalUdhaar += Math.max(0, totalBill - totalReceived);
    return acc;
  }, { totalSuits: 0, urgentCount: 0, totalUdhaar: 0 });

  const currentTotalBill = ((Number(silayiPrice) || 0) + (Number(pKarhayiPrice) || 0) + (Number(gKarhayiPrice) || 0)) * (Number(suitCount) || 1);

  const toggleStatusDirectly = (clientId, currentStatus) => {
    const nextStatus = currentStatus === 'Delivered' ? 'Pending' : 'Delivered';
    setClients((prevClients) =>
      prevClients.map((c) => (c.id === clientId ? { ...c, status: nextStatus } : c))
    );
  };

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
    setDeliveryDate(client.deliveryDate || '');
    setOrderStatus(client.status || 'Pending');
    setSelectedClient(client); 
    setShowAddModal(true);
  };

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
    setDeliveryDate('');
    setOrderStatus('Pending');
    setSelectedClient(null);
    setShowAddModal(true);
  };

  const executeSaveClient = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('⚠️ Error: Client Name aur Phone Number likhna lazmi hai!');
      return;
    }

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
                deliveryDate: deliveryDate,
                status: orderStatus,
                payments: c.payments || [{ amount: Number(c.received) || 0, date: c.orderDate || 'N/A', note: 'Initial Deposit' }]
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
        orderDate: today,
        deliveryDate: deliveryDate,
        status: orderStatus,
        payments: [], 
        naap: { lambaai: '', teera: '', baazu: '', ghera: '', shalwar: '', paincha: '', asan: '', galla: '' }
      };
      setClients((prevClients) => [newClientRecord, ...prevClients]);
    }

    setShowAddModal(false);
  };

  const executeInjectRecoveryPayment = () => {
    const amountToInsert = Number(recoveryAmount) || 0;
    if (amountToInsert <= 0) {
      alert('⚠️ Meharbani kar ke valid payment amount enter karein!');
      return;
    }

    setClients((prevClients) =>
      prevClients.map((c) => {
        if (c.id === selectedClient.id) {
          const currentLogs = c.payments && Array.isArray(c.payments) ? [...c.payments] : [{ amount: Number(c.received) || 0, date: c.orderDate || 'N/A', note: 'Initial Deposit' }];
          return {
            ...c,
            payments: [...currentLogs, { amount: amountToInsert, date: recoveryDate, note: 'Udhaar Recovery' }]
          };
        }
        return c;
      })
    );

    setRecoveryAmount('');
    setShowRecoveryModal(false);
  };

  const dispatchWhatsAppInvoice = (client) => {
    const calculatedTotal = ((Number(client.silayi) || 0) + (Number(client.pKarhayi) || 0) + (Number(client.gKarhayi) || 0)) * (Number(client.totalSuits) || 1);
    const totalReceived = getClientTotalReceived(client);
    const balanceUdhaar = Math.max(0, calculatedTotal - totalReceived);
    const cleanPhone = client.phone.replace(/\D/g, '');
    
    const message = `Assalam-o-Alaikum *${client.name}* Bhai,\n\nGul Tailors ki taraf se aap ke order ka status ledger ready hai:\n\n` +
      `📦 Total Suits: ${client.totalSuits}\n` +
      `${client.isUrgent ? '🚨 Order Type: Urgent Delivery\n' : ''}` +
      `📅 Order Date: ${client.orderDate || 'N/A'}\n` +
      `📅 Delivery Date: ${client.deliveryDate || 'N/A'}\n` +
      `⚡ Status: *${client.status || 'Pending'}*\n` +
      `💰 Total Bill: Rs. ${calculatedTotal}\n` +
      `💵 Total Paid Till Now: Rs. ${totalReceived}\n` +
      `📉 Baqi Udhaar Balance: *Rs. ${balanceUdhaar}*\n\n` +
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

  const openUdhaarLedger = (client) => {
    setSelectedClient(client);
    setRecoveryAmount('');
    setRecoveryDate(new Date().toISOString().split('T')[0]);
    setShowRecoveryModal(true);
  };

  const filteredData = data.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    const totalBill = ((Number(client.silayi) || 0) + (Number(client.pKarhayi) || 0) + (Number(client.gKarhayi) || 0)) * (Number(client.totalSuits) || 1);
    const totalReceived = getClientTotalReceived(client);
    const currentUdhaarCalculated = Math.max(0, totalBill - totalReceived);

    if (activeFilter === 'Urgent') return client.isUrgent && (client.status || 'Pending') === 'Pending';
    if (activeFilter === 'Udhaar') return currentUdhaarCalculated > 0;
    
    return true;
  });

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-xs font-black tracking-widest text-[#8a6d3b] uppercase">👥 CLIENTS ENGINE v3.5</h3>
          <p className="text-[10px] font-bold text-gray-400">Active Records: {data.length}</p>
        </div>
        <button 
          onClick={openAddManager} 
          className="bg-[#1f1610] text-[#cca464] font-black text-xs px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-md"
        >
          ➕ Add Client Order
        </button>
      </div>

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

      <div className="relative">
        <input 
          type="text" 
          placeholder="🔍 Client ka Naam ya Phone number se dhundein..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-4 pr-10 rounded-2xl border border-gray-100 bg-white font-bold text-xs shadow-xs focus:outline-none focus:border-amber-400 transition-colors"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-xs">✕</button>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button onClick={() => setActiveFilter('All')} className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap active:scale-95 ${activeFilter === 'All' ? 'bg-[#1f1610] text-[#cca464]' : 'bg-white text-gray-500 border border-gray-100'}`}>📁 All Orders</button>
        <button onClick={() => setActiveFilter('Urgent')} className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap active:scale-95 ${activeFilter === 'Urgent' ? 'bg-rose-500 text-white shadow-xs' : 'bg-white text-gray-500 border border-gray-100'}`}>🚨 Urgent Orders</button>
        <button onClick={() => setActiveFilter('Udhaar')} className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap active:scale-95 ${activeFilter === 'Udhaar' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-gray-500 border border-gray-100'}`}>📉 Baqi Udhaar</button>
      </div>

      <div className="space-y-3">
        {filteredData.map((client) => {
          const clientTotalBill = ((Number(client.silayi) || 0) + (Number(client.pKarhayi) || 0) + (Number(client.gKarhayi) || 0)) * (Number(client.totalSuits) || 1);
          const totalReceivedPaid = getClientTotalReceived(client);
          const displayUdhaar = Math.max(0, clientTotalBill - totalReceivedPaid);
          const currentStatus = client.status || 'Pending';

          const todayStr = new Date().toISOString().split('T')[0]; 
          const isOverdue = currentStatus === 'Pending' && client.deliveryDate && client.deliveryDate < todayStr;

          return (
            <div key={client.id} className={`bg-white rounded-3xl p-4 border shadow-sm space-y-3 relative overflow-hidden transition-all duration-300 ${isOverdue ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-gray-100'}`}>
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-base text-gray-800 tracking-wide">{client.name}</h4>
                    {client.isUrgent && currentStatus === 'Pending' && (
                      <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md animate-pulse">URGENT</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">📞 {client.phone}</p>
                  <p className={`text-[10px] font-bold mt-0.5 ${isOverdue ? 'text-rose-600 font-black' : 'text-gray-400'}`}>
                    📅 Delivery: {client.deliveryDate || 'Not Set'} {isOverdue && '⚠️ OVERDUE'}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => toggleStatusDirectly(client.id, currentStatus)}
                    className={`text-[10px] font-black px-3 py-1.5 rounded-xl transition-all active:scale-95 border ${currentStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}
                  >
                    {currentStatus === 'Delivered' ? '📦 Delivered' : '⏳ Pending'}
                  </button>
                  
                  <button
                    onClick={() => openUdhaarLedger(client)}
                    className={`text-[10px] font-black px-2.5 py-1 rounded-xl block border cursor-pointer select-none transition-all active:scale-95 ${
                      displayUdhaar > 0 
                        ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/70'
                    }`}
                  >
                    {displayUdhaar > 0 ? `Udhaar: Rs. ${displayUdhaar} 💸` : 'Clear ✅'}
                  </button>
                </div>
              </div>

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
                  <span className="text-[9px] font-black text-gray-400 block uppercase">Total Paid</span>
                  <span className="text-xs font-black text-emerald-600">Rs. {totalReceivedPaid}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openNaapManager(client)} className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all active:scale-95">📏 Size Vault</button>
                  <button onClick={() => openEditManager(client)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-black text-xs px-3 py-2 rounded-xl transition-colors active:scale-95">📝 Edit Profile</button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button onClick={() => dispatchWhatsAppInvoice(client)} className="bg-[#25D366] text-white flex items-center gap-1 text-xs font-black px-3 py-2 rounded-xl active:scale-95 transition-all shadow-xs"><span>💬</span> WhatsApp</button>
                  <button onClick={() => onDelete(client.id)} className="bg-rose-50 text-rose-600 hover:bg-rose-100 p-2 rounded-xl transition-colors">🗑️</button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {showRecoveryModal && selectedClient && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border-t-8 border-rose-500 space-y-4 max-h-[88vh] overflow-y-auto">
            <div>
              <h4 className="font-black text-gray-800 text-base">💸 UDHAAR TRANSACTION LEDGER</h4>
              <p className="text-xs font-bold text-gray-500">Customer: <span className="text-gray-900 font-black">{selectedClient.name}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-xl border text-center text-xs font-black">
              <div className="text-gray-700">Total Bill:<br/><span className="text-gray-900 text-sm">Rs. {((Number(selectedClient.silayi) || 0) + (Number(selectedClient.pKarhayi) || 0) + (Number(selectedClient.gKarhayi) || 0)) * (Number(selectedClient.totalSuits) || 1)}</span></div>
              <div className="text-rose-600">Baqi Udhaar:<br/><span className="text-rose-700 text-sm">Rs. {Math.max(0, (((Number(selectedClient.silayi) || 0) + (Number(selectedClient.pKarhayi) || 0) + (Number(selectedClient.gKarhayi) || 0)) * (Number(selectedClient.totalSuits) || 1)) - getClientTotalReceived(selectedClient))}</span></div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">📊 Past Payments Audit Logs</label>
              <div className="bg-gray-50/50 p-3 rounded-xl border border-dashed max-h-[140px] overflow-y-auto space-y-2">
                {selectedClient.payments && selectedClient.payments.length > 0 ? (
                  selectedClient.payments.map((log, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-2 rounded-lg border text-[11px] shadow-2xs">
                      <div>
                        <span className="font-black text-emerald-600">Rs. {log.amount}</span>
                        <span className="text-[9px] font-bold text-gray-400 ml-2">({log.note || 'Recovery'})</span>
                      </div>
                      <span className="font-bold text-gray-500">📅 {log.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-center bg-white p-2 rounded-lg border text-[11px]">
                    <div>
                      <span className="font-black text-emerald-600">Rs. {selectedClient.received || 0}</span>
                      <span className="text-[9px] font-bold text-gray-400 ml-2">(Initial Registry)</span>
                    </div>
                    <span className="font-bold text-gray-500">📅 {selectedClient.orderDate || 'N/A'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100 space-y-2">
              <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider">➕ Record New Installment</p>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  placeholder="Amount (Rs.)" 
                  value={recoveryAmount}
                  onChange={(e) => setRecoveryAmount(e.target.value)}
                  className="p-2.5 text-xs font-black rounded-xl border bg-white text-emerald-700" 
                />
                <input 
                  type="date" 
                  value={recoveryDate}
                  onChange={(e) => setRecoveryDate(e.target.value)}
                  className="p-2.5 text-xs font-bold rounded-xl border bg-white text-center text-gray-700" 
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={executeInjectRecoveryPayment} className="flex-1 bg-emerald-600 text-white font-black py-2.5 rounded-xl text-xs shadow-xs">
                Save Installment
              </button>
              <button onClick={() => setShowRecoveryModal(false)} className="bg-gray-100 text-gray-600 font-black px-4 py-2.5 rounded-xl text-xs">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-[#fdf6e9] p-5 shadow-2xl border border-[#cca464]/30 space-y-4 max-h-[92vh] overflow-y-auto">
            <h4 className="font-black text-gray-800 text-base border-b border-gray-200 pb-2">
              {isEditing ? '📝 EDIT CLIENT PROFILE ORDER' : '📋 CLIENT SUIT ORDER REGISTRY'}
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Customer Full Name</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm" placeholder="e.g. Asif Ali" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">WhatsApp Mobile (923... Format)</label>
                <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-sm" placeholder="e.g. 923001234567" />
              </div>

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

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Total Suits</label>
                  <div className="flex items-center bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button type="button" onClick={() => setSuitCount(Math.max(1, suitCount - 1))} className="px-3 py-2 bg-gray-100 font-black text-gray-600 text-sm">-</button>
                    <span className="flex-1 text-center font-black text-sm text-gray-800">{suitCount}</span>
                    <button type="button" onClick={() => setSuitCount(suitCount + 1)} className="px-3 py-2 bg-gray-100 font-black text-gray-600 text-sm">+</button>
                  </div>
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer p-2 bg-white rounded-xl border border-gray-200 select-none">
                    <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} className="w-4 h-4 accent-rose-600 rounded" />
                    <span className="text-xs font-black text-gray-700">Urgent Order</span>
                  </label>
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-dashed border-[#cca464]/40 bg-amber-50/20 space-y-2">
                <p className="text-[10px] font-black text-[#8a6d3b] uppercase tracking-wider">🪡 Split Optional Billing Matrix</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <input type="number" placeholder="Silayi" value={silayiPrice} onChange={(e) => setSilayiPrice(e.target.value)} className="w-full p-2 text-xs rounded-lg border bg-white font-bold text-center" />
                  <input type="number" placeholder="Paincha K." value={pKarhayiPrice} onChange={(e) => setPKarhayiPrice(e.target.value)} className="w-full p-2 text-xs rounded-lg border bg-white font-bold text-center" />
                  <input type="number" placeholder="Galla K." value={gKarhayiPrice} onChange={(e) => setGKarhayiPrice(e.target.value)} className="w-full p-2 text-xs rounded-lg border bg-white font-bold text-center" />
                </div>
                
                <div className="pt-2 border-t border-gray-100 grid grid-cols-2 text-left gap-1 text-[11px] font-black text-gray-600">
                  <div>Bill: <span className="text-gray-900">Rs. {currentTotalBill}</span></div>
                  <div>Udhaar: <span className={Math.max(0, currentTotalBill - (selectedClient ? getClientTotalReceived(selectedClient) : 0)) > 0 ? "text-rose-600" : "text-emerald-600"}>Rs. {Math.max(0, currentTotalBill - (selectedClient ? getClientTotalReceived(selectedClient) : 0))}</span></div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={executeSaveClient} className="flex-1 bg-emerald-600 text-white font-black py-2.5 rounded-xl text-sm shadow-md">
                  {isEditing ? 'Update Profile' : 'Save Registry'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-200 text-gray-700 font-black px-4 py-2.5 rounded-xl text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 min-h-[50px] flex items-center">
              <p className="text-[11px] font-bold text-[#8a6d3b] leading-tight">{activeGuideText}</p>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={executeSaveNaap} className="flex-1 bg-amber-500 text-white font-black py-2.5 rounded-xl text-sm shadow-md">Save Naap Spec</button>
              <button type="button" onClick={() => setShowNaapModal(false)} className="bg-gray-100 text-gray-700 font-black px-4 py-2.5 rounded-xl text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
