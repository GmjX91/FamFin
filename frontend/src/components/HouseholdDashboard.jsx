const CATEGORY_COLORS = {
  'Housing': '#2196F3',
  'Utilities': '#FF9800',
  'Subscriptions': '#9C27B0',
  'Transportation': '#00BCD4',
  'Insurance': '#F44336',
  'Food & Groceries': '#4CAF50',
  'Other': '#607D8B'
};

function HouseholdDashboard({ bills, summary, payCalcResult1, payCalcResult2, householdIncomes, savingsResult }) {
  const inc1 = parseFloat(householdIncomes.person1) || 0;
  const inc2 = parseFloat(householdIncomes.person2) || 0;
  const householdIncome = inc1 + inc2;
  const hasIncomes = inc1 > 0 && inc2 > 0;
  const hasAnyIncome = inc1 > 0 || inc2 > 0;

  const person1Pct = hasIncomes ? (inc1 / householdIncome) * 100 : 0;
  const person2Pct = hasIncomes ? (inc2 / householdIncome) * 100 : 0;

  const totalBills = summary ? summary.total : 0;
  const billCount = summary ? summary.count : 0;
  const person1Bills = totalBills * (person1Pct / 100);
  const person2Bills = totalBills * (person2Pct / 100);

  const fmt = (n) => isFinite(n) ? `$${n.toFixed(2)}` : '$0.00';

  // Group bills by category
  const categoryTotals = {};
  if (bills && bills.length > 0) {
    bills.forEach(bill => {
      const cat = bill.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + bill.amount;
    });
  }
  const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  // 50/30/20 budget for each person
  const p1Budget = { needs: inc1 * 0.50, wants: inc1 * 0.30, savings: inc1 * 0.20 };
  const p2Budget = { needs: inc2 * 0.50, wants: inc2 * 0.30, savings: inc2 * 0.20 };

  // Remaining needs budget after bills
  const p1NeedsRemaining = p1Budget.needs - person1Bills;
  const p2NeedsRemaining = p2Budget.needs - person2Bills;

  // Savings goal info
  const hasSavingsGoal = savingsResult && savingsResult.savingsGoal;
  const goalMonthlyContrib = hasSavingsGoal ? savingsResult.monthlyContribution : 0;
  const p1SavingsContrib = goalMonthlyContrib * (person1Pct / 100);
  const p2SavingsContrib = goalMonthlyContrib * (person2Pct / 100);

  // Financial health
  const p1Remaining = inc1 - person1Bills;
  const p2Remaining = inc2 - person2Bills;
  const combinedRemaining = householdIncome - totalBills;

  const getHealthStatus = (remaining, income) => {
    if (income === 0) return { label: 'No Data', color: '#999', icon: '⚪' };
    const ratio = remaining / income;
    if (ratio >= 0.40) return { label: 'Healthy', color: '#4CAF50', icon: '🟢' };
    if (ratio >= 0.20) return { label: 'Fair', color: '#FF9800', icon: '🟡' };
    return { label: 'Tight', color: '#f44336', icon: '🔴' };
  };

  const p1Health = getHealthStatus(p1Remaining, inc1);
  const p2Health = getHealthStatus(p2Remaining, inc2);
  const hhHealth = getHealthStatus(combinedRemaining, householdIncome);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>🏠 Household Dashboard</h2>
        <p className="dashboard-subtitle">Your complete household financial overview</p>
      </div>

      {/* Section 1: Income Overview */}
      <div className="dash-section">
        <h3>💰 Household Income</h3>
        {hasIncomes ? (
          <>
            <div className="dash-income-total">
              <span className="dash-income-label">Combined Monthly Income</span>
              <span className="dash-income-value">{fmt(householdIncome)}</span>
            </div>
            <div className="dash-pct-bar">
              <div className="dash-pct-fill person1" style={{ width: `${person1Pct}%` }}>
                {person1Pct >= 18 && <span>Person 1: {person1Pct.toFixed(1)}%</span>}
              </div>
              <div className="dash-pct-fill person2" style={{ width: `${person2Pct}%` }}>
                {person2Pct >= 18 && <span>Person 2: {person2Pct.toFixed(1)}%</span>}
              </div>
            </div>
            <div className="dash-pct-labels">
              <span>Person 1: {fmt(inc1)}/mo</span>
              <span>Person 2: {fmt(inc2)}/mo</span>
            </div>
          </>
        ) : (
          <div className="dash-empty-state">
            <p>
              {hasAnyIncome
                ? 'Enter both incomes in the Bills Tracker tab to see the full breakdown.'
                : 'Use the Pay Calculator to compute incomes, or enter them in the Bills Tracker tab.'}
            </p>
          </div>
        )}
      </div>

      {/* Section 2: Bills & Responsibilities */}
      <div className="dash-section">
        <h3>📋 Bills & Responsibilities</h3>
        {billCount > 0 && hasIncomes ? (
          <>
            <div className="dash-bills-total">
              <span>Total Monthly Bills ({billCount} bills)</span>
              <span className="dash-bills-amount">{fmt(totalBills)}</span>
            </div>
            <div className="dash-split-cards">
              <div className="dash-card person1-card">
                <div className="dash-card-label">Person 1 Owes</div>
                <div className="dash-card-value">{fmt(person1Bills)}</div>
                <div className="dash-card-sub">{person1Pct.toFixed(1)}% of total</div>
              </div>
              <div className="dash-card person2-card">
                <div className="dash-card-label">Person 2 Owes</div>
                <div className="dash-card-value">{fmt(person2Bills)}</div>
                <div className="dash-card-sub">{person2Pct.toFixed(1)}% of total</div>
              </div>
            </div>
          </>
        ) : (
          <div className="dash-empty-state">
            <p>
              {billCount === 0
                ? 'No bills added yet. Add bills in the Bills Tracker tab.'
                : 'Enter both incomes to see how bills are split.'}
            </p>
          </div>
        )}
      </div>

      {/* Section 2b: Spending by Category */}
      {billCount > 0 && (
        <div className="dash-section">
          <h3>🍩 Spending by Category</h3>
          <div className="donut-chart-container">
            <svg width="180" height="180" viewBox="0 0 180 180">
              {(() => {
                const radius = 70;
                const circumference = 2 * Math.PI * radius;
                let offset = 0;
                return categoryEntries.map(([cat, amount]) => {
                  const pct = amount / totalBills;
                  const dash = circumference * pct;
                  const currentOffset = offset;
                  offset += dash;
                  return (
                    <circle
                      key={cat}
                      cx="90" cy="90" r={radius}
                      fill="none"
                      stroke={CATEGORY_COLORS[cat] || '#607D8B'}
                      strokeWidth="30"
                      strokeDasharray={`${dash} ${circumference - dash}`}
                      strokeDashoffset={-currentOffset}
                      transform="rotate(-90 90 90)"
                    />
                  );
                });
              })()}
              <text x="90" y="85" textAnchor="middle" fontSize="18" fontWeight="bold" fill="var(--text-primary)">{fmt(totalBills)}</text>
              <text x="90" y="103" textAnchor="middle" fontSize="12" fill="var(--text-muted)">total</text>
            </svg>
            <div className="donut-chart-legend">
              {categoryEntries.map(([cat, amount]) => (
                <div key={cat} className="legend-item">
                  <span className="legend-swatch" style={{ background: CATEGORY_COLORS[cat] || '#607D8B' }} />
                  <span className="legend-label">{cat}</span>
                  <span className="legend-value">{fmt(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 3: 50/30/20 Budget Per Person */}
      {hasIncomes && (
        <div className="dash-section">
          <h3>📊 50/30/20 Household Budget</h3>
          <p className="dash-section-desc">Each person's budget based on their income, with bills deducted from Needs</p>

          <div className="dash-budget-grid">
            {/* Person 1 Budget */}
            <div className="dash-budget-person">
              <h4 className="person1-text">Person 1 — {fmt(inc1)}/mo</h4>
              <div className="dash-budget-row needs">
                <div className="dash-budget-category">
                  <span className="dash-budget-icon">🏠</span>
                  <span>Needs (50%)</span>
                </div>
                <div className="dash-budget-amounts">
                  <span className="dash-budget-total">{fmt(p1Budget.needs)}</span>
                  {totalBills > 0 && (
                    <span className={`dash-budget-remaining ${p1NeedsRemaining < 0 ? 'over-budget' : ''}`}>
                      After bills: {fmt(p1NeedsRemaining)}
                    </span>
                  )}
                </div>
              </div>
              <div className="dash-budget-row wants">
                <div className="dash-budget-category">
                  <span className="dash-budget-icon">🎉</span>
                  <span>Wants (30%)</span>
                </div>
                <div className="dash-budget-amounts">
                  <span className="dash-budget-total">{fmt(p1Budget.wants)}</span>
                </div>
              </div>
              <div className="dash-budget-row savings-row">
                <div className="dash-budget-category">
                  <span className="dash-budget-icon">💰</span>
                  <span>Savings (20%)</span>
                </div>
                <div className="dash-budget-amounts">
                  <span className="dash-budget-total">{fmt(p1Budget.savings)}</span>
                  {hasSavingsGoal && (
                    <span className="dash-budget-goal">Goal contrib: {fmt(p1SavingsContrib)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Person 2 Budget */}
            <div className="dash-budget-person">
              <h4 className="person2-text">Person 2 — {fmt(inc2)}/mo</h4>
              <div className="dash-budget-row needs">
                <div className="dash-budget-category">
                  <span className="dash-budget-icon">🏠</span>
                  <span>Needs (50%)</span>
                </div>
                <div className="dash-budget-amounts">
                  <span className="dash-budget-total">{fmt(p2Budget.needs)}</span>
                  {totalBills > 0 && (
                    <span className={`dash-budget-remaining ${p2NeedsRemaining < 0 ? 'over-budget' : ''}`}>
                      After bills: {fmt(p2NeedsRemaining)}
                    </span>
                  )}
                </div>
              </div>
              <div className="dash-budget-row wants">
                <div className="dash-budget-category">
                  <span className="dash-budget-icon">🎉</span>
                  <span>Wants (30%)</span>
                </div>
                <div className="dash-budget-amounts">
                  <span className="dash-budget-total">{fmt(p2Budget.wants)}</span>
                </div>
              </div>
              <div className="dash-budget-row savings-row">
                <div className="dash-budget-category">
                  <span className="dash-budget-icon">💰</span>
                  <span>Savings (20%)</span>
                </div>
                <div className="dash-budget-amounts">
                  <span className="dash-budget-total">{fmt(p2Budget.savings)}</span>
                  {hasSavingsGoal && (
                    <span className="dash-budget-goal">Goal contrib: {fmt(p2SavingsContrib)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Savings Goal */}
      {hasSavingsGoal && hasIncomes && (
        <div className="dash-section">
          <h3>🎯 Household Savings Goal</h3>
          <div className="dash-savings-overview">
            <div className="dash-savings-goal-card">
              <div className="dash-card-label">Goal Amount</div>
              <div className="dash-card-value">{fmt(savingsResult.savingsGoal)}</div>
              <div className="dash-card-sub">{savingsResult.timeframeMonths} months</div>
            </div>
            <div className="dash-card person1-card">
              <div className="dash-card-label">Person 1 Contribution</div>
              <div className="dash-card-value">{fmt(p1SavingsContrib)}</div>
              <div className="dash-card-sub">{person1Pct.toFixed(1)}% of {fmt(goalMonthlyContrib)}/mo</div>
            </div>
            <div className="dash-card person2-card">
              <div className="dash-card-label">Person 2 Contribution</div>
              <div className="dash-card-value">{fmt(p2SavingsContrib)}</div>
              <div className="dash-card-sub">{person2Pct.toFixed(1)}% of {fmt(goalMonthlyContrib)}/mo</div>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Financial Health Summary */}
      {hasAnyIncome && (
        <div className="dash-section">
          <h3>❤️ Financial Health</h3>
          <div className="dash-health-grid">
            <div className="dash-health-card">
              <div className="dash-health-icon">{hhHealth.icon}</div>
              <div className="dash-health-label">Household</div>
              <div className="dash-health-value">{fmt(combinedRemaining)}</div>
              <div className="dash-health-detail">remaining after bills</div>
              <div className="dash-health-status" style={{ color: hhHealth.color }}>{hhHealth.label}</div>
            </div>
            <div className="dash-health-card">
              <div className="dash-health-icon">{p1Health.icon}</div>
              <div className="dash-health-label">Person 1</div>
              <div className="dash-health-value">{fmt(p1Remaining)}</div>
              <div className="dash-health-detail">remaining after bills</div>
              <div className="dash-health-status" style={{ color: p1Health.color }}>{p1Health.label}</div>
            </div>
            <div className="dash-health-card">
              <div className="dash-health-icon">{p2Health.icon}</div>
              <div className="dash-health-label">Person 2</div>
              <div className="dash-health-value">{fmt(p2Remaining)}</div>
              <div className="dash-health-detail">remaining after bills</div>
              <div className="dash-health-status" style={{ color: p2Health.color }}>{p2Health.label}</div>
            </div>
          </div>
          <div className="dash-health-legend">
            <span>🟢 Healthy: 40%+ income remaining</span>
            <span>🟡 Fair: 20-40% remaining</span>
            <span>🔴 Tight: Under 20% remaining</span>
          </div>
        </div>
      )}

      {/* Getting Started Prompt */}
      {!hasIncomes && billCount === 0 && (
        <div className="dash-section dash-getting-started">
          <h3>🚀 Getting Started</h3>
          <div className="dash-steps">
            <div className="dash-step">
              <div className="dash-step-num">1</div>
              <div className="dash-step-text">
                <strong>Calculate Pay</strong>
                <p>Use the Pay Calculator tab to compute take-home pay for both household members</p>
              </div>
            </div>
            <div className="dash-step">
              <div className="dash-step-num">2</div>
              <div className="dash-step-text">
                <strong>Add Bills</strong>
                <p>Add your monthly bills in the Bills Tracker tab</p>
              </div>
            </div>
            <div className="dash-step">
              <div className="dash-step-num">3</div>
              <div className="dash-step-text">
                <strong>Set a Goal</strong>
                <p>Use Savings Goals to set a target, and see each person's contribution here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HouseholdDashboard;
