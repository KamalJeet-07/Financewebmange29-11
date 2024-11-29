import React from 'react';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useFinanceStore } from '../../store/useFinanceStore';
import { formatIndianCurrency } from '../../utils/formatters';
import { Transaction } from '../../types/finance';
import TransactionIcon from './TransactionIcon';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useFinanceStore();

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions found. Add your first transaction!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionItem 
          key={transaction.id} 
          transaction={transaction}
          onDelete={deleteTransaction}
        />
      ))}
    </div>
  );
}

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => Promise<void>;
}

function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg ${
          isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {isIncome ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900">{transaction.description}</p>
            <TransactionIcon category={transaction.category} className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">{transaction.category}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className={`font-medium ${
            isIncome ? 'text-green-600' : 'text-red-600'
          }`}>
            {isIncome ? '+' : '-'}{formatIndianCurrency(transaction.amount)}
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(transaction.date), 'MMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={() => onDelete(transaction.id)}
          className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          title="Delete transaction"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}