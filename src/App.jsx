import React, { useState } from 'react'
import { Home, Users, Briefcase, ShoppingBag, MoreHorizontal } from 'lucide-react'
import Dashboard from './views/Dashboard'
import Clients from './views/Clients'
import Workers from './views/Workers'
import Wholesalers from './views/Wholesalers'
import MoreOptions from './views/MoreOptions' // System Settings Import ki

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'workers', label: 'Workers', icon: Briefcase },
    { id: 'wholesalers', label: 'WS', icon: ShoppingBag },
    { id: 'more', label: 'Aur', icon: MoreHorizontal },
  ]

  // Centralized Page Switch Matrix Router
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'clients':
        return <Clients />
      case 'workers':
        return <Workers />
      case 'wholesalers':
        return <Wholesalers />
      case 'more':
        return <MoreOptions /> // Final utility matrix component link kar diya
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdf6e9] text-[#1a1006] font-sans selection:bg-[#e8b84b]">
      
      {/* Premium Top Bar */}
      <header className="bg-[#1a1006] px-4 py-3 sticky top-0 z-50 flex items-center justify-between border-b border-[#e2cfa0]/10 shadow-md">
        <h1 className="text-[#e8b84b] font-serif text-lg font-bold tracking-wide flex items-center gap-2">
          <span>✂️</span> Gul Tailors
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 pb-24">
        {renderContent()}
      </main>

      {/* Modern Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1006] border-t border-white/10 flex justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = currentPage === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 w-full gap-1 transition-all duration-200 ${
                isActive ? 'text-[#e8b84b] scale-105 font-medium' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          )
        })}
      </nav>

    </div>
  )
}
