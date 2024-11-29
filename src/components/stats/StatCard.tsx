import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  amount: string;
  trend: string;
  icon: React.ReactNode;
  trendDirection: 'up' | 'down' | 'neutral';
}

export default function StatCard({ title, amount, trend, icon, trendDirection }: StatCardProps) {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  }[trendDirection];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{amount}</p>
        </div>
        {icon}
      </div>
      <div className={`mt-2 text-sm ${trendColor}`}>
        {trend}
      </div>
    </div>
  );
}