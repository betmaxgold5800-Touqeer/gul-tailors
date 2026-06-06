import React from 'react';

export default function Workers({ data, onEdit, onDelete }) {
  
  const triggerWorkerWhatsApp = (phone, name, payable) => {
    const baseUrl = "https://api.whatsapp.com/send";
    const text = `Assalam-o-Alaikum Master ${name} Sahib,\n\nGul Tailors dashboard par aap ka total khata update ho chuka hai. Aap ka baqi bacha commission balance Rs. ${payable} hai.\n\nShukriya!\n*Gul Tailors Engine*`;
    window.open(`${baseUrl}?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black tracking-widest text-[#8a6d3b] uppercase">
          🧳 KARIGAR & MASTERS DIRECTORY
        </h3>
        <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-black text-rose-800">
          Staff: {data.length}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-2xl border border-dashed border-gray-300 text-gray-400 font-bold">
          Koi karigar listed nahi hai.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((worker) => (
            <div key={worker.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-md flex flex-col justify-between gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-base text-gray-800 tracking-wide">{worker.name}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    🧵 Specialist: <span className="font-bold text-gray-700">{worker.specializedIn}</span> • Active Suits: <span className="text-amber-600 font-bold">{worker.activeSuits}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                    Payable: Rs. {worker.payable}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                <span className="text-xs font-mono font-bold text-gray-400">K-ID: #{worker.id}</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => triggerWorkerWhatsApp(worker.phone, worker.name, worker.payable)}
                    className="flex items-center gap-1 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black px-2.5 py-1.5 rounded-xl transition-transform active:scale-95 shadow-xs"
                  >
                    <span>💬</span> WhatsApp
                  </button>
                  <button 
                    onClick={() => onEdit(worker)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black px-2.5 py-1.5 rounded-xl transition-transform active:scale-95"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => onDelete(worker.id)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black px-2.5 py-1.5 rounded-xl transition-transform active:scale-95"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
