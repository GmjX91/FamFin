import { useState, useEffect } from 'react';

function BillSplit({ bills, summary, incomes, onIncomeChange, payCalcResult1, payCalcResult2 }) {
  const [roundAmounts, setRoundAmounts] = useState(false);
  const [autoFilled1, setAutoFilled1] = useState(false);
  const [autoFilled2, setAutoFilled2] = useState(false);

  // Auto-populate Person 1 income from Pay Calculator result
  useEffect(() => {
    if (payCalcResult1 && payCalcResult1.monthlyNet) {
      onIncomeChange(prev => ({ ...prev, person1: payCalcResult1.monthlyNet.toFixed(2) }));
      setAutoFilled1(true);
    } else {
      setAutoFilled1(false);
    }
  }, [payCalcResult1]);

  // Auto-populate Person 2 income from Pay Calculator result
  useEffect(() => {
    if (payCalcResult2 && payCalcResult2.monthlyNet) {
      onIncomeChange(prev => ({ ...prev, person2: payCalcResult2.monthlyNet.toFixed(2) }));
      setAutoFilled2(true);
    } else {
      setAutoFilled2(false);
    }
  }, [payCalcResult2]);

  const inc1 = parseFloat(incomes.person1) || 0;
  const inc2 = parseFloat(incomes.person2) || 0;
  const householdIncome = inc1 + inc2;
  const hasValidIncomes = inc1 > 0 && inc2 > 0;

  const person1Pct = hasValidIncomes ? (inc1 / householdIncome) * 100 : 0;
  const person2Pct = hasValidIncomes ? (inc2 / householdIncome) * 100 : 0;

  const formatAmount = (amount) => {
    const value = roundAmounts ? Math.round(amount) : amount;
    return `$${value.toFixed(2)}`;
  };

  const totalBills = summary ? summary.total : 0;
  const person1Total = totalBills * (person1Pct / 100);
  const person2Total = totalBills * (person2Pct / 100);

  const handleReset = () => {
    onIncomeChange({ person1: '', person2: '' });
    setRoundAmounts(false);
    setAutoFilled1(false);
    setAutoFilled2(false);
  };

  return (
    <div className="bill-split-container">
      <h2>🏠 Household Bill Split</h2>
      <p className="split-subtitle">
        Split bills proportionally based on each person's income
      </p>

      <div className="split-income-form">
        <div className="split-income-row">
          <div className="form-group">
            <label htmlFor="income1">
              Person 1 — Monthly Income ($)
              {autoFilled1 && (
                <span className="auto-fill-badge">From Pay Calculator</span>
              )}
            </label>
            <input
              type="number"
              id="income1"
              value={incomes.person1}
              onChange={(e) => {
                onIncomeChange(prev => ({ ...prev, person1: e.target.value }));
                if (autoFilled1) setAutoFilled1(false);
              }}
              placeholder="e.g., 3500.00"
              step="0.01"
              min="0"
              max="999999.99"
            />
          </div>

          <div className="form-group">
            <label htmlFor="income2">
              Person 2 — Monthly Income ($)
              {autoFilled2 && (
                <span className="auto-fill-badge">From Pay Calculator</span>
              )}
            </label>
            <input
              type="number"
              id="income2"
              value={incomes.person2}
              onChange={(e) => {
                onIncomeChange(prev => ({ ...prev, person2: e.target.value }));
                if (autoFilled2) setAutoFilled2(false);
              }}
              placeholder="e.g., 2800.00"
              step="0.01"
              min="0"
              max="999999.99"
            />
          </div>
        </div>

        <div className="split-options-row">
          <label className="toggle-option">
            <input
              type="checkbox"
              checked={roundAmounts}
              onChange={(e) => setRoundAmounts(e.target.checked)}
            />
            <span>Round amounts to nearest dollar</span>
          </label>
          {hasValidIncomes && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
              🔄 Reset
            </button>
          )}
        </div>
      </div>

      {!hasValidIncomes && (inc1 > 0 || inc2 > 0) && (
        <div className="split-prompt">
          <p>Enter both incomes to see the proportional bill split.</p>
        </div>
      )}

      {hasValidIncomes && (
        <div className="split-results">
          {/* Percentage Bar */}
          <div className="split-pct-section">
            <h3>Income Split</h3>
            <div className="split-pct-bar">
              <div
                className="split-pct-fill person1"
                style={{ width: `${person1Pct}%` }}
              >
                {person1Pct >= 15 && (
                  <span>Person 1: {person1Pct.toFixed(1)}%</span>
                )}
              </div>
              <div
                className="split-pct-fill person2"
                style={{ width: `${person2Pct}%` }}
              >
                {person2Pct >= 15 && (
                  <span>Person 2: {person2Pct.toFixed(1)}%</span>
                )}
              </div>
            </div>
            <div className="split-pct-labels">
              <span>Person 1: {person1Pct.toFixed(1)}% ({formatAmount(inc1)}/mo)</span>
              <span>Person 2: {person2Pct.toFixed(1)}% ({formatAmount(inc2)}/mo)</span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="split-summary-cards">
            <div className="split-card person1-card">
              <div className="split-card-label">Person 1 Owes</div>
              <div className="split-card-value">{formatAmount(person1Total)}</div>
              <div className="split-card-pct">{person1Pct.toFixed(1)}% of {formatAmount(totalBills)}</div>
            </div>
            <div className="split-card person2-card">
              <div className="split-card-label">Person 2 Owes</div>
              <div className="split-card-value">{formatAmount(person2Total)}</div>
              <div className="split-card-pct">{person2Pct.toFixed(1)}% of {formatAmount(totalBills)}</div>
            </div>
          </div>

          {/* Per-Bill Breakdown */}
          {bills.length > 0 ? (
            <div className="split-breakdown">
              <h3>Per-Bill Breakdown</h3>
              <div className="table-responsive">
                <table className="split-table">
                  <thead>
                    <tr>
                      <th>Bill Name</th>
                      <th>Total</th>
                      <th>Person 1 ({person1Pct.toFixed(1)}%)</th>
                      <th>Person 2 ({person2Pct.toFixed(1)}%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill) => {
                      const p1Share = bill.amount * (person1Pct / 100);
                      const p2Share = bill.amount * (person2Pct / 100);
                      return (
                        <tr key={bill.id}>
                          <td>{bill.name}</td>
                          <td className="amount">${bill.amount.toFixed(2)}</td>
                          <td className="person1-amount">{formatAmount(p1Share)}</td>
                          <td className="person2-amount">{formatAmount(p2Share)}</td>
                        </tr>
                      );
                    })}
                    <tr className="split-total-row">
                      <td><strong>Total</strong></td>
                      <td className="amount"><strong>{formatAmount(totalBills)}</strong></td>
                      <td className="person1-amount"><strong>{formatAmount(person1Total)}</strong></td>
                      <td className="person2-amount"><strong>{formatAmount(person2Total)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="split-no-bills">
              <p>Add some bills above to see how they split between Person 1 and Person 2.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BillSplit;
