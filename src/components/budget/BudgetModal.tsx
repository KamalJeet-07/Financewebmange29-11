import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Budget } from '../../types/finance';
import { formatIndianCurrency } from '../../utils/formatters';
import TransactionIcon from '../transactions/TransactionIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentBudget?: Budget;
}

const categories = [
  { value: 'Housing', label: 'Housing' },
  { value: 'Food', label: 'Food & Dining' },
  { value: 'Transport', label: 'Transportation' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Shopping', label: 'Shopping' },
];

export default function BudgetModal({ isOpen, onClose, currentBudget }: Props) {
  const { updateBudget, isLoading } = useFinanceStore();
  const [formData, setFormData] = useState({
    category: currentBudget?.category || 'Housing',
    limit: currentBudget?.limit.toString() || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const success = await updateBudget({
      category: formData.category,
      limit: Number(formData.limit),
      spent: currentBudget?.spent || 0,
      month: new Date(),
    });

    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Set Budget</h2>
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
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <div className="relative mt-1">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={isLoading}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
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
            <label className="block text-sm font-medium text-gray-700">Monthly Budget Limit (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="1000"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {currentBudget && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Current Monthly Spending</p>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {formatIndianCurrency(currentBudget.spent)}
              </p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    currentBudget.spent > currentBudget.limit ? 'bg-red-600' : 'bg-green-600'
                  }`}
                  style={{ 
                    width: `${Math.min((currentBudget.spent / currentBudget.limit) * 100, 100)}%` 
                  }}
                />
              </div>
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
                <span>Updating...</span>
              </>
            ) : (
              <span>Update Budget</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}