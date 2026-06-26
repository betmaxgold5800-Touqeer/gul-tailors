import React, { useState } from 'react';
// 🔥 AI UTILITY IMPORT (Safe Alignment)
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

  // 🔥 NEW STATE: SIZE VAULT VA VOICE & TEXT ISOLATION MATRIX
  const [sizeVaultRawInput, setSizeVaultRawInput] = useState('');
  const [isSizeVaultAiLoading, setIsSizeVaultAiLoading] = useState(false);
  const [isSizeVaultListening, setIsSizeVaultListening] = useState(false);

  // 🔥 SENIOR DEV MATRIX: Image Super-Compressor Pipeline States
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

  // 🔥 INTELLIGENT AI AUTO-FILL HANDLER
  const handleAiAutoFill = async (passedText = null) => {
    const textToParse = passedText || aiRawInput;
    if (!textToParse.trim()) {
      alert("⚠️ Meharbani kar ke pehle AI box mein kuch detail likhein ya boliein!");
      return;
    }
    try {
      setIsAiLoading(true);
      const parsedData = await parseTailoringInput(textToParse);
      
      if (parsedData) {
        if (parsedData.customer_name) setClientName(parsedData.customer_name);
        if (parsedData.dress_type) setAiRawInput(prev => prev + `\n[Dress: ${parsedData.dress_type}]`);
        if (parsedData.style_notes) setAiRawInput(prev => prev + `\n[Notes: ${parsedData.style_notes}]`);
        if (parsedData.delivery_date) setDeliveryDate(parsedData.delivery_date);
        
        // Handling deep state parsing safely
        if (parsedData.measurements) {
          setNaapForm({
            lambaai: parsedData.measurements.length || '',
            teera: parsedData.measurements.shoulder || '',
            baazu: parsedData.measurements.sleeves || '',
            ghera: parsedData.measurements.ghera || '',
            shalwar: parsedData.measurements.shalwar || '',
            paincha: parsedData.measurements.paincha || '',
            asan: parsedData.measurements.asan || '',
            galla: parsedData.measurements.galla || ''
          });
        }
        alert("✅ AI ne data parse kar ke fields fill kar di hain! Aik baar check kar lein.");
      } else {
        alert("❌ AI data ko sahi se samajh nahi saka, dobara koshish karein.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Extraction error setup failed.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // 🔥 NEW INTERFACE: SIZE VAULT SPECIFIC INTELLIGENT AI PARSER
  const handleSizeVaultAiAutoFill = async (passedText = null) => {
    const textToParse = passedText || sizeVaultRawInput;
    if (!textToParse.trim()) {
      alert("⚠️ Meharbani kar ke pehle Size Vault AI box mein kuch naap likhein ya boliein!");
      return;
    }
    try {
      setIsSizeVaultAiLoading(true);
      setActiveGuideText('⚡ AI aap ke naap ko parse kar raha hai...');
      const parsedData = await parseTailoringInput(textToParse);
      
      if (parsedData && parsedData.measurements) {
        setNaapForm({
          lambaai: parsedData.measurements.length || naapForm.lambaai,
          teera: parsedData.measurements.shoulder || naapForm.teera,
          baazu: parsedData.measurements.sleeves || naapForm.baazu,
          ghera: parsedData.measurements.ghera || naapForm.ghera,
          shalwar: parsedData.measurements.shalwar || naapForm.shalwar,
          paincha: parsedData.measurements.paincha || naapForm.paincha,
          asan: parsedData.measurements.asan || naapForm.asan,
          galla: parsedData.measurements.galla || naapForm.galla
        });
        setActiveGuideText('✅ AI ne Size Vault ke fields fill kar diye hain!');
        setSizeVaultRawInput('');
      } else if (parsedData && !parsedData.measurements) {
        // Fallback checks if the structure returns a flattened root model
        setNaapForm({
          lambaai: parsedData.lambaai || parsedData.length || naapForm.lambaai,
          teera: parsedData.teera || parsedData.shoulder || naapForm.teera,
          baazu: parsedData.baazu || parsedData.sleeves || naapForm.baazu,
          ghera: parsedData.ghera || naapForm.ghera,
          shalwar: parsedData.shalwar || naapForm.shalwar,
          paincha: parsedData.paincha || naapForm.paincha,
          asan: parsedData.asan || naapForm.asan,
          galla: parsedData.galla || naapForm.galla
        });
        setActiveGuideText('✅ AI ne Size Vault ke fields fill kar diye hain!');
        setSizeVaultRawInput('');
      } else {
        alert("❌ AI naap ko sahi se samajh nahi saka, dobara wazeh boliein.");
        setActiveGuideText('❌ AI parsing operation down.');
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Size Extraction error failed.");
    } finally {
      setIsSizeVaultAiLoading(false);
    }
  };

  // 🎙️ LIVE VOICE DICTATION HANDLER
  const toggleVoiceListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("⚠️ Aap ka browser voice command support nahi karta. Chrome ya Android browser use karein.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'ur-PK' || 'en-US'; // Best compatibility for mixed language dictation
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event) => {
      console.error("Speech error", event.error);
      setIsListening(false);
      alert(`🎙️ Mic issue: ${event.error}. Dobara koshish karein aur permission check karein.`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const speechToTextResult = event.results[0][0].transcript;
      if (speechToTextResult.trim()) {
        setAiRawInput(speechToTextResult);
        // Direct execution for friction-less operational flow
        handleAiAutoFill(speechToTextResult);
      }
    };

    recognition.start();
  };

  // 🔥 NEW VOICE DICTATION HANDLER FOR SPECIFIC SIZE VAULT MODAL
  const toggleSizeVaultVoiceListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("⚠️ Aap ka browser voice command support nahi karta. Chrome ya Android browser use karein.");
      return;
    }

    if (isSizeVaultListening) {
      setIsSizeVaultListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'ur-PK' || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsSizeVaultListening(true);
      setActiveGuideText('🎙️ Listening... Abhi naap bolna shuru karein...');
    };

    recognition.onerror = (event) => {
      console.error("Size Vault Speech error", event.error);
      setIsSizeVaultListening(false);
      setActiveGuideText(`🎙️ Mic error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsSizeVaultListening(false);
    };

    recognition.onresult = (event) => {
      const speechToTextResult = event.results[0][0].transcript;
      if (speechToTextResult.trim()) {
        setSizeVaultRawInput(speechToTextResult);
        handleSizeVaultAiAutoFill(speechToTextResult);
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

  // Direct Toggle with Guaranteed PascalCase Status
  const toggleStatusDirectly = (clientId, currentStatus) => {
    const nextStatus = currentStatus === 'Delivered' ? 'Pending' : 'Delivered';
    const targetArray = data.map((c) => (c.id === clientId ? { ...c, status: nextStatus } : c));
    setClients(targetArray);
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
    setAiRawInput(''); // Clear for crisp transition
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
      alert('⚠️ Error: Client Name aur Phone Number likhna lazmi hai!');
      return;
    }

    if (isEditing) {
      const updatedArray = data.map((c) =>
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
      );
      setClients(updatedArray);
    } else {
      const today = new Date().toISOString().split('T')[0];
      const newClientRecord = {
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
        naap: naapForm, // Carry down auto-filled specs smoothly
        naapImage: '' 
      };
      setClients([newClientRecord, ...data]);
    }

    setShowAddModal(false);
  };

  const executeInjectRecoveryPayment = () => {
    const amountToInsert = Number(recoveryAmount) || 0;
    if (amountToInsert <= 0) {
      alert('⚠️ Meharbani kar ke valid payment amount enter karein!');
      return;
    }

    const updatedArray = data.map((c) => {
      if (c.id === selectedClient.id) {
        const currentLogs = c.payments && Array.isArray(c.payments) ? [...c.payments] : [{ amount: Number(c.received) || 0, date: c.orderDate || 'N/A', note: 'Initial Deposit' }];
        return {
          ...c,
          payments: [...currentLogs, { amount: amountToInsert, date: recoveryDate, note: 'Udhaar Recovery' }]
        };
      }
      return c;
    });

    setClients(updatedArray);
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

  // Converts Image File to Super-Light Base64 String (<40KB)
  const processAndCompressFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; 
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const superCompressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
          resolve(superCompressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleNaapImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setActiveGuideText('⚡ Image ko super-compress kiya ja raha hai space bachanay ke liye...');
      setImagePreview(URL.createObjectURL(file));
      
      const compressedString = await processAndCompressFile(file);
      setNaapImageBase64(compressedString);
      
      setActiveGuideText('✅ Image target size (30KB-50KB) mein convert ho kar sync ho chuki hai!');
    } catch (error) {
      alert('⚠️ Image compress karne mein masla aaya: ' + error.message);
    } finally {
      setIsCompressing(false);
    }
  };

  const openNaapManager = (client) => {
    setSelectedClient(client);
    setNaapForm(client.naap || { lambaai: '', teera: '', baazu: '', ghera: '', shalwar: '', paincha: '', asan: '', galla: '' });
    setNaapImageBase64(client.naapImage || '');
    setImagePreview(client.naapImage || null);
    setSizeVaultRawInput(''); // Safe clean up on open
    
    setActiveGuideText('💡 Kisi bhi field par tap karein tailoring instruction dekhne ke liye.');
    setShowNaapModal(true);
  };

  const executeSaveNaap = () => {
    const updatedArray = data.map((c) => 
      c.id === selectedClient.id 
        ? { ...c, naap: naapForm, naapImage: naapImageBase64 } 
        : c
    );
    setClients(updatedArray);
    setShowNaapModal(false);
    setImagePreview(null);
    setNaapImageBase64('');
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
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-3xl border border-white/5 shadow-lg backdrop-blur-xl">
        <div>
          <h3 className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200 uppercase">👥 CLIENTS VAULT ENGINE</h3>
          <p className="text-[10px] font-bold text-slate-500">Active Vault Folders: {data.length}</p>
        </div>
        <button 
          onClick={openAddManager} 
          className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]"
        >
          ➕ Add Client Order
        </button>
      </div>

      {/* METRICS METRIC GRID */}
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
        <input 
          type="text" 
          placeholder="🔍 Client ka Naam ya Phone number se dhundein..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-4 pr-10 rounded-2xl border border-white/5 bg-slate-900/40 text-slate-200 font-bold text-xs focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all shadow-inner"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 font-bold text-xs">✕</button>
        )}
      </div>

      {/* FILTER BUTTONS ROW */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button onClick={() => setActiveFilter('All')} className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap active:scale-95 ${activeFilter === 'All' ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/40 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.1)]' : 'bg-slate-900/40 text-slate-400 border border-white/5'}`}>📁 All Orders</button>
        <button onClick={() => setActiveFilter('Urgent')} className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap active:scale-95 ${activeFilter === 'Urgent' ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 'bg-slate-900/40 text-slate-400 border border-white/5'}`}>🚨 Urgent Orders</button>
        <button onClick={() => setActiveFilter('Udhaar')} className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all whitespace-nowrap active:scale-95 ${activeFilter === 'Udhaar' ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'bg-slate-900/40 text-slate-400 border border-white/5'}`}>📉 Baqi Udhaar</button>
      </div>

      {/* CLIENT CARDS GRID LOOP */}
      <div className="space-y-3">
        {filteredData.map((client) => {
          const clientTotalBill = ((Number(client.silayi) || 0) + (Number(client.pKarhayi) || 0) + (Number(client.gKarhayi) || 0)) * (Number(client.totalSuits) || 1);
          const totalReceivedPaid = getClientTotalReceived(client);
          const displayUdhaar = Math.max(0, clientTotalBill - totalReceivedPaid);
          const currentStatus = client.status || 'Pending';

          const todayStr = new Date().toISOString().split('T')[0]; 
          const isOverdue = currentStatus === 'Pending' && client.deliveryDate && client.deliveryDate < todayStr;

          return (
            <div key={client.id} className={`bg-slate-900/30 rounded-3xl p-4 border shadow-xl space-y-3 relative overflow-hidden transition-all duration-300 ${isOverdue ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-white/5'}`}>
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-base text-slate-200 tracking-wide">{client.name}</h4>
                    {client.isUrgent && currentStatus === 'Pending' && (
                      <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md animate-pulse">URGENT</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">📞 {client.phone}</p>
                  <p className={`text-[10px] font-bold mt-0.5 ${isOverdue ? 'text-rose-400 font-black' : 'text-slate-500'}`}>
                    📅 Delivery: {client.deliveryDate || 'Not Set'} {isOverdue && '⚠️ OVERDUE'}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => toggleStatusDirectly(client.id, currentStatus)}
                    className={`text-[10px] font-black px-3 py-1.5 rounded-xl transition-all active:scale-95 border ${currentStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]'}`}
                  >
                    {currentStatus === 'Delivered' ? '📦 Delivered' : '⏳ Pending'}
                  </button>
                  
                  <button
                    onClick={() => openUdhaarLedger(client)}
                    className={`text-[10px] font-black px-2.5 py-1 rounded-xl block border cursor-pointer select-none transition-all active:scale-95 ${
                      displayUdhaar > 0 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                    }`}
                  >
                    {displayUdhaar > 0 ? `Udhaar: Rs. ${displayUdhaar.toLocaleString('en-IN')} 💸` : 'Clear ✅'}
                  </button>
                </div>
              </div>

              {/* SHEET CARD VALUES */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-2.5 rounded-2xl border border-white/5 text-center">
                <div>
                  <span className="text-[9px] font-black text-slate-500 block uppercase tracking-wider">Suits</span>
                  <span className="text-xs font-black text-slate-300">{client.totalSuits} Qty</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 block uppercase tracking-wider">Total Bill</span>
                  <span className="text-xs font-black text-slate-300">Rs. {clientTotalBill.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 block uppercase tracking-wider">Total Paid</span>
                  <span className="text-xs font-black text-emerald-400">Rs. {totalReceivedPaid.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* CARD OPERATIONS TRIGGER STRIP */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openNaapManager(client)} className="bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all active:scale-95 shadow-md">📏 Size Vault</button>
                  <button onClick={() => openEditManager(client)} className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 font-black text-xs px-3 py-2 rounded-xl transition-colors active:scale-95">📝 Edit Profile</button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button onClick={() => dispatchWhatsAppInvoice(client)} className="bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 flex items-center gap-1 text-xs font-black px-3 py-2 rounded-xl active:scale-95 transition-all shadow-md hover:bg-[#25D366]/20"><span>💬</span> WhatsApp</button>
                  <button onClick={() => onDelete(client.id)} className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 p-2 rounded-xl transition-colors">🗑️</button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL 1: RECOVERY MODAL SETUP */}
      {showRecoveryModal && selectedClient && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-white/10 p-5 shadow-2xl border-t-8 border-rose-500 space-y-4 max-h-[88vh] overflow-y-auto">
            <div>
              <h4 className="font-black text-slate-200 text-base tracking-wide">💸 UDHAAR TRANSACTION LEDGER</h4>
              <p className="text-xs font-bold text-slate-400 mt-0.5">Customer: <span className="text-yellow-400 font-black">{selectedClient.name}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-white/5 text-center text-xs font-black">
              <div className="text-slate-400">Total Bill:<br/><span className="text-slate-200 text-sm">Rs. {(((Number(selectedClient.silayi) || 0) + (Number(selectedClient.pKarhayi) || 0) + (Number(selectedClient.gKarhayi) || 0)) * (Number(selectedClient.totalSuits) || 1)).toLocaleString('en-IN')}</span></div>
              <div className="text-rose-400">Baqi Udhaar:<br/><span className="text-rose-400 text-sm">Rs. {Math.max(0, (((Number(selectedClient.silayi) || 0) + (Number(selectedClient.pKarhayi) || 0) + (Number(selectedClient.gKarhayi) || 0)) * (Number(selectedClient.totalSuits) || 1)) - getClientTotalReceived(selectedClient)).toLocaleString('en-IN')}</span></div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">📊 Past Payments Audit Logs</label>
              <div className="bg-slate-950/30 p-3 rounded-xl border border-white/5 border-dashed max-h-[140px] overflow-y-auto space-y-2">
                {selectedClient.payments && selectedClient.payments.length > 0 ? (
                  selectedClient.payments.map((log, index) => (
                    <div key={index} className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg border border-white/5 text-[11px] shadow-sm">
                      <div>
                        <span className="font-black text-emerald-400">Rs. {log.amount.toLocaleString('en-IN')}</span>
                        <span className="text-[9px] font-bold text-slate-500 ml-2">({log.note || 'Recovery'})</span>
                      </div>
                      <span className="font-bold text-slate-400">📅 {log.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg border border-white/5 text-[11px]">
                    <div>
                      <span className="font-black text-emerald-400">Rs. {(Number(selectedClient.received) || 0).toLocaleString('en-IN')}</span>
                      <span className="text-[9px] font-bold text-slate-500 ml-2">(Initial Registry)</span>
                    </div>
                    <span className="font-bold text-slate-400">📅 {selectedClient.orderDate || 'N/A'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-950/40 p-3 rounded-2xl border border-white/5 space-y-2">
              <p className="text-[10px] font-black text-yellow-500 uppercase tracking-wider">➕ Record New Installment</p>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  placeholder="Amount (Rs.)" 
                  value={recoveryAmount}
                  onChange={(e) => setRecoveryAmount(e.target.value)}
                  className="p-2.5 text-xs font-black rounded-xl border border-white/10 bg-slate-900 text-emerald-400 focus:outline-none focus:border-emerald-500" 
                />
                <input 
                  type="date" 
                  value={recoveryDate}
                  onChange={(e) => setRecoveryDate(e.target.value)}
                  className="p-2.5 text-xs font-bold rounded-xl border border-white/10 bg-slate-900 text-center text-slate-300 focus:outline-none" 
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={executeInjectRecoveryPayment} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-xs shadow-md transition-colors">
                Save Installment
              </button>
              <button onClick={() => setShowRecoveryModal(false)} className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-black px-4 py-2.5 rounded-xl text-xs border border-white/5">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT PROFILE ORDER DIAGRAM */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] p-5 shadow-2xl border border-white/10 space-y-4 max-h-[92vh] overflow-y-auto">
            <h4 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 text-base border-b border-white/5 pb-2 tracking-wide">
              {isEditing ? '📝 EDIT CLIENT PROFILE ORDER' : '📋 CLIENT SUIT ORDER REGISTRY'}
            </h4>

            {/* 🔥 INTEGRATED REVOLUTIONARY AI BOX FOR QUICK TEXT PARSING */}
            {!isEditing && (
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-yellow-500/20 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-yellow-400 uppercase tracking-wider block">✨ AI Magic Input (Roman Urdu/English)</label>
                  {isAiLoading && <span className="text-[9px] text-yellow-500 animate-pulse font-bold">Parsing Data...</span>}
                </div>
                
                {/* 🎙️ MODERN VOICE-ENABLED INPUT GRID CONTAINER */}
                <div className="relative flex items-center">
                  <textarea
                    rows="2"
                    value={aiRawInput}
                    onChange={(e) => setAiRawInput(e.target.value)}
                    placeholder={isListening ? "Listening... Abhi bolna shuru karein..." : "Yahan likhein ya mic icon dabayein..."}
                    className="w-full p-2 pr-10 text-xs rounded-xl border border-white/5 bg-slate-900/80 text-slate-200 placeholder-slate-500 font-bold focus:outline-none focus:border-yellow-500/40 resize-none transition-all duration-300"
                  />
                  {/* GLOWING GLASSMORPHISM MIC TRIGGER */}
                  <button
                    type="button"
                    onClick={toggleVoiceListening}
                    className={`absolute right-2 p-2 rounded-lg transition-all active:scale-90 ${
                      isListening 
                        ? 'bg-rose-500/20 border border-rose-500/60 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse' 
                        : 'bg-slate-800 border border-white/5 text-yellow-400 hover:text-yellow-300 shadow-md'
                    }`}
                  >
                    {isListening ? '🛑' : '🎙️'}
                  </button>
                </div>
                
                <button
                  type="button"
                  disabled={isAiLoading || isListening}
                  onClick={() => handleAiAutoFill()}
                  className="w-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 font-black text-[11px] py-1.5 rounded-xl active:scale-95 transition-transform disabled:opacity-40"
                >
                  {isAiLoading ? '⚡ Processing Vector Matrix...' : '✨ Magic Auto-Fill Form'}
                </button>
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">Customer Full Name</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 text-slate-200 font-bold text-sm focus:outline-none focus:border-yellow-500/40" placeholder="e.g. Asif Ali" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">WhatsApp Mobile (923... Format)</label>
                <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 text-slate-200 font-bold text-sm focus:outline-none focus:border-yellow-500/40" placeholder="e.g. 923001234567" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">Order Status</label>
                  <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900 font-black text-xs text-slate-300 focus:outline-none">
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">Delivery Date</label>
                  <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full p-2 rounded-xl border border-white/10 bg-slate-900 text-slate-300 font-bold text-xs text-center focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-wider">Total Suits</label>
                  <div className="flex items-center bg-slate-900 rounded-xl border border-white/10 overflow-hidden">
                    <button type="button" onClick={() => setSuitCount(Math.max(1, suitCount - 1))} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 font-black text-slate-300 text-sm">-</button>
                    <span className="flex-1 text-center font-black text-sm text-slate-200">{suitCount}</span>
                    <button type="button" onClick={() => setSuitCount(suitCount + 1)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 font-black text-slate-300 text-sm">+</button>
                  </div>
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer p-2 bg-slate-900 rounded-xl border border-white/10 select-none">
                    <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} className="w-4 h-4 accent-rose-500 rounded bg-slate-950 border-white/10" />
                    <span className="text-xs font-black text-slate-300">Urgent Order</span>
                  </label>
                </div>
              </div>

              <div className="bg-slate-950/40 p-3 rounded-2xl border border-dashed border-yellow-500/30 space-y-2">
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-wider">🪡 Split Optional Billing Matrix</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <input type="number" placeholder="Silayi" value={silayiPrice} onChange={(e) => setSilayiPrice(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-white/10 bg-slate-900 text-slate-200 font-bold text-center focus:outline-none" />
                  <input type="number" placeholder="Paincha K." value={pKarhayiPrice} onChange={(e) => setPKarhayiPrice(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-white/10 bg-slate-900 text-slate-200 font-bold text-center focus:outline-none" />
                  <input type="number" placeholder="Galla K." value={gKarhayiPrice} onChange={(e) => setGKarhayiPrice(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-white/10 bg-slate-900 text-slate-200 font-bold text-center focus:outline-none" />
                </div>
                
                <div className="pt-2 border-t border-white/5 grid grid-cols-2 text-left gap-1 text-[11px] font-black text-slate-400">
                  <div>Bill: <span className="text-slate-200">Rs. {currentTotalBill.toLocaleString('en-IN')}</span></div>
                  <div>Udhaar: <span className={Math.max(0, currentTotalBill - (selectedClient ? getClientTotalReceived(selectedClient) : 0)) > 0 ? "text-rose-400" : "text-emerald-400"}>Rs. {Math.max(0, currentTotalBill - (selectedClient ? getClientTotalReceived(selectedClient) : 0)).toLocaleString('en-IN')}</span></div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={executeSaveClient} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-sm shadow-md transition-colors">
                  {isEditing ? 'Update Profile' : 'Save Registry'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-black px-4 py-2.5 rounded-xl text-sm border border-white/5">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SIZE SPECIFICATIONS VAULT */}
      {showNaapModal && selectedClient && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-white/10 p-5 shadow-2xl border-t-8 border-yellow-500 space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <h4 className="font-black text-slate-200 text-base tracking-wide">📏 SIZE SPECIFICATIONS VAULT</h4>
              <p className="text-xs font-bold text-yellow-500 mt-0.5">Client Profile: {selectedClient.name}</p>
            </div>

            {/* 🔥 NEW INTEGRATED REVOLUTIONARY AI BOX SPECIFIC FOR SIZE VAULT MODAL */}
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-yellow-500/20 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-yellow-400 uppercase tracking-wider block">✨ AI Magic Input (Naap Mode)</label>
                {isSizeVaultAiLoading && <span className="text-[9px] text-yellow-500 animate-pulse font-bold">Parsing Naap...</span>}
              </div>
              
              {/* 🎙️ VOICE CONTROL GRID FOR SIZE FIELDS */}
              <div className="relative flex items-center">
                <textarea
                  rows="2"
                  value={sizeVaultRawInput}
                  onChange={(e) => setSizeVaultRawInput(e.target.value)}
                  placeholder={isSizeVaultListening ? "Listening... Abhi naap boleinge..." : "Lambaai, teera, baazu wagera boliein..."}
                  className="w-full p-2 pr-10 text-xs rounded-xl border border-white/5 bg-slate-900/80 text-slate-200 placeholder-slate-500 font-bold focus:outline-none focus:border-yellow-500/40 resize-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={toggleSizeVaultVoiceListening}
                  className={`absolute right-2 p-2 rounded-lg transition-all active:scale-90 ${
                    isSizeVaultListening 
                      ? 'bg-rose-500/20 border border-rose-500/60 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse' 
                      : 'bg-slate-800 border border-white/5 text-yellow-400 hover:text-yellow-300 shadow-md'
                  }`}
                >
                  {isSizeVaultListening ? '🛑' : '🎙️'}
                </button>
              </div>
              
              <button
                type="button"
                disabled={isSizeVaultAiLoading || isSizeVaultListening}
                onClick={() => handleSizeVaultAiAutoFill()}
                className="w-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 font-black text-[11px] py-1.5 rounded-xl active:scale-95 transition-transform disabled:opacity-40"
              >
                {isSizeVaultAiLoading ? '⚡ Processing Naap Matrix...' : '✨ Magic Auto-Fill Naap'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 bg-slate-950/40 p-3 rounded-2xl border border-white/5">
              {Object.keys(naapForm).map((key) => (
                <div key={key} className="focus-within:ring-1 focus-within:ring-yellow-500/40 rounded-xl p-1 transition-all">
                  <label className="text-[10px] font-black text-slate-400 capitalize block mb-0.5 tracking-wide">{key}</label>
                  <input 
                    type="text" 
                    value={naapForm[key]} 
                    onFocus={() => setActiveGuideText(`💡 ${guides[key] || "Tape ko bilkul straight aur tight rakhein."}`)}
                    onChange={(e) => setNaapForm({ ...naapForm, [key]: e.target.value })} 
                    className="w-full p-2 rounded-xl border border-white/10 bg-slate-900 text-center font-black text-sm text-yellow-400 focus:outline-none focus:border-yellow-500/30"
                    placeholder="--"
                  />
                </div>
              ))}
            </div>

            {/* CAMERA & IMAGE BOX INTEGRATION INSIDE VAULT */}
            <div className="bg-slate-950/40 p-3 rounded-2xl border border-dashed border-white/10 space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">
                📸 Register Page Photo Link ({isCompressing ? 'Compressing...' : 'Ready'})
              </label>
              
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handleNaapImageChange}
                disabled={isCompressing}
                className="block w-full text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-black file:bg-yellow-500 file:text-slate-950 cursor-pointer disabled:opacity-40"
              />

              {imagePreview && (
                <div className="relative border border-white/5 bg-slate-950 rounded-xl overflow-hidden max-h-40 flex justify-center items-center">
                  <img src={imagePreview} alt="Naap Matrix Visual" className="max-h-36 object-contain p-1" />
                  <button 
                    type="button" 
                    onClick={() => { setImagePreview(null); setNaapImageBase64(''); }} 
                    className="absolute top-1 right-1 bg-rose-600/80 hover:bg-rose-700 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 min-h-[50px] flex items-center">
              <p className="text-[11px] font-bold text-slate-400 leading-tight">{activeGuideText}</p>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={executeSaveNaap} disabled={isCompressing} className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-black py-2.5 rounded-xl text-sm shadow-lg active:scale-95 transition-transform disabled:opacity-40">Save Naap Spec</button>
              <button type="button" onClick={() => setShowNaapModal(false)} className="bg-slate-800 text-slate-300 font-black px-4 py-2.5 rounded-xl text-sm border border-white/5">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
