import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../../types/finance';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { formatIndianCurrency } from '../../utils/formatters';

interface Props {
  transactions: Transaction[];
}

export default function FinancialOverview({ transactions }: Props) {
  // Get last 6 months range
  const last6Months = eachMonthOfInterval({
    start: startOfMonth(subMonths(new Date(), 5)),
    end: endOfMonth(new Date()),
  });

  // Process transaction data by month
  const monthlyData = last6Months.map(month => {
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate >= startOfMonth(month) &&
        transactionDate <= endOfMonth(month)
      );
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      month: format(month, 'MMM'),
      income,
      expenses,
    };
  });

  if (transactions.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        No transaction data available
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value: number) => [formatIndianCurrency(value), '']}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#4F46E5"
            fill="url(#incomeGradient)"
            name="Income"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#EF4444"
            fill="url(#expenseGradient)"
            name="Expenses"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}