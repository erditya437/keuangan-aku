import { Folder, Coffee, ShoppingCart, Home, Bus, HeartPulse, Zap, Briefcase, Gift, DollarSign, StickyNote } from 'lucide-react';

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Makanan & Minuman', icon: Coffee, color: '#ef4444' },
  { id: 'transport', name: 'Transportasi', icon: Bus, color: '#f97316' },
  { id: 'shopping', name: 'Belanja', icon: ShoppingCart, color: '#eab308' },
  { id: 'housing', name: 'Tempat Tinggal', icon: Home, color: '#84cc16' },
  { id: 'utilities', name: 'Tagihan', icon: Zap, color: '#06b6d4' },
  { id: 'health', name: 'Kesehatan', icon: HeartPulse, color: '#ec4899' },
  { id: 'entertainment', name: 'Hiburan', icon: Gift, color: '#8b5cf6' },
  { id: 'other', name: 'Lainnya', icon: Folder, color: '#64748b' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Gaji', icon: Briefcase, color: '#22c55e' },
  { id: 'bonus', name: 'Bonus', icon: DollarSign, color: '#10b981' },
  { id: 'investment', name: 'Investasi', icon: Zap, color: '#3b82f6' },
  { id: 'other_income', name: 'Lainnya', icon: Folder, color: '#64748b' },
];

export const NAV_ICONS = {
    notes: StickyNote
};