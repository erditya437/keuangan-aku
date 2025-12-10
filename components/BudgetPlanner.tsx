import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';
import { PiggyBank, Target, ChevronDown, ChevronUp, AlertCircle, Save } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

const BudgetPlanner: React.FC<Props> = ({ transactions }) => {
  const [budgets, setBudgets] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('dompet_ceria_budgets');
    return saved ? JSON.parse(saved) : {};
  });

  const [expanded, setExpanded] = useState<string | null>(null);
  const [tempBudget, setTempBudget] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('dompet_ceria_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Hitung pengeluaran bulan ini per kategori
  const expenses = transactions.filter(t => {
    const d = new Date(t.date);
    return t.type === 'EXPENSE' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const expenseTotals: Record<string, number> = {};
  expenses.forEach(t => {
    expenseTotals[t.category] = (expenseTotals[t.category] || 0) + t.amount;
  });

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleSaveBudget = (catId: string) => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val)) {
        setBudgets(prev => ({
            ...prev,
            [catId]: val
        }));
    }
    setExpanded(null);
  };

  const handleExpand = (catId: string, currentBudget: number) => {
    if (expanded === catId) {
        setExpanded(null);
    } else {
        setExpanded(catId);
        setTempBudget(currentBudget ? currentBudget.toString() : '');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-24 animate-fade-in">
       <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
            <Target size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Target Hemat</h2>
            <p className="text-xs text-slate-500">Atur batas pengeluaran bulanan</p>
          </div>
        </div>

        <div className="space-y-4">
            {EXPENSE_CATEGORIES.map(cat => {
                const total = expenseTotals[cat.id] || 0;
                const budget = budgets[cat.id] || 0;
                const percent = budget > 0 ? (total / budget) * 100 : 0;
                const isOver = percent > 100;
                const isWarning = percent > 80 && percent <= 100;
                
                return (
                    <div key={cat.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                        <div className="flex justify-between items-center mb-2" onClick={() => handleExpand(cat.id, budget)}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isOver ? 'bg-red-100 text-red-500' : 'bg-white text-slate-400'}`}>
                                    <cat.icon size={20} style={{ color: !isOver ? cat.color : undefined }} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-700 text-sm">{cat.name}</h4>
                                    <p className="text-xs text-slate-500">
                                        Terpakai: {formatRupiah(total)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                {budget > 0 ? (
                                    <span className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-slate-600'}`}>
                                        Target: {formatRupiah(budget)}
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-400 italic">Belum diatur</span>
                                )}
                                <div className="text-slate-300 mt-1">
                                    {expanded === cat.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {budget > 0 && (
                            <div className="w-full bg-slate-200 rounded-full h-2 mb-1 overflow-hidden">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : isWarning ? 'bg-yellow-400' : 'bg-primary-500'}`}
                                    style={{ width: `${Math.min(percent, 100)}%` }}
                                ></div>
                            </div>
                        )}
                        {isOver && <p className="text-[10px] text-red-500 flex items-center gap-1 mt-1 font-bold"><AlertCircle size={10}/> Melewati batas!</p>}

                        {/* Edit Section */}
                        {expanded === cat.id && (
                            <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Set Target Bulanan (Rp)</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        value={tempBudget}
                                        onChange={(e) => setTempBudget(e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none"
                                        placeholder="0"
                                    />
                                    <button 
                                        onClick={() => handleSaveBudget(cat.id)}
                                        className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-primary-600 transition-colors"
                                    >
                                        <Save size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default BudgetPlanner;