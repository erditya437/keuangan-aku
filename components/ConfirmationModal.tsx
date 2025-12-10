import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<Props> = ({ 
  isOpen, 
  title, 
  message, 
  type = 'danger', 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative z-10 scale-100 transition-transform">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
          type === 'danger' ? 'bg-red-100 text-red-500' : 'bg-primary-100 text-primary-500'
        }`}>
          <AlertTriangle size={24} />
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
          >
            <X size={18} />
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-xl text-white font-bold shadow-lg transition-all flex justify-center items-center gap-2 ${
              type === 'danger' 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                : 'bg-primary-500 hover:bg-primary-600 shadow-primary-200'
            }`}
          >
            <Check size={18} />
            Ya, Lanjut
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;