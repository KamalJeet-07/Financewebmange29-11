import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { formatIndianCurrency } from '../../utils/formatters';
import { Transaction } from '../../types/finance';
import { startOfMonth, endOfMonth } from 'date-fns';
import BudgetModal from './BudgetModal';
import { useFinanceStore } from '../../store/useFinanceStore';
import TransactionIcon from '../transactions/TransactionIcon';

interface Props {
  transactions: Transaction[];
}

export default function BudgetProgress({ transactions }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { budgets } = useFinanceStore();

  const currentMonthExpenses = React.useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return (
          t.type === 'expense' &&
          date >= monthStart &&
          date <= monthEnd
        );
      })
      .reduce((acc, t) => {
        const category = t.category;
        acc[category] = (acc[category] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);
  }, [transactions]);

  const handleEditBudget = (category: string) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const currentBudget = selectedCategory ? budgets.find(b => b.category === selectedCategory) : null;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Budget Progress</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm">Manage Budgets</span>
        </button>
      </div>

      <div className="space-y-4">
        {budgets.map((budget) => {
          const spent = currentMonthExpenses[budget.category] || 0;
          const percentage = (spent / budget.limit) * 100;
          const isOverBudget = percentage > 100;
          
          return (
            <div 
              key={budget.category} 
              className="space-y-2 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleEditBudget(budget.category)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TransactionIcon 
                    category={budget.category} 
                    className="h-5 w-5 text-gray-500" 
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {budget.category}
                  </span>
                </div>
                <span className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-500'}`}>
                  {formatIndianCurrency(spent)} / {formatIndianCurrency(budget.limit)}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isOverBudget ? 'bg-red-600' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 text-right">
                {percentage.toFixed(1)}%
                {isOverBudget && ' (Over Budget)'}
              </div>
            </div>
          );
        })}
      </div>

      <BudgetModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        currentBudget={currentBudget || undefined}
      />
    </>
  );
}