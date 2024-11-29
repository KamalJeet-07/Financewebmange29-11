export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: Date;
  is_recurring: boolean;
  recurring_interval?: 'weekly' | 'monthly' | 'yearly';
  user_id?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  month: Date;
  user_id?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  user_id?: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'failed';
  user_id?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  monthlyBudget: number;
  savingsRate: number;
  recurringExpenses: number;
  discretionarySpending: number;
}

export interface ExpenseAnalytics {
  categoryBreakdown: Record<string, number>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
  largestExpenses: Transaction[];
  recurringTotal: number;
}