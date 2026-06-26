import React, { useState } from 'react';
// 🔥 AI UTILITY IMPORT
import { parseTailoringInput } from '../geminiHelper';

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

  // 🔥 AI CUSTOM RAW TEXT INPUT STATE
  const [aiRawInput, setAiRawInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // 🎙️ NATIVE SPEECH ENGINE STATES
  const [isListening, setIsListening] = useState(false);

  // 🔥 SIZE VAULT VA VOICE & TEXT ISOLATION MATRIX
  const [sizeVaultRawInput, setSizeVaultRawInput] = useState('');
  const [isSizeVaultAiLoading, setIsSizeVaultAiLoading] = useState(false);
  const [isSizeVaultListening, setIsSizeVaultListening] = useState(false);

  // 🔥 Image Super-Compressor Pipeline States
  const [imagePreview, setImagePreview] = useState(null);
  const [naapImageBase64, setNaapImageBase64] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

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

  // 🔥 SAFE EXTRACTOR UTILITY FOR ULTRA BULLETPROOF MAPPING
  const extractValue = (obj, keysArray) => {
    if (!obj) return '';
    for (let key of keysArray) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        return String(obj[key]).trim();
      }
    }
    return '';
  };

  // 🔥 INTELLIGENT AI AUTO-FILL HANDLER (FOR MAIN REGISTER ORDER MODAL)
  const handleAiAutoFill = async (passedText = null) => {
    const textToParse = passedText !== null ? passedText : aiRawInput;
    if (!textToParse.trim()) {
      alert("⚠️ Meharbani kar ke pehle AI box mein kuch detail likhein ya boliein!");
      return;
    }
    try {
      setIsAiLoading(true);
      const parsedData = await parseTailoringInput(textToParse);
      
      if (parsedData) {
        if (parsedData.customer_name) setClientName(parsedData.customer_name);
        
        const matchedPhone = extractValue(parsedData, ['whatsapp_mobile', 'phone_number', 'mobile', 'phone']);
        if (matchedPhone) setClientPhone(matchedPhone);

        if (parsedData.total_suits) setSuitCount(Number(parsedData.total_suits) || 1);
        if (parsedData.order_status) setOrderStatus(parsedData.order_status);
        if (parsedData.delivery_date) setDeliveryDate(parsedData.delivery_date);
        if (parsedData.is_urgent !== undefined) setIsUrgent(!!parsedData.is_urgent);
        
        if (parsedData.silayi) setSilayiPrice(parsedData.silayi);
        if (parsedData.pKarhayi) setPKarhayiPrice(parsedData.pKarhayi);
        if (parsedData.gKarhayi) setGKarhayiPrice(parsedData.gKarhayi);

        const mSource = parsedData.measurements || parsedData;
        setNaapForm(prev => ({
          lambaai: extractValue(mSource, ['lambaai', 'length', 'lambai', 'لمبائی', 'لمبائ']) || prev.lambaai,
          teera: extractValue(mSource, ['teera', 'shoulder', 'tera', 'تیra', 'تیرا']) || prev.teera,
          baazu: extractValue(mSource, ['baazu', 'sleeves', 'bazu', 'baju', 'بازو']) || prev.baazu,
          ghera: extractValue(mSource, ['ghera', 'daman', 'gera', 'گھیرا']) || prev.ghera,
          shalwar: extractValue(mSource, ['shalwar', 'trouser', 'shalwar_length', 'شلوار']) || prev.shalwar,
          paincha: extractValue(mSource, ['paincha', 'poncha', 'pancha', 'paicha', 'پانچہ', 'پانچ', 'پونچا']) || prev.paincha,
          asan: extractValue(mSource, ['asan', 'asand', 'آسن', 'اسن']) || prev.asan,
          galla: extractValue(mSource, ['galla', 'collar', 'gala', 'گلا', 'گلہ']) || prev.galla
        }));

        alert("✅ AI ne data parse kar ke fields fill kar di hain!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // 🔥 SIZE SPECIFIC VAULT ENGINE AUTO-FILL (INSTANT STATE PATCHER)
  const handleSizeVaultAiAutoFill = async (passedText = null) => {
    const textToParse = passedText !== null ? passedText : sizeVaultRawInput;
    if (!textToParse.trim()) {
      alert("⚠️ Meharbani kar ke pehle Size Vault AI box mein naap likhein ya boliein!");
      return;
    }
    try {
      setIsSizeVaultAiLoading(true);
      setActiveGuideText('⚡ AI aap ke naap ko parse kar raha hai...');
      
      const parsedData = await parseTailoringInput(textToParse);
      
      if (parsedData) {
        // Fallback target layered normalization
        const mSource = parsedData.measurements && Object.keys(parsedData.measurements).length > 0 
          ? parsedData.measurements 
          : parsedData;

        // Functional State Batching Matrix to prevent stale state values
        setNaapForm(prevNaap => {
          const parsedLambaai = extractValue(mSource, ['lambaai', 'length', 'lambai', 'لمبائی', 'لمبائ']);
          const parsedTeera = extractValue(mSource, ['teera', 'shoulder', 'tera', 'تیra', 'تیرا']);
          const parsedBaazu = extractValue(mSource, ['baazu', 'sleeves', 'bazu', 'baju', 'بازو']);
          const parsedGhera = extractValue(mSource, ['ghera', 'daman', 'gera', 'گھیرا']);
          const parsedShalwar = extractValue(mSource, ['shalwar', 'trouser', 'shalwar_length', 'شلوار']);
          const parsedPaincha = extractValue(mSource, ['paincha', 'poncha', 'pancha', 'paicha', 'پانچہ', 'پانچ', 'پونچا']);
          const parsedAsan = extractValue(mSource, ['asan', 'asand', 'آسن', 'اسن']);
          const parsedGalla = extractValue(mSource, ['galla', 'collar', 'gala', 'گلا', 'گلہ']);

          return {
            lambaai: parsedLambaai !== '' ? parsedLambaai : prevNaap.lambaai,
            teera: parsedTeera !== '' ? parsedTeera : prevNaap.teera,
            baazu: parsedBaazu !== '' ? parsedBaazu : prevNaap.baazu,
            ghera: parsedGhera !== '' ? parsedGhera : prevNaap.ghera,
            shalwar: parsedShalwar !== '' ? parsedShalwar : prevNaap.shalwar,
            paincha: parsedPaincha !== '' ? parsedPaincha : prevNaap.paincha,
            asan: parsedAsan !== '' ? parsedAsan : prevNaap.asan,
            galla: parsedGalla !== '' ? parsedGalla : prevNaap.galla
          };
        });

        setActiveGuideText('✅ AI ne Size Vault ke fields fill kar diye hain!');
      } else {
        setActiveGuideText('❌ AI naap ko samajh nahi saka, dobara boliein.');
      }
    } catch (err) {
      console.error(err);
      setActiveGuideText('⚠️ Parsing matrix mismatch.');
    } finally {
      setIsSizeVaultAiLoading(false);
    }
  };

  // 🎙️ LIVE VOICE DICTATION HANDLERS
  const toggleVoiceListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("⚠️ Browser voice command support nahi karta.");
      return;
    }
    if (isListening) { setIsListening(false); return; }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'ur-PK';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      if (result.trim()) {
        setAiRawInput(result);
        handleAiAutoFill(result); 
      }
    };
    recognition.start();
  };

  const toggleSizeVaultVoiceListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("⚠️ Browser voice command support nahi karta.");
      return;
    }
    if (isSizeVaultListening) { setIsSizeVaultListening(false); return; }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'ur-PK';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsSizeVaultListening(true);
      setActiveGuideText('🎙️ Listening... Bolna shuru karein...');
    };
    recognition.onerror = () => setIsSizeVaultListening(false);
    recognition.onend = () => setIsSizeVaultListening(false);
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      if (result.trim()) {
        setSizeVaultRawInput(result); 
        handleSizeVaultAiAutoFill(result);
      }
    };
    recognition.start();
  };

  const getClientTotalReceived = (client) => {
    if (!client.payments || !Array.isArray(client.payments)) {
      return Number(client.received) || 0;
    }
    return client.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  };

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
    setClients(data.map((c) => (c.id === clientId ? { ...c, status: nextStatus } : c)));
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
    setAiRawInput('');
    setNaapForm({ lambaai: '', teera: '', baazu: '', ghera: '', shalwar: '', paincha: '', asan: '', galla: '' });
    setSelectedClient(null);
    setShowAddModal(true);
  };

  const executeSaveClient = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('⚠️ Error: Name aur Phone lazmi hain!');
      return;
    }

    if (isEditing) {
      setClients(data.map((c) =>
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
              status: orderStatus
            }
          : c
      ));
    } else {
      const today = new Date().toISOString().split('T')[0];
      setClients([{
        id: String(Date.now()),
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
        naap: naapForm,
        naapImage: '' 
      }, ...data]);
    }
    setShowAddModal(false);
  };

  const executeInjectRecoveryPayment = () => {
    const amountToInsert = Number(recoveryAmount) || 0;
    if (amountToInsert <= 0) return;

    setClients(data.map((c) => {
      if (c.id === selectedClient.id) {
        const currentLogs = c.payments && Array.isArray(c.payments) ? [...c.payments] : [{ amount: Number(c.received) || 0, date: c.orderDate || 'N/A', note: 'Initial Deposit' }];
        return { ...c, payments: [...currentLogs, { amount: amountToInsert, date: recoveryDate, note: 'Udhaar Recovery' }] };
      }
      return c;
    }));
    setRecoveryAmount('');
    setShowRecoveryModal(false);
  };

  const dispatchWhatsAppInvoice = (client) => {
    const calculatedTotal = ((Number(client.silayi) || 0) + (Number(client.pKarhayi) || 0) + (Number(client.gKarhayi) || 0)) * (Number(client.totalSuits) || 1);
    const balanceUdhaar = Math.max(0, calculatedTotal - getClientTotalReceived(client));
    const message = `Assalam-o-Alaikum *${client.name}*,\nGul Tailors Status Ledger:\nTotal Bill: Rs. ${calculatedTotal}\nBaqi Udhaar: Rs. ${balanceUdhaar}`;
    window.open(`https://api.whatsapp.com/send?phone=${client.phone.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const processAndCompressFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(800, img.width);
          canvas.height = canvas.width * (img.height / img.width);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
      };
    });
  };

  const handleNaapImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      setImagePreview(URL.createObjectURL(file));
      const compressed = await processAndCompressFile(file);
      setNaapImageBase64(compressed);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompressing(false);
    }
  };

  const openNaapManager = (client) => {
    setSelectedClient(client);
    setNaapForm(client.naap || { lambaai: '', teera: '', baazu: '', ghera: '', shalwar: '', paincha: '', asan: '', galla: '' });
    setNaapImageBase64(client.naapImage || '');
    setImagePreview(client.naapImage || null);
    setSizeVaultRawInput('');
    setActiveGuideText('💡 Kisi bhi field par tap karein tailoring instruction dekhne ke liye.');
    setShowNaapModal(true);
  };

  const executeSaveNaap = () => {
    setClients(data.map((c) => 
      c.id === selectedClient.id 
        ? { ...c, naap: naapForm, naapImage: naapImageBase64 } 
        : c
    ));
    setShowNaapModal(false);
  };

  const filteredData = data.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || client.phone.includes(searchQuery);
    if (!matchesSearch) return false;
    if (activeFilter === 'Urgent') return client.isUrgent && (client.status || 'Pending') === 'Pending';
    if (activeFilter === 'Udhaar') return ((((Number(client.silayi) || 0) + (Number(client.pKarhayi) || 0) + (Number(client.gKarhayi) || 0)) * (Number(client.totalSuits) || 1)) - getClientTotalReceived(client)) > 0;
    return true;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-3xl border border-white/5 shadow-lg backdrop-blur-xl">
        <div>
          <h3 className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200 uppercase">👥 CLIENTS VAULT ENGINE</h3>
          <p className="text-[10px] font-bold text-slate-500">Active Vault Folders: {data.length}</p>
        </div>
        <button onClick={openAddManager} className="bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl active:scale-95 transition-all">➕ Add Client Order</button>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-3 rounded-2xl text-center border border-white/5">
        <div>
          <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">Total Suits</span>
          <span className="text-xs font-black text-white">{metrics.totalSuits} Qty</span>
        </div>
        <div>
          <span className="text-[9px] font-black text-rose-400 block uppercase tracking-wider">🚨 Urgent</span>
          <span className="text-xs font-black text-rose-400">{metrics.urgentCount} Orders</span>
        </div>
        <div>
          <span className="text-[9px] font-black text-emerald-400 block uppercase tracking-wider">Total Udhaar</span>
          <span className="text-xs font-black text-emerald-400">Rs. {metrics.totalUdhaar.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* SEARCH FIELD */}
      <div className="relative">
        <input type="text" placeholder="🔍 Client ka Naam ya Phone number se dhundein..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-3 pl-4 pr-10 rounded-2xl border border-white/5 bg-slate-900/40 text-slate-200 font-bold text-xs focus:outline-none focus:border-yellow-500/50" />
      </div>

      {/* FILTER BUTTONS ROW */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button onClick={() => setActiveFilter('All')} className={`text-[10px] font-black px-4 py-2 rounded-xl ${activeFilter === 'All' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/40' : 'bg-slate-900/40 text-slate-400'}`}>📁 All Orders</button>
        <button onClick={() => setActiveFilter('Urgent')} className={`text-[10px] font-black px-4 py-2 rounded-xl ${activeFilter === 'Urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-slate-900/40 text-slate-400'}`}>🚨 Urgent Orders</button>
        <button onClick={() => setActiveFilter('Udhaar')} className={`text-[10px] font-black px-4 py-2 rounded-xl ${activeFilter === 'Udhaar' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-900/40 text-slate-400'}`}>📉 Baqi Udhaar</button>
      </div>

      {/* CLIENT CARDS LOOP */}
      <div className="space-y-3">
        {filteredData.map((client) => {
          const clientTotalBill = ((Number(client.silayi) || 0) + (Number(client.pKarhayi) || 0) + (Number(client.gKarhayi) || 0)) * (Number(client.totalSuits) || 1);
          const displayUdhaar = Math.max(0, clientTotalBill - getClientTotalReceived(client));
          const currentStatus = client.status || 'Pending';

          return (
            <div key={client.id} className="bg-slate-900/30 rounded-3xl p-4 border border-white/5 shadow-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-base text-slate-200 tracking-wide">{client.name}</h4>
                  <p className="text-xs text-slate-400">📞 {client.phone}</p>
                </div>
                <button onClick={() => toggleStatusDirectly(client.id, currentStatus)} className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${currentStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {currentStatus === 'Delivered' ? '📦 Delivered' : '⏳ Pending'}
                </button>
              </div>

              {/* SHEET VALUES */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-2.5 rounded-2xl border border-white/5 text-center">
                <div><span className="text-[9px] font-black text-slate-500 block">Suits</span><span className="text-xs font-black text-slate-300">{client.totalSuits} Qty</span></div>
                <div><span className="text-[9px] font-black text-slate-500 block">Total Bill</span><span className="text-xs font-black text-slate-300">Rs. {clientTotalBill}</span></div>
                <div><span className="text-[9px] font-black text-slate-500 block">Udhaar</span><span className="text-xs font-black text-rose-400">Rs. {displayUdhaar}</span></div>
              </div>

              {/* BOTTOM TRIGGERS */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openNaapManager(client)} className="bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl">📏 Size Vault</button>
                  <button onClick={() => openEditManager(client)} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 font-black text-xs px-3 py-2 rounded-xl">📝 Edit Profile</button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => dispatchWhatsAppInvoice(client)} className="bg-[#25D366]/10 text-[#25D366] text-xs font-black px-3 py-2 rounded-xl">💬 WhatsApp</button>
                  <button onClick={() => onDelete(client.id)} className="bg-rose-500/10 text-rose-400 p-2 rounded-xl">🗑️</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: RECOVERY MODAL */}
      {showRecoveryModal && selectedClient && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-white/10 p-5 space-y-4">
            <h4 className="font-black text-slate-200 text-sm">💸 UDHAAR TRANSACTION LEDGER</h4>
            <input type="number" placeholder="Amount (Rs.)" value={recoveryAmount} onChange={(e) => setRecoveryAmount(e.target.value)} className="w-full p-2.5 text-xs font-black rounded-xl border border-white/10 bg-slate-900 text-emerald-400 focus:outline-none" />
            <div className="flex gap-2">
              <button onClick={executeInjectRecoveryPayment} className="flex-1 bg-emerald-600 text-white font-black py-2 rounded-xl text-xs">Save Payment</button>
              <button onClick={() => setShowRecoveryModal(false)} className="bg-slate-800 text-slate-300 font-black px-4 py-2 rounded-xl text-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT PROFILE ORDER */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] p-5 shadow-2xl border border-white/10 space-y-4 max-h-[92vh] overflow-y-auto">
            <h4 className="font-black text-slate-200 text-sm">{isEditing ? '📝 EDIT CLIENT PROFILE' : '📋 NEW CLIENT REGISTRY'}</h4>

            {!isEditing && (
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-yellow-500/20 space-y-2">
                <div className="relative flex items-center">
                  <textarea rows="2" value={aiRawInput} onChange={(e) => setAiRawInput(e.target.value)} placeholder="Yahan detail likhein..." className="w-full p-2 pr-10 text-xs rounded-xl border border-white/5 bg-slate-900 text-slate-200 font-bold resize-none" />
                  <button type="button" onClick={toggleVoiceListening} className={`absolute right-2 p-2 rounded-lg ${isListening ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-yellow-400'}`}>{isListening ? '🛑' : '🎙️'}</button>
                </div>
                <button type="button" onClick={() => handleAiAutoFill()} className="w-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-black text-[11px] py-1.5 rounded-xl">✨ Magic Auto-Fill Form</button>
              </div>
            )}
            
            <div className="space-y-3">
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 text-slate-200 font-bold text-xs" placeholder="Customer Name" />
              <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 text-slate-200 font-bold text-xs" placeholder="WhatsApp Mobile" />
              
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Silayi" value={silayiPrice} onChange={(e) => setSilayiPrice(e.target.value)} className="p-2 text-xs rounded-lg border border-white/10 bg-slate-900 text-slate-200 font-bold text-center" />
                <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="p-2 text-xs rounded-lg border border-white/10 bg-slate-900 text-slate-300 text-center" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={executeSaveClient} className="flex-1 bg-emerald-600 text-white font-black py-2 rounded-xl text-xs">Save</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-slate-800 text-slate-300 font-black px-4 py-2 rounded-xl text-xs">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SIZE SPECIFICATIONS VAULT */}
      {showNaapModal && selectedClient && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-white/10 p-5 shadow-2xl border-t-8 border-yellow-500 space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <h4 className="font-black text-slate-200 text-base tracking-wide">📏 SIZE SPECIFICATIONS VAULT</h4>
              <p className="text-xs font-bold text-yellow-500 mt-0.5">Client Profile: {selectedClient.name}</p>
            </div>

            {/* AI MAGIC INPUT FOR SIZE VAULT */}
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-yellow-500/20 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-yellow-400 uppercase tracking-wider block">✨ AI Magic Input (Naap Mode)</label>
                {isSizeVaultAiLoading && <span className="text-[9px] text-yellow-500 animate-pulse font-bold">Parsing Naap...</span>}
              </div>
              
              <div className="relative flex items-center">
                <textarea
                  rows="2"
                  value={sizeVaultRawInput}
                  onChange={(e) => setSizeVaultRawInput(e.target.value)}
                  placeholder="Lambaai, teera, baazu wagera boliein..."
                  className="w-full p-2 pr-10 text-xs rounded-xl border border-white/5 bg-slate-900 text-slate-200 placeholder-slate-500 font-bold focus:outline-none focus:border-yellow-500/40 resize-none"
                />
                <button
                  type="button"
                  onClick={toggleSizeVaultVoiceListening}
                  className={`absolute right-2 p-2 rounded-lg transition-all active:scale-90 ${
                    isSizeVaultListening ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-slate-800 text-yellow-400'
                  }`}
                >
                  {isSizeVaultListening ? '🛑' : '🎙️'}
                </button>
              </div>
              
              <button
                type="button"
                disabled={isSizeVaultAiLoading || isSizeVaultListening}
                onClick={() => handleSizeVaultAiAutoFill()}
                className="w-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 font-black text-[11px] py-1.5 rounded-xl transition-transform"
              >
                {isSizeVaultAiLoading ? '⚡ Processing Naap Matrix...' : '✨ Magic Auto-Fill Naap'}
              </button>
            </div>
            
            {/* FIELDS GRID */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950/40 p-3 rounded-2xl border border-white/5">
              {Object.keys(naapForm).map((key) => (
                <div key={key} className="rounded-xl p-1">
                  <label className="text-[10px] font-black text-slate-400 capitalize block mb-0.5 tracking-wide">{key}</label>
                  <input 
                    type="text" 
                    value={naapForm[key]} 
                    onFocus={() => setActiveGuideText(`💡 ${guides[key] || "Tape ko bilkul straight rakhein."}`)}
                    onChange={(e) => setNaapForm({ ...naapForm, [key]: e.target.value })} 
                    className="w-full p-2 rounded-xl border border-white/10 bg-slate-900 text-center font-black text-sm text-yellow-400 focus:outline-none focus:border-yellow-500/30"
                    placeholder="--"
                  />
                </div>
              ))}
            </div>

            {/* CAMERA SYNC */}
            <div className="bg-slate-950/40 p-3 rounded-2xl border border-dashed border-white/10 space-y-3">
              <input type="file" accept="image/*" capture="environment" onChange={handleNaapImageChange} className="block w-full text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:bg-yellow-500 file:text-slate-950 cursor-pointer" />
              {imagePreview && <div className="border border-white/5 bg-slate-950 rounded-xl overflow-hidden max-h-40 flex justify-center items-center"><img src={imagePreview} alt="Preview" className="max-h-36 object-contain p-1" /></div>}
            </div>

            <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 min-h-[50px] flex items-center">
              <p className="text-[11px] font-bold text-slate-400 leading-tight">{activeGuideText}</p>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={executeSaveNaap} className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-black py-2.5 rounded-xl text-sm shadow-lg">Save Naap Spec</button>
              <button type="button" onClick={() => setShowNaapModal(false)} className="bg-slate-800 text-slate-300 font-black px-4 py-2.5 rounded-xl text-sm border border-white/5">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
