import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Plus, Lock, Unlock, Trash2, X, Check, Eye, EyeOff, Palette } from 'lucide-react';

const COLORS = [
  { bg: '#ffffff', text: '#1e293b' }, // White
  { bg: '#fef08a', text: '#854d0e' }, // Yellow
  { bg: '#bbf7d0', text: '#14532d' }, // Green
  { bg: '#bfdbfe', text: '#1e3a8a' }, // Blue
  { bg: '#fbcfe8', text: '#831843' }, // Pink
  { bg: '#e2e8f0', text: '#0f172a' }, // Gray
  { bg: '#1e293b', text: '#f8fafc' }, // Dark
];

interface Props {
  onRequestModal: (config: { title: string; message: string; action: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

const NotesFeature: React.FC<Props> = ({ onRequestModal }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('dompet_ceria_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [view, setView] = useState<'LIST' | 'EDITOR'>('LIST');
  
  // Editor State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Pin State
  const [pinPromptOpen, setPinPromptOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [tempNoteToOpen, setTempNoteToOpen] = useState<Note | null>(null);
  const [isPinSetupMode, setIsPinSetupMode] = useState(false); // If true, we are setting a new pin

  useEffect(() => {
    localStorage.setItem('dompet_ceria_notes', JSON.stringify(notes));
  }, [notes]);

  // --- ACTIONS ---

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    // Check if user is trying to make it private but no PIN exists
    if (isPrivate) {
        const existingPin = localStorage.getItem('dompet_ceria_pin');
        if (!existingPin) {
            // Must set PIN first
            setIsPinSetupMode(true);
            setPinPromptOpen(true);
            return; 
        }
    }

    const newNote: Note = {
      id: editingId || Date.now().toString(),
      title,
      content,
      bgColor: selectedColor.bg,
      textColor: selectedColor.text,
      isPrivate,
      createdAt: new Date().toISOString()
    };

    if (editingId) {
      setNotes(prev => prev.map(n => n.id === editingId ? newNote : n));
    } else {
      setNotes(prev => [newNote, ...prev]);
    }
    
    resetEditor();
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    onRequestModal({
        title: 'Hapus Catatan?',
        message: 'Catatan ini akan dihapus permanen. Yakin?',
        action: () => {
            setNotes(prev => prev.filter(n => n.id !== id));
            if (view === 'EDITOR') resetEditor();
        }
    });
  };

  const handleOpenNote = (note: Note) => {
    if (note.isPrivate) {
        setTempNoteToOpen(note);
        setIsPinSetupMode(false);
        setPinInput('');
        setPinPromptOpen(true);
    } else {
        openEditor(note);
    }
  };

  const openEditor = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setIsPrivate(note.isPrivate);
    setSelectedColor({ bg: note.bgColor, text: note.textColor });
    setView('EDITOR');
  };

  const resetEditor = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setIsPrivate(false);
    setSelectedColor(COLORS[0]);
    setView('LIST');
  };

  // --- PIN LOGIC ---

  const handlePinSubmit = () => {
    if (isPinSetupMode) {
        if (pinInput.length < 4) {
            alert('PIN harus minimal 4 angka');
            return;
        }
        localStorage.setItem('dompet_ceria_pin', pinInput);
        setIsPinSetupMode(false);
        setPinPromptOpen(false);
        // Continue saving the note
        handleSave();
    } else {
        const storedPin = localStorage.getItem('dompet_ceria_pin');
        if (pinInput === storedPin) {
            setPinPromptOpen(false);
            if (tempNoteToOpen) {
                openEditor(tempNoteToOpen);
                setTempNoteToOpen(null);
            }
        } else {
            alert('PIN Salah!');
            setPinInput('');
        }
    }
  };

  // --- RENDER ---

  if (view === 'EDITOR') {
    return (
        <div className="bg-white rounded-3xl shadow-xl p-6 min-h-[500px] flex flex-col animate-fade-in relative transition-all" 
             style={{ backgroundColor: selectedColor.bg, color: selectedColor.text }}>
            
            <div className="flex justify-between items-center mb-4">
                <button onClick={resetEditor} className="p-2 rounded-full hover:bg-black/10 transition-colors">
                    <X size={24} />
                </button>
                <div className="flex gap-2">
                    {editingId && (
                        <button onClick={() => handleDelete(editingId)} className="p-2 rounded-full hover:bg-red-500 hover:text-white text-red-500 transition-colors">
                            <Trash2 size={24} />
                        </button>
                    )}
                    <button onClick={handleSave} className="p-2 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-colors">
                        <Check size={24} />
                    </button>
                </div>
            </div>

            <input 
                type="text" 
                placeholder="Judul Catatan..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent outline-none w-full mb-4 placeholder-opacity-50"
                style={{ color: selectedColor.text }}
            />
            
            <textarea 
                placeholder="Tulis sesuatu..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 bg-transparent outline-none w-full resize-none placeholder-opacity-50 leading-relaxed"
                style={{ color: selectedColor.text }}
            />

            {/* Toolbar */}
            <div className="mt-4 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
                
                {/* Color Picker */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {COLORS.map((c, i) => (
                        <button 
                            key={i}
                            onClick={() => setSelectedColor(c)}
                            className={`w-8 h-8 rounded-full border border-black/10 shadow-sm shrink-0 ${selectedColor.bg === c.bg ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
                            style={{ backgroundColor: c.bg }}
                        />
                    ))}
                </div>

                {/* Privacy Toggle */}
                <button 
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                        isPrivate 
                        ? 'bg-red-100 text-red-600 ring-1 ring-red-200' 
                        : 'bg-black/5 text-inherit opacity-70 hover:opacity-100'
                    }`}
                >
                    {isPrivate ? <Lock size={14} /> : <Unlock size={14} />}
                    {isPrivate ? 'Rahasia (PIN)' : 'Publik'}
                </button>
            </div>

            {/* PIN MODAL */}
            {pinPromptOpen && (
                <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-3xl p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xs text-center text-slate-800">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 text-primary-600">
                            <Lock size={24}/>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{isPinSetupMode ? 'Buat PIN Baru' : 'Masukkan PIN'}</h3>
                        <p className="text-xs text-slate-500 mb-4">{isPinSetupMode ? 'PIN ini akan digunakan untuk semua catatan rahasia.' : 'Buka kunci catatan ini.'}</p>
                        
                        <input 
                            type="password" 
                            className="text-center text-2xl tracking-[0.5em] w-full p-2 border-b-2 border-primary-200 focus:border-primary-500 outline-none mb-6 font-bold text-slate-700 bg-transparent"
                            maxLength={6}
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                            autoFocus
                        />
                        
                        <div className="flex gap-2">
                             <button onClick={() => setPinPromptOpen(false)} className="flex-1 py-2 text-slate-500 font-bold text-sm">Batal</button>
                             <button onClick={handlePinSubmit} className="flex-1 py-2 bg-primary-500 text-white rounded-lg font-bold text-sm shadow-lg">
                                {isPinSetupMode ? 'Simpan PIN' : 'Buka'}
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
  }

  // LIST VIEW
  return (
    <div className="space-y-6 pb-24">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Catatan <span className="bg-primary-100 text-primary-600 px-2 py-0.5 rounded-md text-sm">{notes.length}</span>
            </h2>
            <button 
                onClick={() => { resetEditor(); setView('EDITOR'); }}
                className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-600 transition-all font-bold text-sm"
            >
                <Plus size={18} /> Buat Baru
            </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {notes.map(note => (
                <div 
                    key={note.id}
                    onClick={() => handleOpenNote(note)}
                    className="aspect-square rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group flex flex-col"
                    style={{ backgroundColor: note.isPrivate ? '#f1f5f9' : note.bgColor, color: note.textColor }}
                >
                    {/* Delete Button on Card */}
                    <button 
                        onClick={(e) => handleDelete(note.id, e)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/5 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 opacity-100"
                        title="Hapus Catatan"
                    >
                        <Trash2 size={14} />
                    </button>

                    {note.isPrivate ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
                            <Lock size={32} className="opacity-50" />
                            <span className="text-xs font-bold opacity-70">Terkunci</span>
                        </div>
                    ) : (
                        <>
                            <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{note.title || 'Tanpa Judul'}</h3>
                            <p className="text-xs opacity-70 line-clamp-4 leading-relaxed">{note.content}</p>
                            <div className="mt-auto pt-2 text-[10px] opacity-50 font-medium">
                                {new Date(note.createdAt).toLocaleDateString('id-ID')}
                            </div>
                        </>
                    )}
                </div>
            ))}

            {/* Add Card */}
            <button 
                onClick={() => { resetEditor(); setView('EDITOR'); }}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-300 hover:bg-primary-50 transition-all"
            >
                <Plus size={32} />
                <span className="text-xs font-bold mt-2">Tambah</span>
            </button>
        </div>

        {/* PIN PROMPT FOR LIST CLICK */}
        {pinPromptOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                 <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xs text-center relative animate-fade-in">
                        <button onClick={() => setPinPromptOpen(false)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"><X size={20}/></button>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
                            <Lock size={24}/>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-1">Catatan Rahasia</h3>
                        <p className="text-xs text-slate-500 mb-4">Masukkan PIN keamanan Anda</p>
                        
                        <input 
                            type="password" 
                            className="text-center text-2xl tracking-[0.5em] w-full p-2 border-b-2 border-primary-200 focus:border-primary-500 outline-none mb-6 font-bold text-slate-700 bg-transparent"
                            maxLength={6}
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                            autoFocus
                        />
                        
                        <button onClick={handlePinSubmit} className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-primary-600 transition-all">
                            Buka Catatan
                        </button>
                 </div>
            </div>
        )}
    </div>
  );
};

export default NotesFeature;