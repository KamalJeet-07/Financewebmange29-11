import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Transaction, Budget } from '../types/finance';
import { toast } from 'react-hot-toast';
import { startOfMonth } from 'date-fns';

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<boolean>;
  fetchTransactions: () => Promise<void>;
  updateBudget: (budget: Omit<Budget, 'id'>) => Promise<boolean>;
  fetchBudgets: () => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  budgets: [],
  isLoading: false,
  error: null,

  addTransaction: async (transaction) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...transaction,
          is_recurring: transaction.is_recurring,
          recurring_interval: transaction.recurring_interval
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        transactions: [...state.transactions, data as Transaction],
        error: null
      }));
      
      if (transaction.type === 'expense') {
        const { data: budgetData } = await supabase
          .from('budgets')
          .select()
          .eq('category', transaction.category)
          .eq('month', startOfMonth(new Date()).toISOString())
          .single();

        if (budgetData) {
          const updatedSpent = budgetData.spent + Math.abs(transaction.amount);
          await supabase
            .from('budgets')
            .update({ spent: updatedSpent })
            .eq('id', budgetData.id);

          set((state) => ({
            budgets: state.budgets.map(b => 
              b.id === budgetData.id 
                ? { ...b, spent: updatedSpent }
                : b
            )
          }));
        }
      }

      toast.success('Transaction added successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add transaction';
      set({ error: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTransactions: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      set({ transactions: data as Transaction[], error: null });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch transactions';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updateBudget: async (budget) => {
    try {
      set({ isLoading: true, error: null });
      
      const currentMonth = startOfMonth(budget.month);
      
      const { data: existingBudget } = await supabase
        .from('budgets')
        .select('*')
        .eq('category', budget.category)
        .eq('month', currentMonth.toISOString())
        .maybeSingle();

      let result;
      
      if (existingBudget) {
        result = await supabase
          .from('budgets')
          .update({
            limit: budget.limit,
            spent: budget.spent
          })
          .eq('id', existingBudget.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('budgets')
          .insert([{
            ...budget,
            month: currentMonth.toISOString()
          }])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      set((state) => ({
        budgets: [
          ...state.budgets.filter(b => b.id !== result.data.id),
          result.data as Budget
        ],
        error: null
      }));
      
      toast.success('Budget updated successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update budget';
      set({ error: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBudgets: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('category');

      if (error) throw error;

      set({ budgets: data as Budget[], error: null });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch budgets';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTransaction: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const transaction = get().transactions.find(t => t.id === id);
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        error: null
      }));

      if (transaction && transaction.type === 'expense') {
        const { data: budgetData } = await supabase
          .from('budgets')
          .select()
          .eq('category', transaction.category)
          .eq('month', startOfMonth(new Date(transaction.date)).toISOString())
          .single();

        if (budgetData) {
          const updatedSpent = Math.max(0, budgetData.spent - Math.abs(transaction.amount));
          await supabase
            .from('budgets')
            .update({ spent: updatedSpent })
            .eq('id', budgetData.id);

          set((state) => ({
            budgets: state.budgets.map(b => 
              b.id === budgetData.id 
                ? { ...b, spent: updatedSpent }
                : b
            )
          }));
        }
      }

      toast.success('Transaction deleted successfully');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete transaction';
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
}));