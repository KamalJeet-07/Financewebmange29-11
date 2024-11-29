import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatIndianCurrency } from '../../utils/formatters';
import { Transaction } from '../../types/finance';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import TransactionIcon from '../transactions/TransactionIcon';

interface Props {
  transactions: Transaction[];
}

export default function ExpenseAnalytics({ transactions }: Props) {
  // Calculate recurring expenses
  const recurringExpenses = transactions.filter(t => t.isRecurring && t.type === 'expense');
  const recurringTotal = recurringExpenses.reduce((sum, t) => sum + t.amount, 0);

  // Get largest expenses
  const largestExpenses = [...transactions]
    .filter(t => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Calculate monthly trend
  const last6Months = eachMonthOfInterval({
    start: startOfMonth(subMonths(new Date(), 5)),
    end: endOfMonth(new Date()),
  });

  const monthlyTrend = last6Months.map(month => {
    const monthExpenses = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        t.type === 'expense' &&
        transactionDate >= startOfMonth(month) &&
        transactionDate <= endOfMonth(month)
      );
    });

    return {
      month: format(month, 'MMM'),
      amount: monthExpenses.reduce((sum, t) => sum + t.amount, 0),
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Monthly Expense Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: '#6B7280' }}
                tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              />
              <Tooltip
                formatter={(value: number) => [formatIndianCurrency(value), 'Expenses']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="amount" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recurring Expenses</h3>
        <div className="bg-red-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-600">
            Monthly Recurring Total: {formatIndianCurrency(recurringTotal)}
          </p>
        </div>
        <div className="space-y-3">
          {recurringExpenses.map(expense => (
            <div 
              key={expense.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <TransactionIcon 
                  category={expense.category} 
                  className="h-5 w-5 text-gray-400" 
                />
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-500">
                    {expense.recurringInterval} • {expense.category}
                  </p>
                </div>
              </div>
              <p className="font-medium text-red-600">
                {formatIndianCurrency(expense.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Largest Expenses</h3>
        <div className="space-y-3">
          {largestExpenses.map(expense => (
            <div 
              key={expense.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <TransactionIcon 
                  category={expense.category} 
                  className="h-5 w-5 text-gray-400" 
                />
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(expense.date), 'MMM d, yyyy')} • {expense.category}
                  </p>
                </div>
              </div>
              <p className="font-medium text-red-600">
                {formatIndianCurrency(expense.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}