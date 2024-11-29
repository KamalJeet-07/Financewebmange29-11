import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction } from '../../types/finance';
import { formatIndianCurrency } from '../../utils/formatters';

interface Props {
  transactions: Transaction[];
}

const COLORS = {
  Housing: '#4F46E5',
  Food: '#10B981',
  Transport: '#F59E0B',
  Utilities: '#EF4444',
  Entertainment: '#8B5CF6',
  Shopping: '#EC4899',
  Others: '#6B7280'
};

export default function ExpenseChart({ transactions }: Props) {
  const expenseData = useMemo(() => {
    // Filter only expense transactions
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Calculate totals by category
    const categoryTotals = expenses.reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format for chart
    return Object.entries(categoryTotals)
      .map(([category, value]) => ({
        name: category,
        value,
      }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [transactions]);

  if (expenseData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        No expense data available
      </div>
    );
  }

  const total = expenseData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={expenseData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {expenseData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Others}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [
              formatIndianCurrency(value),
              `${((value / total) * 100).toFixed(1)}%`
            ]}
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value: string, entry: any) => {
              const amount = entry.payload.value;
              const percentage = ((amount / total) * 100).toFixed(1);
              return (
                <span className="text-sm">
                  <span className="text-gray-700">{value}</span>
                  <span className="text-gray-500 ml-2">
                    ({percentage}%)
                  </span>
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}