import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

// Helper function takay LocalStorage se safely data fetch ho sakay
const getLocalData = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error)
    return defaultValue
  }
}

export function AppProvider({ children }) {
  // Application ki Central State Matrices
  const [clients, setClients] = useState(() => getLocalData('gt_clients', []))
  const [transactions, setTransactions] = useState(() => getLocalData('gt_ctxns', []))
  const [workers, setWorkers] = useState(() => getLocalData('gt_workers', []))
  const [workerEntries, setWorkerEntries] = useState(() => getLocalData('gt_wentries', []))

  // Jab bhi state update ho, localStorage automatic sync ho jaye
  useEffect(() => {
    localStorage.setItem('gt_clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    localStorage.setItem('gt_ctxns', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('gt_workers', JSON.stringify(workers))
  }, [workers])

  useEffect(() => {
    localStorage.setItem('gt_wentries', JSON.stringify(workerEntries))
  }, [workerEntries])

  // --- Core Senior Architecture: Automatic Balance Calculation Triggers ---
  
  // Client ka balance nikalne ka standard logic
  const getClientBalance = (clientId) => {
    return transactions
      .filter((t) => t.cid === clientId)
      .reduce((acc, t) => (t.type === 'credit' ? acc + Number(t.amount) : acc - Number(t.amount)), 0)
  }

  // Worker ka balance nikalne ka standard logic
  const getWorkerBalance = (workerId) => {
    return workerEntries
      .filter((e) => e.wid === workerId)
      .reduce((acc, e) => (e.type === 'credit' ? acc + Number(e.amount) : acc - Number(e.amount)), 0)
  }

  return (
    <AppContext.Provider
      value={{
        clients,
        setClients,
        transactions,
        setTransactions,
        workers,
        setWorkers,
        workerEntries,
        setWorkerEntries,
        getClientBalance,
        getWorkerBalance,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Custom Hook banaya takay kisi bhi component mein data asani se call ho sakay
export const useApp = () => useContext(AppContext)
