import React, { useState } from 'react';
import { Transaction } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { Trash2, Pencil, X, Calendar, AlignLeft, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDeleteRequest: (id: string) => void;
  onEditRequest: (transaction: Transaction) => void;
}

const TransactionList: React.FC<Props> = ({ transactions, onDeleteRequest, onEditRequest }) => {
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getCategory = (t: Transaction) => {
    const list = t.type === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    return list.find(c => c.id === t.category);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (transactions.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl grayscale">📂</span>
              </div>
              <p>Belum ada data transaksi</p>
          </div>
      );
  }

  return (
    <>
      {/* List Container */}
      <div className="space-y-4 pb-24 md:pb-0">
        <h2 className="text-xl font-bold text-primary-800 px-2">Riwayat Transaksi</h2>
        {sortedTransactions.map((t) => {
          const category = getCategory(t);
          const Icon = category?.icon;

          return (
            <div 
              key={t.id} 
              onClick={() => setSelectedTrx(t)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all group cursor-pointer active:scale-[0.98]"
            >
              <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      t.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                  }`}
              >
                  {Icon && <Icon size={24} style={{ color: t.type === 'INCOME' ? '#16a34a' : '#dc2626' }} />}
              </div>
              
              <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-800 truncate pr-2 text-sm md:text-base">{category?.name || 'Umum'}</h4>
                      <span className={`font-bold text-sm shrink-0 ${t.type === 'INCOME' ? 'text-green-600' : 'text-slate-800'}`}>
                          {t.type === 'INCOME' ? '+' : '-'} {formatRupiah(t.amount)}
                      </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                      {/* Truncate logic: max-w set to prevent pushing date */}
                      <span className="truncate max-w-[120px] md:max-w-[200px] block" title={t.description}>
                        {t.description}
                      </span>
                      <span className="shrink-0 ml-2">{formatDate(t.date)}</span>
                  </div>
              </div>

              <div className="flex gap-2 pl-2 border-l border-slate-100">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditRequest(t);
                    }}
                    className="bg-blue-50 text-blue-400 p-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-blue-100 hover:text-blue-600 transition-all active:scale-95"
                    aria-label="Edit transaksi"
                >
                    <Pencil size={16} />
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRequest(t.id);
                    }}
                    className="bg-red-50 text-red-400 p-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all active:scale-95"
                    aria-label="Hapus transaksi"
                >
                    <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedTrx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
             onClick={() => setSelectedTrx(null)}
           ></div>

           {/* Content */}
           <div className="bg-white w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl scale-100 flex flex-col gap-6">
              <button 
                onClick={() => setSelectedTrx(null)}
                className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Header: Icon & Amount */}
              <div className="text-center pt-4">
                  <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 shadow-lg shadow-slate-100 ${
                     selectedTrx.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                  }`}>
                      {(() => {
                        const Cat = getCategory(selectedTrx);
                        const Icon = Cat?.icon || AlignLeft;
                        return <Icon size={40} />;
                      })()}
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {getCategory(selectedTrx)?.name}
                  </h3>
                  <h2 className={`text-3xl font-black ${selectedTrx.type === 'INCOME' ? 'text-green-600' : 'text-slate-800'}`}>
                    {formatRupiah(selectedTrx.amount)}
                  </h2>
              </div>

              {/* Detail Info Grid */}
              <div className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100">
                  
                  {/* Date */}
                  <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg text-primary-500 shadow-sm shrink-0">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold mb-0.5">Waktu Transaksi</p>
                        <p className="text-slate-700 font-semibold">{formatDate(selectedTrx.date)}</p>
                      </div>
                  </div>

                  {/* Type */}
                  <div className="flex items-start gap-3">
                      <div className={`p-2 bg-white rounded-lg shadow-sm shrink-0 ${selectedTrx.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                        {selectedTrx.type === 'INCOME' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold mb-0.5">Tipe</p>
                        <p className={`font-semibold ${selectedTrx.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                           {selectedTrx.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
                        </p>
                      </div>
                  </div>

                  {/* Full Description */}
                  <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm shrink-0">
                        <AlignLeft size={18} />
                      </div>
                      <div className="w-full">
                        <p className="text-xs text-slate-400 font-bold mb-0.5">Catatan / Deskripsi</p>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                            {selectedTrx.description}
                        </p>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default TransactionList;