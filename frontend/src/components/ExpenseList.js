/**
 * Expense List Component
 */

import React from 'react';
import '../styles/ExpenseList.css';

function ExpenseList({ expenses, onEdit, onDelete, loading }) {
  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  if (!expenses || expenses.length === 0) {
    return <div className="no-data">No expenses found. Start adding some!</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="expense-list">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense._id} className={expense.isAnomalous ? 'anomaly-row' : ''}>
              <td>{formatDate(expense.date)}</td>
              <td>{expense.description}</td>
              <td>{expense.category}</td>
              <td className="amount">₹{expense.amount.toFixed(2)}</td>
              <td>{expense.paymentMethod}</td>
              <td className="actions">
                <button className="btn-edit" onClick={() => onEdit(expense)}>Edit</button>
                <button className="btn-delete" onClick={() => onDelete(expense._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;
