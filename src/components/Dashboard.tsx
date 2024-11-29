import React, { useState, useEffect } from 'react';
import { Wallet, IndianRupee, CreditCard, Target, TrendingUp, BarChart3 } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import FinancialOverview from './charts/FinancialOverview';
import ExpenseChart from './charts/ExpenseChart';
import BudgetProgress from './budget/BudgetProgress';
import TransactionList from './transactions/TransactionList';
import AddTransactionModal from './transactions/AddTransactionModal';
import StatCard from './stats/StatCard';
import ExpenseAnalytics from './analytics/ExpenseAnalytics';
import { formatIndianCurrency, calculateTrendPercentage, getTrendDirection } from '../utils/formatters';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { fetchTransactions, fetchBudgets, transactions, isLoading, error } = useFinanceStore();

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, [fetchTransactions, fetchBudgets]);

  const financialSummary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += Math.abs(transaction.amount);
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  const netBalance = financialSummary.totalIncome - financialSummary.totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">FinanceFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>{showAnalytics ? 'Show Overview' : 'Show Analytics'}</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <IndianRupee className="h-4 w-4" />
                <span>Add Transaction</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Net Balance"
            amount={formatIndianCurrency(netBalance)}
            trend={calculateTrendPercentage(netBalance, financialSummary.totalIncome)}
            icon={<IndianRupee className="h-6 w-6 text-green-500" />}
            trendDirection={getTrendDirection(netBalance)}
          />
          <StatCard
            title="Total Income"
            amount={formatIndianCurrency(financialSummary.totalIncome)}
            trend="+5.2%"
            icon={<TrendingUp className="h-6 w-6 text-blue-500" />}
            trendDirection="up"
          />
          <StatCard
            title="Total Expenses"
            amount={formatIndianCurrency(financialSummary.totalExpenses)}
            trend="-2.4%"
            icon={<CreditCard className="h-6 w-6 text-red-500" />}
            trendDirection="down"
          />
          <StatCard
            title="Monthly Goal"
            amount="₹1,00,000"
            trend="75%"
            icon={<Target className="h-6 w-6 text-purple-500" />}
            trendDirection="up"
          />
        </div>

        {showAnalytics ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Expense Analytics</h2>
            <ExpenseAnalytics transactions={transactions} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
                <FinancialOverview transactions={transactions} />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <TransactionList />
                )}
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Expense Breakdown</h2>
                <ExpenseChart transactions={transactions} />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <BudgetProgress transactions={transactions} />
              </div>
            </div>
          </div>
        )}
      </main>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}