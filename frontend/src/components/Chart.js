/**
 * Chart Component
 */

import React from 'react';
import '../styles/Chart.css';

function Chart({ categoryData }) {
  if (!categoryData || Object.keys(categoryData).length === 0) {
    return <div className="no-data">No data to display</div>;
  }

  const maxAmount = Math.max(...Object.values(categoryData).map(item => item.amount));

  return (
    <div className="chart-container">
      <h3>Spending by Category</h3>
      <div className="bar-chart">
        {Object.entries(categoryData).map(([category, data]) => (
          <div key={category} className="chart-bar">
            <div
              className="bar"
              style={{ height: `${(data.amount / maxAmount) * 100}%` }}
              title={`${category}: ₹${data.amount.toFixed(2)}`}
            />
            <div className="label">
              <span className="category">{category}</span>
              <span className="amount">₹{data.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chart;
