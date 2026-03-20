import { useState } from 'react';
import { savingsAPI } from '../services/savingsApi';

function SavingsCalculator({ onResultChange }) {
  // Mode selection
  const [mode, setMode] = useState('goal'); // 'goal' or 'contribution'
  
  // Goal-based inputs
  const [savingsGoal, setSavingsGoal] = useState('');
  const [goalTimeframe, setGoalTimeframe] = useState('');
  const [goalCurrentSavings, setGoalCurrentSavings] = useState('');
  const [goalInterestRate, setGoalInterestRate] = useState('');
  
  // Contribution-based inputs
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [contribTimeframe, setContribTimeframe] = useState('');
  const [contribCurrentSavings, setContribCurrentSavings] = useState('');
  const [contribInterestRate, setContribInterestRate] = useState('');
  
  // Results
  const [goalResult, setGoalResult] = useState(null);
  const [contribResult, setContribResult] = useState(null);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Chart interaction
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const handleGoalCalculate = async (e) => {
    e.preventDefault();
    setError('');
    setGoalResult(null);

    const goal = parseFloat(savingsGoal);
    const months = parseInt(goalTimeframe);
    const current = goalCurrentSavings ? parseFloat(goalCurrentSavings) : 0;
    const interest = goalInterestRate ? parseFloat(goalInterestRate) : 0;

    if (isNaN(goal) || goal <= 0) {
      setError('Please enter a valid savings goal greater than zero');
      return;
    }

    if (isNaN(months) || months <= 0) {
      setError('Please enter a valid timeframe (at least 1 month)');
      return;
    }

    if (current < 0) {
      setError('Current savings cannot be negative');
      return;
    }

    if (interest < 0 || interest > 100) {
      setError('Interest rate must be between 0 and 100');
      return;
    }

    setIsCalculating(true);
    try {
      const calculationResult = await savingsAPI.calculateSavings(goal, months, current, interest);
      setGoalResult(calculationResult);
      if (onResultChange) onResultChange(calculationResult);
    } catch (err) {
      const msg = err.response?.data;
      setError(typeof msg === 'string' ? msg : 'Failed to calculate. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleContribCalculate = async (e) => {
    e.preventDefault();
    setError('');
    setContribResult(null);

    const contrib = parseFloat(monthlyContribution);
    const months = parseInt(contribTimeframe);
    const current = contribCurrentSavings ? parseFloat(contribCurrentSavings) : 0;
    const interest = contribInterestRate ? parseFloat(contribInterestRate) : 0;

    if (isNaN(contrib) || contrib <= 0) {
      setError('Please enter a valid monthly contribution greater than zero');
      return;
    }

    if (isNaN(months) || months <= 0) {
      setError('Please enter a valid timeframe (at least 1 month)');
      return;
    }

    if (current < 0) {
      setError('Current savings cannot be negative');
      return;
    }

    if (interest < 0 || interest > 100) {
      setError('Interest rate must be between 0 and 100');
      return;
    }

    setIsCalculating(true);
    try {
      const projections = await savingsAPI.projectGrowth(contrib, months, current, interest);
      if (!projections || projections.length === 0) {
        setError('No projection data returned. Please try again.');
        return;
      }
      const lastProjection = projections[projections.length - 1];
      const contribData = {
        projections,
        monthlyContribution: contrib,
        timeframeMonths: months,
        currentSavings: current,
        interestRate: interest,
        finalBalance: lastProjection.balance,
        totalContributed: contrib * months,
        totalInterest: lastProjection.balance - current - (contrib * months)
      };
      setContribResult(contribData);
      if (onResultChange) onResultChange(contribData);
    } catch (err) {
      const msg = err.response?.data;
      setError(typeof msg === 'string' ? msg : 'Failed to calculate. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setSavingsGoal('');
    setGoalTimeframe('');
    setGoalCurrentSavings('');
    setGoalInterestRate('');
    setMonthlyContribution('');
    setContribTimeframe('');
    setContribCurrentSavings('');
    setContribInterestRate('');
    setGoalResult(null);
    setContribResult(null);
    setError('');
    setHoveredMonth(null);
    if (onResultChange) onResultChange(null);
  };

  // Render interactive chart
  const renderInteractiveChart = (projections, maxAmount) => {
    if (!projections || projections.length === 0) return null;

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const chartWidth = rect.width;
      const monthIndex = Math.round((x / chartWidth) * projections.length);
      const clampedIndex = Math.max(0, Math.min(projections.length - 1, monthIndex));
      setHoveredMonth(projections[clampedIndex]);
    };

    const handleMouseLeave = () => {
      setHoveredMonth(null);
    };

    return (
      <div className="interactive-chart-wrapper">
        {hoveredMonth && (
          <div 
            className="chart-tooltip"
            style={{
              left: `${(hoveredMonth.month / projections.length) * 100}%`
            }}
          >
            <div className="tooltip-content">
              <strong>Month {hoveredMonth.month}</strong>
              <div>Balance: ${hoveredMonth.balance.toFixed(2)}</div>
              <div>Contribution: ${hoveredMonth.contribution.toFixed(2)}</div>
              <div>Interest: ${hoveredMonth.interestEarned.toFixed(2)}</div>
            </div>
          </div>
        )}
        <div 
          className="chart-interactive-area"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <svg className="chart-svg" viewBox={`0 0 ${projections.length * 10} 100`} preserveAspectRatio="none">
            <polyline
              points={projections.map((d, i) => `${i * 10},${100 - (d.balance / maxAmount) * 100}`).join(' ')}
              fill="none"
              stroke="#0f9b0f"
              strokeWidth="0.5"
            />
            <polygon
              points={`0,100 ${projections.map((d, i) => `${i * 10},${100 - (d.balance / maxAmount) * 100}`).join(' ')} ${projections.length * 10},100`}
              fill="url(#gradient)"
              opacity="0.3"
            />
            {hoveredMonth && (
              <circle
                cx={hoveredMonth.month * 10}
                cy={100 - (hoveredMonth.balance / maxAmount) * 100}
                r="1.5"
                fill="#0f9b0f"
                stroke="white"
                strokeWidth="0.5"
              />
            )}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#0f9b0f', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#0f9b0f', stopOpacity: 0}} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="savings-calculator-container">
      <div className="savings-header">
        <h2>🎯 Savings Goal Calculator</h2>
        <p className="subtitle">Plan your savings journey and reach your financial goals</p>
        
        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === 'goal' ? 'active' : ''}`}
            onClick={() => setMode('goal')}
          >
            🎯 Goal-Based Planning
          </button>
          <button
            className={`mode-btn ${mode === 'contribution' ? 'active' : ''}`}
            onClick={() => setMode('contribution')}
          >
            📊 Contribution-Based Growth
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {mode === 'goal' && (
        <div className="calculator-section">
          <h3>Calculate Required Contributions</h3>
          <p className="section-desc">Enter your goal and timeframe to see how much you need to save regularly</p>
          
          <form onSubmit={handleGoalCalculate} className="savings-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="savingsGoal">Savings Goal ($)</label>
                <input
                  type="number"
                  id="savingsGoal"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(e.target.value)}
                  placeholder="e.g., 10000"
                  step="0.01"
                  min="0"
                  disabled={isCalculating}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="goalTimeframe">Timeframe (months)</label>
                <input
                  type="number"
                  id="goalTimeframe"
                  value={goalTimeframe}
                  onChange={(e) => setGoalTimeframe(e.target.value)}
                  placeholder="e.g., 12"
                  min="1"
                  disabled={isCalculating}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="goalCurrentSavings">Current Savings ($ - Optional)</label>
                <input
                  type="number"
                  id="goalCurrentSavings"
                  value={goalCurrentSavings}
                  onChange={(e) => setGoalCurrentSavings(e.target.value)}
                  placeholder="e.g., 1000"
                  step="0.01"
                  min="0"
                  disabled={isCalculating}
                />
              </div>

              <div className="form-group">
                <label htmlFor="goalInterestRate">
                  Annual Interest Rate (% - Optional)
                  <span className="help-text">Use for high-yield savings accounts</span>
                </label>
                <input
                  type="number"
                  id="goalInterestRate"
                  value={goalInterestRate}
                  onChange={(e) => setGoalInterestRate(e.target.value)}
                  placeholder="e.g., 4.5"
                  step="0.01"
                  min="0"
                  max="100"
                  disabled={isCalculating}
                />
              </div>
            </div>

            <div className="button-group">
              <button type="submit" className="btn btn-primary" disabled={isCalculating}>
                {isCalculating ? 'Calculating...' : '🧮 Calculate'}
              </button>
              {goalResult && (
                <button type="button" className="btn btn-secondary" onClick={handleReset}>
                  🔄 Reset
                </button>
              )}
            </div>
          </form>

          {goalResult && (
            <div className="savings-results-section">
              <h3>📈 Your Savings Plan</h3>

              <div className="goal-summary">
                <div className="summary-row">
                  <span>Savings Goal:</span>
                  <span className="highlight">${goalResult.savingsGoal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Current Savings:</span>
                  <span>${goalResult.currentSavings.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Amount Needed:</span>
                  <span className="highlight">${(goalResult.savingsGoal - goalResult.currentSavings).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Timeframe:</span>
                  <span>{goalResult.timeframeMonths} months</span>
                </div>
                {goalResult.interestRate > 0 && (
                  <>
                    <div className="summary-row">
                      <span>Interest Rate:</span>
                      <span>{goalResult.interestRate.toFixed(2)}% annually</span>
                    </div>
                    <div className="summary-row interest-highlight">
                      <span>Total Interest Earned:</span>
                      <span className="highlight">${goalResult.totalInterestEarned.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="contribution-cards">
                <div className="contribution-card">
                  <div className="contribution-icon">📅</div>
                  <h4>Weekly</h4>
                  <div className="contribution-amount">${goalResult.weeklyContribution.toFixed(2)}</div>
                  <p>Save this amount every week</p>
                </div>
                <div className="contribution-card">
                  <div className="contribution-icon">📆</div>
                  <h4>Biweekly</h4>
                  <div className="contribution-amount">${goalResult.biweeklyContribution.toFixed(2)}</div>
                  <p>Save this amount every 2 weeks</p>
                </div>
                <div className="contribution-card">
                  <div className="contribution-icon">📊</div>
                  <h4>Monthly</h4>
                  <div className="contribution-amount">${goalResult.monthlyContribution.toFixed(2)}</div>
                  <p>Save this amount every month</p>
                </div>
              </div>

              {goalResult.monthlyProjections && goalResult.monthlyProjections.length > 0 && (
                <div className="savings-chart-section">
                  <h4>💹 Savings Growth Over Time (Interactive)</h4>
                  <p className="chart-instruction">Hover over the chart to see details for each month</p>
                  <div className="chart-container">
                    <div className="chart-y-axis">
                      {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                        <span key={ratio} className="y-label">
                          ${(goalResult.savingsGoal * 1.1 * ratio).toFixed(0)}
                        </span>
                      ))}
                    </div>
                    <div className="chart-area">
                      <div className="goal-line" style={{bottom: `${(goalResult.savingsGoal / (goalResult.savingsGoal * 1.1)) * 100}%`}}>
                        <span className="goal-label">Goal: ${goalResult.savingsGoal.toFixed(0)}</span>
                      </div>
                      {renderInteractiveChart(goalResult.monthlyProjections, goalResult.savingsGoal * 1.1)}
                      <div className="chart-x-axis">
                        <span>Start</span>
                        <span>Month {Math.floor(goalResult.timeframeMonths / 2)}</span>
                        <span>Month {goalResult.timeframeMonths}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="savings-tips">
                <h4>💡 Tips to Reach Your Goal</h4>
                <ul>
                  <li>Set up automatic transfers to make saving effortless</li>
                  <li>Consider opening a high-yield savings account for better returns</li>
                  <li>Track your progress monthly and celebrate milestones</li>
                  <li>Review and adjust your budget to free up more money for savings</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'contribution' && (
        <div className="calculator-section">
          <h3>Project Your Savings Growth</h3>
          <p className="section-desc">See how your regular contributions will grow over time with interest</p>
          
          <form onSubmit={handleContribCalculate} className="savings-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="monthlyContribution">Monthly Contribution ($)</label>
                <input
                  type="number"
                  id="monthlyContribution"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="e.g., 500"
                  step="0.01"
                  min="0"
                  disabled={isCalculating}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contribTimeframe">Timeframe (months)</label>
                <input
                  type="number"
                  id="contribTimeframe"
                  value={contribTimeframe}
                  onChange={(e) => setContribTimeframe(e.target.value)}
                  placeholder="e.g., 24"
                  min="1"
                  disabled={isCalculating}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contribCurrentSavings">Current Savings ($ - Optional)</label>
                <input
                  type="number"
                  id="contribCurrentSavings"
                  value={contribCurrentSavings}
                  onChange={(e) => setContribCurrentSavings(e.target.value)}
                  placeholder="e.g., 1000"
                  step="0.01"
                  min="0"
                  disabled={isCalculating}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contribInterestRate">
                  Annual Interest Rate (% - Optional)
                  <span className="help-text">Use for high-yield savings accounts</span>
                </label>
                <input
                  type="number"
                  id="contribInterestRate"
                  value={contribInterestRate}
                  onChange={(e) => setContribInterestRate(e.target.value)}
                  placeholder="e.g., 4.5"
                  step="0.01"
                  min="0"
                  max="100"
                  disabled={isCalculating}
                />
              </div>
            </div>

            <div className="button-group">
              <button type="submit" className="btn btn-primary" disabled={isCalculating}>
                {isCalculating ? 'Calculating...' : '📈 Project Growth'}
              </button>
              {contribResult && (
                <button type="button" className="btn btn-secondary" onClick={handleReset}>
                  🔄 Reset
                </button>
              )}
            </div>
          </form>

          {contribResult && (
            <div className="savings-results-section">
              <h3>📊 Your Savings Projection</h3>

              <div className="projection-summary">
                <div className="summary-card-large">
                  <div className="card-label">Final Balance After {contribResult.timeframeMonths} Months</div>
                  <div className="card-value-large">${contribResult.finalBalance.toFixed(2)}</div>
                </div>

                <div className="summary-grid">
                  <div className="summary-item">
                    <span>Monthly Contribution:</span>
                    <span className="value">${contribResult.monthlyContribution.toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Starting Balance:</span>
                    <span className="value">${contribResult.currentSavings.toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Total Contributed:</span>
                    <span className="value">${contribResult.totalContributed.toFixed(2)}</span>
                  </div>
                  {contribResult.interestRate > 0 && (
                    <>
                      <div className="summary-item">
                        <span>Interest Rate:</span>
                        <span className="value">{contribResult.interestRate.toFixed(2)}% annually</span>
                      </div>
                      <div className="summary-item highlight">
                        <span>Total Interest Earned:</span>
                        <span className="value">${contribResult.totalInterest.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="savings-chart-section">
                <h4>💹 Interactive Growth Chart</h4>
                <p className="chart-instruction">Hover over the chart to see exact amounts for any month</p>
                <div className="chart-container">
                  <div className="chart-y-axis">
                    {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                      <span key={ratio} className="y-label">
                        ${(contribResult.finalBalance * 1.1 * ratio).toFixed(0)}
                      </span>
                    ))}
                  </div>
                  <div className="chart-area">
                    {renderInteractiveChart(contribResult.projections, contribResult.finalBalance * 1.1)}
                    <div className="chart-x-axis">
                      <span>Start</span>
                      <span>Month {Math.floor(contribResult.timeframeMonths / 2)}</span>
                      <span>Month {contribResult.timeframeMonths}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="savings-tips">
                <h4>💡 Maximizing Your Savings</h4>
                <ul>
                  <li>Consider increasing contributions as your income grows</li>
                  <li>Shop around for the best high-yield savings account rates</li>
                  <li>Automate your monthly contributions for consistency</li>
                  <li>Reinvest any windfalls or bonuses to accelerate growth</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SavingsCalculator;
