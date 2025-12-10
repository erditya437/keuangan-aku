import React, { useEffect, useState } from 'react';
import { getFinancialAdvice } from '../services/geminiService';
import { Transaction } from '../types';
import { Bot, RefreshCw, MessageSquareQuote } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

const AIAdvisor: React.FC<Props> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    if (transactions.length < 3) {
      setAdvice("Halo! Kumpulkan minimal 3 transaksi dulu ya, supaya aku bisa kasih saran yang oke! 😉");
      return;
    }
    setLoading(true);
    const result = await getFinancialAdvice(transactions);
    setAdvice(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl mb-24 animate-fade-in relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-primary-400 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Asisten Pintar</h2>
            <p className="text-xs text-slate-500">Powered by Gemini AI</p>
          </div>
        </div>
        <button 
          onClick={fetchAdvice} 
          disabled={loading}
          className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-primary-500 hover:bg-primary-50 transition-all disabled:opacity-50"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-primary-50/50 rounded-2xl p-6 border border-primary-100 relative min-h-[150px]">
        <MessageSquareQuote className="absolute top-4 left-4 text-primary-200 w-8 h-8 -z-0" />
        
        {loading ? (
          <div className="space-y-3 z-10 relative">
            <div className="h-4 bg-primary-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-primary-100 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-primary-100 rounded w-5/6 animate-pulse"></div>
            <p className="text-xs text-center text-primary-400 mt-4 animate-bounce">Sedang berpikir...</p>
          </div>
        ) : (
          <div className="prose prose-sm text-slate-700 leading-relaxed z-10 relative whitespace-pre-line">
            {advice}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;