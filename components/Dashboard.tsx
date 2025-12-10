import React, { useMemo } from 'react';
import { Transaction, SummaryData } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';
import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  summary: SummaryData;
  onAddClick: () => void;
}

const Dashboard: React.FC<Props> = ({ transactions, summary, onAddClick }) => {
  
  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'EXPENSE');
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    return Object.keys(categoryTotals).map(catId => {
      const category = EXPENSE_CATEGORIES.find(c => c.id === catId);
      return {
        name: category?.name || catId,
        shortName: category?.name.split(' ')[0] || catId,
        value: categoryTotals[catId],
        color: category?.color || '#cbd5e1',
        icon: category?.icon
      };
    }).sort((a, b) => b.value - a.value); // Sort by highest expense
  }, [transactions]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
          <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
          <p className="text-sm font-bold text-primary-600">
            {formatRupiah(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-6 text-white shadow-xl shadow-primary-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-900 opacity-20 rounded-full -ml-10 -mb-10 blur-xl"></div>
        
        <p className="text-primary-100 text-sm font-medium mb-1 flex items-center gap-2">
            <Wallet size={16}/> Saldo Saat Ini
        </p>
        <h1 className="text-4xl font-extrabold mb-6 tracking-tight">
            {formatRupiah(summary.balance)}
        </h1>

        <div className="flex gap-4">
            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2 text-primary-50 text-xs mb-1">
                    <TrendingDown size={14} className="text-green-300"/> Pemasukan
                </div>
                <p className="font-bold text-lg">{formatRupiah(summary.totalIncome)}</p>
            </div>
            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2 text-primary-50 text-xs mb-1">
                    <TrendingUp size={14} className="text-red-300"/> Pengeluaran
                </div>
                <p className="font-bold text-lg">{formatRupiah(summary.totalExpense)}</p>
            </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-50">
        <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
            <TrendingUp className="text-primary-500" size={20}/>
            Analisis Pengeluaran
        </h3>
        
        {chartData.length > 0 ? (
            <div className="h-72 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="shortName" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fill: '#64748b'}} 
                            interval={0}
                            dy={10}
                        />
                        <YAxis 
                            hide 
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                        <Bar 
                            dataKey="value" 
                            radius={[8, 8, 8, 8]} 
                            barSize={32}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <div className="h-40 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p>Belum ada data pengeluaran</p>
                <button onClick={onAddClick} className="mt-2 text-primary-500 font-bold text-sm flex items-center gap-1">
                   Tambah <ArrowUpRight size={14}/>
                </button>
            </div>
        )}
      </div>

      {/* Tips */}
      <div className="p-5 bg-yellow-50 border border-yellow-100 rounded-2xl flex gap-3 items-start">
        <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 shrink-0">
            <TrendingDown size={18} />
        </div>
        <div>
            <h4 className="font-bold text-yellow-800 text-sm mb-1">Tips Hemat</h4>
            <p className="text-xs text-yellow-700 leading-relaxed">
                Cobalah untuk menjaga pengeluaran "Hiburan" di bawah 20% dari total pendapatanmu agar tabungan tetap aman!
            </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;