      {/* 🏛️ ULTRA-MODERN NEON GOLD GLOW HEADER BAR - NO MORE TRUNCATION */}
      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl px-3 py-2.5 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="w-full max-w-md mx-auto flex justify-between items-center">
          
          {/* 👑 LEFT PANEL (65% Width Lock for Full Name and Neon Glow) */}
          <div className="w-[65%] flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-slate-950 border border-white/10 p-0.5 flex flex-shrink-0 items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.2)] overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Core Icon" 
                className="h-full w-full object-cover scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-lg hidden">✂️</span>
            </div>
            
            <div className="leading-tight min-w-0 flex-1">
              {/* ✨ KING-SIZE NEON GOLD GLOW BRAND NAME */}
              <h1 className="text-[13px] font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 uppercase filter drop-shadow-[0_0_6px_rgba(234,179,8,0.6)] break-words whitespace-normal">
                WASEEM GUL BAGHOOR
              </h1>
              
              {/* 🟢 INTERACTIVE WHATSAPP TRIGGER WITH PULSE EFFECT */}
              <a 
                href="https://wa.me/923007614329" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 mt-0.5 group focus:outline-none"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black text-emerald-400 tracking-wide group-hover:text-emerald-300 transition-colors">
                  03007614329
                </span>
              </a>
            </div>
          </div>

          {/* 📍 RIGHT PANEL (35% Width Lock - Micro Compressed Location Matrix) */}
          <div className="w-[35%] text-right flex items-start justify-end gap-1">
            <span className="text-[10px] text-amber-400 mt-0.5 flex-shrink-0 animate-pulse">📍</span>
            <div className="flex flex-col text-left leading-none max-w-full">
              <span className="text-[7.5px] font-black tracking-wide text-slate-300 uppercase block leading-tight break-words">
                MAIN BAZAR, ADHI KOT
              </span>
              <span className="text-[7px] font-black tracking-wider text-slate-500 uppercase mt-0.5 block leading-tight break-words">
                SYED MARKET (LAST SHOP)
              </span>
            </div>
          </div>

        </div>
      </header>
