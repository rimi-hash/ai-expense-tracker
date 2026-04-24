/**
 * Expense Form Component
 */

import React, { useState } from 'react';
import { expenseAPI } from '../services/api';
import '../styles/ExpenseForm.css';

function ExpenseForm({ onExpenseAdded, initialData = null }) {
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Other',
    paymentMethod: initialData?.paymentMethod || 'Credit Card',
    date: initialData?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
    notes: initialData?.notes || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Business',
    'Personal Care',
    'Fitness',
    'Groceries',
    'Other'
  ];

  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (initialData?._id) {
        await expenseAPI.update(initialData._id, formData);
      } else {
        await expenseAPI.create(formData);
      }

      if (onExpenseAdded) {
        onExpenseAdded();
      }

      // Reset form
      setFormData({
        amount: '',
        description: '',
        category: 'Other',
        paymentMethod: 'Credit Card',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Expense' : 'Add New Expense'}</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Amount *</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label>Description *</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g., Lunch at restaurant"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional notes..."
          rows="3"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Saving...' : (initialData ? 'Update Expense' : 'Add Expense')}
      </button>
    </form>
  );
}

export default ExpenseForm;
