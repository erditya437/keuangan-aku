export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string; // ISO String
}

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  bgColor: string;
  textColor: string;
  isPrivate: boolean;
  createdAt: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  HISTORY = 'HISTORY',
  BUDGET_PLANNER = 'BUDGET_PLANNER',
  NOTES = 'NOTES',
  SETTINGS = 'SETTINGS'
}