import React, { useState } from 'react';
import { X, Loader2, RefreshCw } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import TransactionIcon from './TransactionIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { value: 'Housing', label: 'Housing' },
  { value: 'Food', label: 'Food & Dining' },
  { value: 'Transport', label: 'Transportation' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Income', label: 'Income' },
];

export default function AddTransactionModal({ isOpen, onClose }: Props) {
  const { addTransaction, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Housing',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    is_recurring: false,
    recurring_interval: 'monthly' as 'weekly' | 'monthly' | 'yearly',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const success = await addTransaction({
      ...formData,
      amount: Number(formData.amount),
      date: new Date(formData.date),
    });

    if (success) {
      setFormData({
        description: '',
        amount: '',
        category: 'Housing',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        is_recurring: false,
        recurring_interval: 'monthly',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Transaction</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.type}
              onChange={(e) => {
                const newType = e.target.value as 'income' | 'expense';
                setFormData({ 
                  ...formData, 
                  type: newType,
                  category: newType === 'income' ? 'Income' : formData.category
                });
              }}
              disabled={isLoading}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <div className="relative mt-1">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={isLoading || formData.type === 'income'}
              >
                {categories
                  .filter(cat => formData.type === 'income' ? cat.value === 'Income' : cat.value !== 'Income')
                  .map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))
                }
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TransactionIcon 
                  category={formData.category} 
                  className="h-5 w-5 text-gray-400" 
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_recurring"
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={formData.is_recurring}
              onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
              disabled={isLoading}
            />
            <label htmlFor="is_recurring" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
              <RefreshCw className="h-4 w-4" />
              <span>Recurring Transaction</span>
            </label>
          </div>

          {formData.is_recurring && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Recurring Interval</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.recurring_interval}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  recurring_interval: e.target.value as 'weekly' | 'monthly' | 'yearly'
                })}
                disabled={isLoading}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <span>Add Transaction</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}