/**
 * Dashboard Page
 */

import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Chart from '../components/Chart';
import Chat from '../components/Chat';
import { expenseAPI, insightAPI } from '../services/api';
import '../styles/Dashboard.css';

function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [insights, setInsights] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingExpense, setEditingExpense] = useState(null);

  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  useEffect(() => {
    loadDashboardData();
  }, [selectedMonth]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [expensesRes, categoriesRes, insightsRes, anomaliesRes] = await Promise.all([
        expenseAPI.getAll({ month: selectedMonth }),
        insightAPI.getCategories(selectedMonth),
        insightAPI.getMonthly(selectedMonth),
        insightAPI.getAnomalies()
      ]);

      setExpenses(expensesRes.data.expenses);
      setCategoryData(expensesRes.data.expenses.reduce((acc, exp) => {
        if (!acc[exp.category]) {
          acc[exp.category] = { amount: 0, count: 0 };
        }
        acc[exp.category].amount += exp.amount;
        acc[exp.category].count += 1;
        return acc;
      }, {}));
      setInsights(insightsRes.data.insight);
      setAnomalies(anomaliesRes.data.anomalies);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.delete(expenseId);
        loadDashboardData();
      } catch (error) {
        console.error('Failed to delete expense:', error);
      }
    }
  };

  const handleExpenseAdded = () => {
    setEditingExpense(null);
    loadDashboardData();
  };

  const totalSpent = Object.values(categoryData).reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <div className="month-selector">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Spent</h3>
          <p className="amount">₹{totalSpent.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Transactions</h3>
          <p className="amount">{expenses.length}</p>
        </div>
        <div className="card">
          <h3>Categories</h3>
          <p className="amount">{Object.keys(categoryData).length}</p>
        </div>
        {anomalies.length > 0 && (
          <div className="card warning">
            <h3>⚠️ Anomalies</h3>
            <p className="amount">{anomalies.length}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          Expenses
        </button>
        <button
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-container">
            <div className="left-panel">
              <Chart categoryData={categoryData} />
              {insights && (
                <div className="insights-card">
                  <h3>AI Insights</h3>
                  <p>{insights.insights?.summary}</p>
                  {insights.insights?.recommendations && (
                    <div className="recommendations">
                      <h4>Recommendations:</h4>
                      <ul>
                        {insights.insights.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="right-panel">
              <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="expenses-container">
            {editingExpense && (
              <div className="editing-form">
                <ExpenseForm
                  initialData={editingExpense}
                  onExpenseAdded={handleExpenseAdded}
                />
                <button
                  className="btn-secondary"
                  onClick={() => setEditingExpense(null)}
                >
                  Cancel
                </button>
              </div>
            )}
            <ExpenseList
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={handleDeleteExpense}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="chat-container">
            <Chat />
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
