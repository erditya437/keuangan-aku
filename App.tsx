import React, { useState, useEffect } from 'react';
import { Transaction, SummaryData, AppView } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetPlanner from './components/BudgetPlanner';
import NotesFeature from './components/NotesFeature';
import Settings from './components/Settings';
import ConfirmationModal from './components/ConfirmationModal';
import { LayoutDashboard, Plus, History, PieChart, MoreHorizontal, LogOut, Menu, X, Wallet, StickyNote } from 'lucide-react';

const App: React.FC = () => {
  // --- STATE ---
  const [appVersion, setAppVersion] = useState(0); // Used to force re-render components on reset
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('dompet_ceria_trx');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [summary, setSummary] = useState<SummaryData>({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Edit Transaction State
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info';
    action: () => void;
  }>({ title: '', message: '', action: () => {} });

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('dompet_ceria_trx', JSON.stringify(transactions));
    
    let income = 0;
    let expense = 0;
    
    transactions.forEach(t => {
      if (t.type === 'INCOME') income += t.amount;
      else expense += t.amount;
    });

    setSummary({
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    });
  }, [transactions]);

  // --- ACTIONS ---

  const addTransaction = (newTrx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTrx,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [transaction, ...prev]);
    setCurrentView(AppView.DASHBOARD);
  };

  const updateTransaction = (id: string, updatedData: Omit<Transaction, 'id'>) => {
    setTransactions(prev => prev.map(t => 
        t.id === id ? { ...t, ...updatedData } : t
    ));
    setEditingTransaction(null);
    setCurrentView(AppView.HISTORY);
  };

  const handleEditRequest = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setCurrentView(AppView.ADD_TRANSACTION);
    setIsMobileMenuOpen(false); // Close menu if on mobile
  };

  const handleRequestModal = (config: { title: string; message: string; action: () => void; type?: 'danger' | 'warning' | 'info' }) => {
    setModalConfig({
        title: config.title,
        message: config.message,
        type: config.type || 'danger',
        action: () => {
            config.action();
            setModalOpen(false);
        }
    });
    setModalOpen(true);
  };

  const initiateDelete = (id: string) => {
    handleRequestModal({
      title: 'Hapus Transaksi?',
      message: 'Apakah kamu yakin ingin menghapus transaksi ini? Data tidak bisa dikembalikan loh.',
      action: () => {
        setTransactions(prev => prev.filter(t => t.id !== id));
      }
    });
  };

  const initiateReset = () => {
    handleRequestModal({
      title: 'Reset Semua Data?',
      message: 'PERINGATAN: Semua riwayat transaksi, budget, dan catatan akan dihapus permanen. Mulai dari nol lagi?',
      action: () => {
        // Clear Local Storage explicitly
        localStorage.removeItem('dompet_ceria_trx');
        localStorage.removeItem('dompet_ceria_budgets');
        localStorage.removeItem('dompet_ceria_notes');
        localStorage.removeItem('dompet_ceria_pin');
        
        // Update state
        setTransactions([]);
        setCurrentView(AppView.DASHBOARD);
        setAppVersion(prev => prev + 1); // Force re-mount of components to clear their internal states
      }
    });
  };

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    // Reset editing state if moving away from add/edit screen
    if (view !== AppView.ADD_TRANSACTION) {
        setEditingTransaction(null);
    }
  };

  const handleAddNav = () => {
    setEditingTransaction(null); // Ensure fresh form
    setCurrentView(AppView.ADD_TRANSACTION);
    setIsMobileMenuOpen(false);
  }

  // --- NAVIGATION CONFIG ---
  const navItems = [
    { view: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { view: AppView.HISTORY, icon: History, label: 'Riwayat' },
    { view: AppView.ADD_TRANSACTION, icon: Plus, label: 'Tambah', customAction: handleAddNav },
    { view: AppView.BUDGET_PLANNER, icon: PieChart, label: 'Target Hemat' },
    { view: AppView.NOTES, icon: StickyNote, label: 'Catatan' },
    { view: AppView.SETTINGS, icon: MoreHorizontal, label: 'Pengaturan' },
  ];

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800 overflow-hidden relative">
      
      {/* --- CONFIRMATION MODAL --- */}
      <ConfirmationModal 
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.action}
        onCancel={() => setModalOpen(false)}
      />

      {/* --- MOBILE MENU OVERLAY (HAMBURGER) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar Menu */}
          <aside className="relative bg-white w-72 h-full shadow-2xl flex flex-col animate-slide-in-left z-50">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="text-2xl font-black text-primary-600 tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm">
                        DC
                    </div>
                    Menu
                 </h2>
                 <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
                 >
                    <X size={20} />
                 </button>
             </div>

             <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.view}
                        onClick={item.customAction || (() => handleNavClick(item.view))}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold ${
                            currentView === item.view 
                            ? 'bg-primary-50 text-primary-600 shadow-sm' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <item.icon size={20} strokeWidth={currentView === item.view ? 2.5 : 2} />
                        {item.label}
                    </button>
                ))}
             </nav>

             <div className="p-6 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white rounded-full text-primary-500 shadow-sm">
                        <Wallet size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Saldo Kamu</p>
                        <p className="font-bold text-slate-700">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(summary.balance)}
                        </p>
                    </div>
                </div>
             </div>
          </aside>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR (Visible on MD+) --- */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full z-40 shadow-xl shrink-0">
        <div className="p-8">
            <h1 className="text-2xl font-black text-primary-600 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm">
                DC
              </div>
              DompetCeria<span className="text-yellow-400">.</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium pl-10 mt-1">Versi Desktop</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.filter(i => i.view !== AppView.ADD_TRANSACTION).map((item) => (
                <button
                    key={item.view}
                    onClick={() => handleNavClick(item.view)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold ${
                        currentView === item.view 
                        ? 'bg-primary-50 text-primary-600 shadow-sm' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    }`}
                >
                    <item.icon size={20} strokeWidth={currentView === item.view ? 2.5 : 2} />
                    {item.label}
                </button>
            ))}
            
            {/* Special Add Button for Desktop */}
            <button
                onClick={handleAddNav}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold mt-4 ${
                     currentView === AppView.ADD_TRANSACTION
                     ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                     : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                }`}
            >
                <Plus size={20} strokeWidth={2.5} />
                {editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
            </button>
        </nav>

        <div className="p-6 border-t border-slate-100 mt-auto">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-6 -mt-6 blur-xl"></div>
                 <p className="text-xs text-primary-100 mb-1">Saldo Kamu</p>
                 <p className="font-bold text-lg">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(summary.balance)}
                 </p>
            </div>
        </div>
      </aside>

      {/* --- MOBILE HEADER (Visible on Small Screens) --- */}
      <header className="md:hidden px-4 py-3 flex justify-between items-center bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 active:scale-95 transition-all"
                aria-label="Buka menu"
            >
                <Menu size={24} />
            </button>
            <div>
                <h1 className="text-xl font-black text-primary-600 tracking-tight flex items-center gap-1">
                    DompetCeria<span className="text-yellow-400">.</span>
                </h1>
            </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold border-2 border-primary-100 shadow-sm">
            😎
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto scrollbar-hide bg-slate-50 relative w-full">
        {/* Changed max-w-2xl to max-w-3xl and removed md:mx-0 to ensure centering */}
        <div className="p-4 md:p-8 lg:p-12 max-w-3xl mx-auto w-full animate-fade-in min-h-full">
          
          {/* Dynamic Title for Desktop */}
          <div className="hidden md:block mb-8">
             <h2 className="text-3xl font-bold text-slate-800">
                {currentView === AppView.DASHBOARD && 'Dashboard Ringkasan'}
                {currentView === AppView.HISTORY && 'Riwayat Transaksi'}
                {currentView === AppView.ADD_TRANSACTION && (editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru')}
                {currentView === AppView.BUDGET_PLANNER && 'Perencanaan Budget'}
                {currentView === AppView.NOTES && 'Catatan & Ide'}
                {currentView === AppView.SETTINGS && 'Pengaturan Aplikasi'}
             </h2>
             <p className="text-slate-400">Kelola keuanganmu dengan mudah dan ceria.</p>
          </div>

          {currentView === AppView.DASHBOARD && (
              <Dashboard 
                  key={`dashboard-${appVersion}`}
                  transactions={transactions} 
                  summary={summary} 
                  onAddClick={handleAddNav}
              />
          )}
          {currentView === AppView.ADD_TRANSACTION && (
              <TransactionForm 
                  onAdd={addTransaction} 
                  onUpdate={updateTransaction}
                  onCancel={() => {
                      setEditingTransaction(null);
                      setCurrentView(AppView.DASHBOARD);
                  }}
                  initialData={editingTransaction}
              />
          )}
          {currentView === AppView.HISTORY && (
              <TransactionList 
                  transactions={transactions} 
                  onDeleteRequest={initiateDelete} 
                  onEditRequest={handleEditRequest}
              />
          )}
          {currentView === AppView.BUDGET_PLANNER && (
              <BudgetPlanner 
                key={`budget-${appVersion}`}
                transactions={transactions} 
              />
          )}
          {currentView === AppView.NOTES && (
              <NotesFeature 
                key={`notes-${appVersion}`} 
                onRequestModal={handleRequestModal}
              />
          )}
          {currentView === AppView.SETTINGS && (
              <Settings 
                onResetRequest={initiateReset} 
                onRequestModal={handleRequestModal}
              />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;