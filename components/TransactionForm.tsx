import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { PlusCircle, Save } from 'lucide-react';

interface Props {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdate: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  initialData?: Transaction | null;
}

const TransactionForm: React.FC<Props> = ({ onAdd, onUpdate, onCancel, initialData }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setType(initialData.type);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setDate(initialData.date.split('T')[0]);
    }
  }, [initialData]);

  const categories = type === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const transactionData = {
      amount: parseFloat(amount),
      type,
      category,
      description,
      date: new Date(date).toISOString(),
    };

    if (initialData) {
      onUpdate(initialData.id, transactionData);
    } else {
      onAdd(transactionData);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-24 animate-fade-in">
      <h2 className="text-2xl font-bold text-primary-800 mb-6 text-center">
        {initialData ? 'Edit Transaksi' : 'Tambah Transaksi'}
      </h2>
      
      <div className="flex bg-primary-50 p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => { setType('EXPENSE'); setCategory(EXPENSE_CATEGORIES[0].id); }}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            type === 'EXPENSE' ? 'bg-white text-red-500 shadow-sm' : 'text-primary-400'
          }`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => { setType('INCOME'); setCategory(INCOME_CATEGORIES[0].id); }}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            type === 'INCOME' ? 'bg-white text-green-500 shadow-sm' : 'text-primary-400'
          }`}
        >
          Pemasukan
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Jumlah (Rp)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-primary-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-400 outline-none transition-all text-lg font-semibold text-primary-900"
            placeholder="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">
            Deskripsi
          </label>
          <div className="relative">
             <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-primary-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-400 outline-none transition-all"
                placeholder="Contoh: Makan siang nasi padang"
                required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Kategori</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                  category === cat.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                <cat.icon size={20} style={{ color: category === cat.id ? cat.color : undefined }} className="mb-1" />
                <span className="text-[10px] font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-primary-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-400 outline-none transition-all text-primary-700"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-primary-500 text-white font-bold shadow-lg shadow-primary-200 hover:bg-primary-600 transition-all flex justify-center items-center gap-2"
          >
            {initialData ? <Save size={20} /> : <PlusCircle size={20} />}
            {initialData ? 'Perbarui' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;