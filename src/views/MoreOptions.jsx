import React, { useState } from 'react'
import { Download, Upload, Trash2, Database, ShieldAlert } from 'lucide-react'

export default function MoreOptions() {
  const [restoreText, setRestoreText] = useState('')
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' })

  // 1. Export Backup Matrix (Saare localStorages ko ek single pack mein badalna)
  const handleExportBackup = () => {
    try {
      const backupData = {
        gt_clients: JSON.parse(localStorage.getItem('gt_clients') || '[]'),
        gt_ctxns: JSON.parse(localStorage.getItem('gt_ctxns') || '[]'),
        gt_workers: JSON.parse(localStorage.getItem('gt_workers') || '[]'),
        gt_wentries: JSON.parse(localStorage.getItem('gt_wentries') || '[]'),
        gt_wholesalers: JSON.parse(localStorage.getItem('gt_wholesalers') || '[]'),
        gt_ws_txns: JSON.parse(localStorage.getItem('gt_ws_txns') || '[]'),
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", `gul_tailors_backup_${new Date().toISOString().split('T')[0]}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()

      setStatusMessage({ text: 'Backup file download ho chuki hai! Isay mehfooz jagah save kar lein.', type: 'success' })
    } catch (err) {
      setStatusMessage({ text: 'Backup export karne mein masla aaya.', type: 'error' })
    }
  }

  // 2. Import / Restore Backup
  const handleRestoreBackup = () => {
    if (!restoreText.trim()) return

    try {
      const parsed = JSON.parse(restoreText)
      
      // Validation checkpoint ke file hamari hi hai ya nahi
      if (!parsed.gt_clients && !parsed.gt_workers) {
        setStatusMessage({ text: 'Galt backup format! Meharbani karke sahi JSON text paste karein.', type: 'error' })
        return
      }

      // Keys mapping to LocalStorage
      if (parsed.gt_clients) localStorage.setItem('gt_clients', JSON.stringify(parsed.gt_clients))
      if (parsed.gt_ctxns) localStorage.setItem('gt_ctxns', JSON.stringify(parsed.gt_ctxns))
      if (parsed.gt_workers) localStorage.setItem('gt_workers', JSON.stringify(parsed.gt_workers))
      if (parsed.gt_wentries) localStorage.setItem('gt_wentries', JSON.stringify(parsed.gt_wentries))
      if (parsed.gt_wholesalers) localStorage.setItem('gt_wholesalers', JSON.stringify(parsed.gt_wholesalers))
      if (parsed.gt_ws_txns) localStorage.setItem('gt_ws_txns', JSON.stringify(parsed.gt_ws_txns))

      setStatusMessage({ text: 'Data kamyabi se restore ho gaya hai! App reload karein.', type: 'success' })
      setRestoreText('')
    } catch (err) {
      setStatusMessage({ text: 'JSON text theek nahi hai. Paste kiye gaye data ko check karein.', type: 'error' })
    }
  }

  // 3. Danger Zone: System Reset
  const handleWipeDatabase = () => {
    if (window.confirm('Kya aap waqai poora data saaf karna chahte hain? Yeh action wapas nahi ho sakta!')) {
      localStorage.clear()
      setStatusMessage({ text: 'Saara data saaf ho chuka hai. Refresh karein.', type: 'error' })
      setTimeout(() => window.location.reload(), 1500)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Panel */}
      <div>
        <h2 className="text-lg font-serif font-bold text-[#1a1006]">System Settings</h2>
        <p className="text-[11px] text-black/50">App maintenance aur data backups ki advance settings.</p>
      </div>

      {/* Status Toaster Messages */}
      {statusMessage.text && (
        <div className={`p-3 rounded-xl text-xs font-medium border ${
          statusMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* Backup Export Section */}
      <div className="bg-[#fffdf7] border border-[#e2cfa0]/60 rounded-xl p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-[#9a7c44] uppercase tracking-wider flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5" /> Data Backup (Download)
        </h3>
        <p className="text-[11px] text-black/60 leading-relaxed">
          Apne clients ka naap, karigar ka khata aur saari transactions ki file mehfooz karne ke liye niche button par click karein.
        </p>
        <button 
          onClick={handleExportBackup}
          className="w-full bg-[#1a1006] text-[#e8b84b] text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 border border-white/10"
        >
          <Download className="w-4 h-4" /> Download Full JSON Backup
        </button>
      </div>

      {/* Backup Restore Section */}
      <div className="bg-[#fffdf7] border border-[#e2cfa0]/60 rounded-xl p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-[#9a7c44] uppercase tracking-wider flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5" /> Data Restore (Upload)
        </h3>
        <p className="text-[11px] text-black/60">
          Apni pehle se download ki hui backup file ka text nichay diye gaye box mein paste karke data wapas laayein.
        </p>
        <textarea 
          rows="3" 
          placeholder='{"gt_clients": [...] ...}'
          value={restoreText}
          onChange={(e) => setRestoreText(e.target.value)}
          className="w-full border border-black/10 rounded-lg p-2 text-[11px] bg-white font-mono focus:outline-[#c9952a]"
        />
        <button 
          onClick={handleRestoreBackup}
          className="w-full bg-[#c9952a] text-white text-xs font-bold py-2.5 rounded-lg"
        >
          Restore State Matrix
        </button>
      </div>

      {/* Danger Reset Zone */}
      <div className="bg-red-50/40 border border-red-200 rounded-xl p-4 space-y-2">
        <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" /> Danger Zone
        </h3>
        <p className="text-[10px] text-red-600/80">
          Yeh dabane se aap ke mobile se saare clients, naap, aur khate permanently delete ho jayein ge.
        </p>
        <button 
          onClick={handleWipeDatabase}
          className="bg-red-600 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-sm hover:bg-red-700 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Reset Whole Application
        </button>
      </div>

    </div>
  )
}
