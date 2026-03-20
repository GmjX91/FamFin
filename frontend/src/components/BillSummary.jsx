function BillSummary({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    <div className="bill-summary">
      <h2>Monthly Summary</h2>
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-label">Total Bills</div>
          <div className="summary-value">${(summary.total ?? 0).toFixed(2)}</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-label">Average Bill</div>
          <div className="summary-value">${(summary.average ?? 0).toFixed(2)}</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-label">Number of Bills</div>
          <div className="summary-value">{summary.count}</div>
        </div>
      </div>
    </div>
  );
}

export default BillSummary;
