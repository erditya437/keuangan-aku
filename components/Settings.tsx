import React from 'react';
import { Trash2, ShieldCheck, Info, KeyRound } from 'lucide-react';

interface Props {
  onResetRequest: () => void;
  onRequestModal: (config: { title: string; message: string; action: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

const Settings: React.FC<Props> = ({ onResetRequest, onRequestModal }) => {
  const handleResetPin = () => {
    onRequestModal({
      title: 'Hapus PIN Keamanan?',
      message: 'Apakah Anda yakin ingin menghapus PIN? Catatan rahasia akan menjadi terbuka jika PIN dibuat ulang nanti.',
      type: 'warning',
      action: () => {
        localStorage.removeItem('dompet_ceria_pin');
        // Kita bisa menggunakan modal info atau alert sederhana di sini, tapi untuk konsistensi UI, kita biarkan user tahu bahwa aksi berhasil lewat UI update (tombol bisa berubah status, tapi di sini cukup hapus saja).
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-24 md:mb-0 animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-primary-800 mb-6">Pengaturan</h2>

      <div className="space-y-4">
        {/* About Section */}
        <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100">
            <h3 className="font-bold text-primary-800 flex items-center gap-2 mb-2">
                <Info size={18}/> Tentang Aplikasi
            </h3>
            <p className="text-sm text-primary-700 leading-relaxed mb-4">
                DompetCeria kini hadir dengan fitur Catatan Berwarna! Kelola keuangan dan ide-ide cemerlangmu dalam satu tempat yang aman.
            </p>
            <div className="flex items-center gap-2 text-xs text-primary-500">
                <ShieldCheck size={14} />
                <span>Offline & Aman (Data Local Storage)</span>
            </div>
        </div>

        {/* Privacy Settings */}
        <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Keamanan</h3>
            <button 
                onClick={handleResetPin}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors border border-slate-200"
            >
                <span className="font-bold flex items-center gap-2">
                    <KeyRound size={18} className="text-slate-500" /> Reset PIN Catatan
                </span>
                <span className="text-xs text-slate-400">
                    Hapus PIN lama
                </span>
            </button>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Zona Bahaya</h3>
            <button 
                onClick={onResetRequest}
                className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors group border border-red-100"
            >
                <span className="font-bold flex items-center gap-2">
                    <Trash2 size={18} /> Hapus Data
                </span>
                <span className="text-xs bg-white/50 px-2 py-1 rounded text-red-400 group-hover:text-red-600 font-bold border border-red-200">
                    RESET SEMUA
                </span>
            </button>
            <p className="text-xs text-slate-400 mt-2 text-center">
                Menghapus semua riwayat transaksi, catatan, dan pengaturan secara permanen.
            </p>
        </div>

        <div className="text-center pt-8">
            <p className="text-xs text-slate-300 font-bold">DompetCeria v2.3</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;