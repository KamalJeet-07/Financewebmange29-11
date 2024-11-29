import React from 'react';
import { Target, Clock, AlertTriangle } from 'lucide-react';
import { FinancialGoal } from '../../types/finance';
import { formatIndianCurrency } from '../../utils/formatters';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  goal: FinancialGoal;
  onEdit: (goal: FinancialGoal) => void;
}

export default function FinancialGoalCard({ goal, onEdit }: Props) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const timeLeft = formatDistanceToNow(new Date(goal.deadline), { addSuffix: true });
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onEdit(goal)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
          <p className="text-sm text-gray-500">{goal.category}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(goal.priority)}`}>
          {goal.priority}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                progress >= 100 ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Target</p>
            <p className="text-lg font-semibold">{formatIndianCurrency(goal.targetAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current</p>
            <p className="text-lg font-semibold">{formatIndianCurrency(goal.currentAmount)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{timeLeft}</span>
          </div>
          <span className={`text-sm font-medium ${getStatusColor(goal.status)}`}>
            {goal.status}
          </span>
        </div>
      </div>
    </div>
  );
}