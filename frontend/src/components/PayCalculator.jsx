import { useState } from 'react';
import { payCalculatorAPI } from '../services/payCalculatorApi';

function PayCalculator({ onResult1Change, onResult2Change }) {
  // Person 1 state
  const [calculationType, setCalculationType] = useState('hourly');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [payPeriod, setPayPeriod] = useState('biweekly');
  const [showPaycheck, setShowPaycheck] = useState(false);
  const [showBudget, setShowBudget] = useState(false);

  // Person 2 state
  const [showPerson2, setShowPerson2] = useState(false);
  const [calcType2, setCalcType2] = useState('hourly');
  const [inputValue2, setInputValue2] = useState('');
  const [result2, setResult2] = useState(null);
  const [error2, setError2] = useState('');
  const [isCalculating2, setIsCalculating2] = useState(false);
  const [payPeriod2, setPayPeriod2] = useState('biweekly');
  const [showPaycheck2, setShowPaycheck2] = useState(false);
  const [showBudget2, setShowBudget2] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid positive number');
      return;
    }
    if (calculationType === 'hourly' && value > 10000) {
      setError('Hourly rate cannot exceed $10,000');
      return;
    }
    if (calculationType === 'yearly' && value > 10000000) {
      setError('Salary cannot exceed $10,000,000');
      return;
    }

    setIsCalculating(true);
    try {
      let calculationResult;
      if (calculationType === 'hourly') {
        calculationResult = await payCalculatorAPI.calculateFromHourly(value);
      } else {
        calculationResult = await payCalculatorAPI.calculateFromYearly(value);
      }
      setResult(calculationResult);
      if (onResult1Change) onResult1Change(calculationResult);
    } catch (err) {
      const msg = err.response?.data;
      setError(typeof msg === 'string' ? msg : 'Failed to calculate. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCalculate2 = async (e) => {
    e.preventDefault();
    setError2('');
    setResult2(null);

    const value = parseFloat(inputValue2);
    if (isNaN(value) || value <= 0) {
      setError2('Please enter a valid positive number');
      return;
    }
    if (calcType2 === 'hourly' && value > 10000) {
      setError2('Hourly rate cannot exceed $10,000');
      return;
    }
    if (calcType2 === 'yearly' && value > 10000000) {
      setError2('Salary cannot exceed $10,000,000');
      return;
    }

    setIsCalculating2(true);
    try {
      let calculationResult;
      if (calcType2 === 'hourly') {
        calculationResult = await payCalculatorAPI.calculateFromHourly(value);
      } else {
        calculationResult = await payCalculatorAPI.calculateFromYearly(value);
      }
      setResult2(calculationResult);
      if (onResult2Change) onResult2Change(calculationResult);
    } catch (err) {
      const msg = err.response?.data;
      setError2(typeof msg === 'string' ? msg : 'Failed to calculate. Please try again.');
    } finally {
      setIsCalculating2(false);
    }
  };

  const handleReset = () => {
    setInputValue('');
    setResult(null);
    setError('');
    setShowPaycheck(false);
    setShowBudget(false);
    if (onResult1Change) onResult1Change(null);
  };

  const handleReset2 = () => {
    setInputValue2('');
    setResult2(null);
    setError2('');
    setShowPaycheck2(false);
    setShowBudget2(false);
    if (onResult2Change) onResult2Change(null);
  };

  const handleTogglePerson2 = () => {
    if (showPerson2) {
      // Collapsing — clear Person 2 data
      handleReset2();
    }
    setShowPerson2(!showPerson2);
  };

  // Calculate individual tax deductions
  const calculateDeductions = (grossPay) => {
    const federalTax = grossPay * 0.12;
    const stateTax = grossPay * 0.045;
    const socialSecurity = grossPay * 0.062;
    const medicare = grossPay * 0.0145;
    const totalDeductions = federalTax + stateTax + socialSecurity + medicare;
    const netPay = grossPay - totalDeductions;
    
    return {
      grossPay,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      totalDeductions,
      netPay
    };
  };

  // Calculate 50/30/20 budget
  const calculate503020Budget = (monthlyNet) => {
    return {
      needs: monthlyNet * 0.50,
      wants: monthlyNet * 0.30,
      savings: monthlyNet * 0.20
    };
  };

  // Render a pay breakdown section for either person
  const renderBreakdown = (res, period, showPay, setShowPay, showBdg, setShowBdg, personLabel, isP2) => (
    <div className={`pay-breakdown-section ${isP2 ? 'person2-accent' : ''}`}>
      <h3>{personLabel} Pay Breakdown</h3>
      
      <div className="breakdown-header">
        <div className={`breakdown-item ${isP2 ? 'person2-bg' : ''}`}>
          <span className="label">Hourly Rate:</span>
          <span className="value">${res.hourlyRate.toFixed(2)}/hr</span>
        </div>
        <div className={`breakdown-item ${isP2 ? 'person2-bg' : ''}`}>
          <span className="label">Annual Salary:</span>
          <span className="value">${res.yearlySalary.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
      </div>

      <table className="breakdown-table">
        <thead>
          <tr>
            <th>Pay Period</th>
            <th>Gross Pay</th>
            <th>Net Pay (Take Home)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Weekly</td>
            <td>${res.weeklyGross.toFixed(2)}</td>
            <td className="net-pay">${res.weeklyNet.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Biweekly (Every 2 weeks)</td>
            <td>${res.biweeklyGross.toFixed(2)}</td>
            <td className="net-pay">${res.biweeklyNet.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Monthly</td>
            <td>${res.monthlyGross.toFixed(2)}</td>
            <td className="net-pay">${res.monthlyNet.toFixed(2)}</td>
          </tr>
          <tr className="yearly-row">
            <td><strong>Yearly</strong></td>
            <td><strong>${res.yearlySalary.toFixed(2)}</strong></td>
            <td className="net-pay"><strong>${(res.yearlySalary * (1 - res.totalTaxRate)).toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>

      <div className="tax-info">
        <h4>Tax Information</h4>
        <p>Estimated total tax rate: <strong>{(res.totalTaxRate * 100).toFixed(2)}%</strong></p>
        <p className="tax-note">
          <small>
            * Based on Federal (12%), NC State (4.5%), Social Security (6.2%), and Medicare (1.45%) taxes.
            Actual taxes may vary based on deductions, credits, and other factors.
          </small>
        </p>
      </div>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={() => setShowPay(!showPay)}>
          {showPay ? '🔼 Hide' : '📄 Show'} Paycheck Breakdown
        </button>
        <button className="btn btn-secondary" onClick={() => setShowBdg(!showBdg)}>
          {showBdg ? '🔼 Hide' : '📊 Show'} 50/30/20 Budget
        </button>
      </div>

      {showPay && (
        <div className="paycheck-breakdown">
          <h4>💼 {period === 'weekly' ? 'Weekly' : 'Biweekly'} Paycheck Breakdown</h4>
          {(() => {
            const grossPay = period === 'weekly' ? res.weeklyGross : res.biweeklyGross;
            const deductions = calculateDeductions(grossPay);
            return (
              <div className="paycheck-stub">
                <div className={`stub-header ${isP2 ? 'person2-bg' : ''}`}>
                  <h5>EARNINGS</h5>
                </div>
                <div className="stub-row">
                  <span>Gross Pay</span>
                  <span className="amount">${deductions.grossPay.toFixed(2)}</span>
                </div>
                <div className={`stub-header ${isP2 ? 'person2-bg' : ''}`}>
                  <h5>DEDUCTIONS</h5>
                </div>
                <div className="stub-row">
                  <span>Federal Income Tax</span>
                  <span className="deduction">-${deductions.federalTax.toFixed(2)}</span>
                </div>
                <div className="stub-row">
                  <span>State Income Tax (NC)</span>
                  <span className="deduction">-${deductions.stateTax.toFixed(2)}</span>
                </div>
                <div className="stub-row">
                  <span>Social Security Tax (6.2%)</span>
                  <span className="deduction">-${deductions.socialSecurity.toFixed(2)}</span>
                </div>
                <div className="stub-row">
                  <span>Medicare Tax (1.45%)</span>
                  <span className="deduction">-${deductions.medicare.toFixed(2)}</span>
                </div>
                <div className="stub-row total-deductions">
                  <span><strong>Total Deductions</strong></span>
                  <span className="deduction"><strong>-${deductions.totalDeductions.toFixed(2)}</strong></span>
                </div>
                <div className={`stub-footer ${isP2 ? 'person2-footer' : ''}`}>
                  <div className="stub-row net-pay">
                    <span><strong>NET PAY</strong></span>
                    <span className="amount"><strong>${deductions.netPay.toFixed(2)}</strong></span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {showBdg && (
        <div className="budget-breakdown">
          <h4>📊 50/30/20 Budget Plan</h4>
          <p className="budget-description">
            The 50/30/20 rule is a simple budgeting method that divides your after-tax income into three categories:
          </p>
          {(() => {
            const budget = calculate503020Budget(res.monthlyNet);
            return (
              <div className="budget-cards">
                <div className="budget-card needs">
                  <div className="budget-icon">🏠</div>
                  <h5>50% Needs</h5>
                  <div className="budget-amount">${budget.needs.toFixed(2)}</div>
                  <p>Essentials like rent, groceries, utilities, insurance, minimum loan payments</p>
                </div>
                <div className="budget-card wants">
                  <div className="budget-icon">🎉</div>
                  <h5>30% Wants</h5>
                  <div className="budget-amount">${budget.wants.toFixed(2)}</div>
                  <p>Entertainment, dining out, hobbies, subscriptions, non-essential purchases</p>
                </div>
                <div className="budget-card savings">
                  <div className="budget-icon">💰</div>
                  <h5>20% Savings</h5>
                  <div className="budget-amount">${budget.savings.toFixed(2)}</div>
                  <p>Emergency fund, retirement accounts, investments, debt payoff beyond minimums</p>
                </div>
              </div>
            );
          })()}
          <div className="budget-note">
            <small>* Based on monthly net income of ${res.monthlyNet.toFixed(2)}</small>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="pay-calculator-container">
      <div className="calculator-form-section">
        <h2>💰 Salary & Pay Calculator</h2>
        <p className="subtitle">Calculate your take-home pay after taxes</p>

        <form onSubmit={handleCalculate} className="pay-calc-form">
          <div className="calc-type-selector">
            <label className="radio-option">
              <input
                type="radio"
                value="hourly"
                checked={calculationType === 'hourly'}
                onChange={(e) => setCalculationType(e.target.value)}
              />
              <span>Calculate from Hourly Rate</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="yearly"
                checked={calculationType === 'yearly'}
                onChange={(e) => setCalculationType(e.target.value)}
              />
              <span>Calculate from Yearly Salary</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="inputValue">
              {calculationType === 'hourly' ? 'Hourly Rate ($)' : 'Yearly Salary ($)'}
            </label>
            <input
              type="number"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={calculationType === 'hourly' ? 'e.g., 25.00' : 'e.g., 52000'}
              step="0.01"
              min="0"
              disabled={isCalculating}
              required
            />
          </div>

          <div className="pay-period-selector">
            <label>Preferred Pay Period:</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  value="weekly"
                  checked={payPeriod === 'weekly'}
                  onChange={(e) => setPayPeriod(e.target.value)}
                />
                <span>Weekly</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  value="biweekly"
                  checked={payPeriod === 'biweekly'}
                  onChange={(e) => setPayPeriod(e.target.value)}
                />
                <span>Biweekly (Every 2 weeks)</span>
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button type="submit" className="btn btn-primary" disabled={isCalculating}>
              {isCalculating ? 'Calculating...' : '🔢 Calculate Person 1'}
            </button>
            {result && (
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                🔄 Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {result && renderBreakdown(result, payPeriod, showPaycheck, setShowPaycheck, showBudget, setShowBudget, '📊 Person 1 —', false)}

      {/* Person 2 Toggle */}
      <div className="person2-toggle-section">
        <button
          className={`btn ${showPerson2 ? 'btn-person2-active' : 'btn-person2'}`}
          onClick={handleTogglePerson2}
        >
          {showPerson2 ? '➖ Remove Person 2' : '➕ Add Person 2\'s Income'}
        </button>
      </div>

      {/* Person 2 Form */}
      {showPerson2 && (
        <div className="calculator-form-section person2-section">
          <h2>👤 Person 2 — Pay Calculator</h2>
          <p className="subtitle">Calculate Person 2's take-home pay</p>

          <form onSubmit={handleCalculate2} className="pay-calc-form">
            <div className="calc-type-selector">
              <label className="radio-option">
                <input
                  type="radio"
                  value="hourly"
                  checked={calcType2 === 'hourly'}
                  onChange={(e) => setCalcType2(e.target.value)}
                />
                <span>Calculate from Hourly Rate</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  value="yearly"
                  checked={calcType2 === 'yearly'}
                  onChange={(e) => setCalcType2(e.target.value)}
                />
                <span>Calculate from Yearly Salary</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="inputValue2">
                {calcType2 === 'hourly' ? 'Hourly Rate ($)' : 'Yearly Salary ($)'}
              </label>
              <input
                type="number"
                id="inputValue2"
                value={inputValue2}
                onChange={(e) => setInputValue2(e.target.value)}
                placeholder={calcType2 === 'hourly' ? 'e.g., 25.00' : 'e.g., 52000'}
                step="0.01"
                min="0"
                disabled={isCalculating2}
                required
              />
            </div>

            <div className="pay-period-selector">
              <label>Preferred Pay Period:</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    value="weekly"
                    checked={payPeriod2 === 'weekly'}
                    onChange={(e) => setPayPeriod2(e.target.value)}
                  />
                  <span>Weekly</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="biweekly"
                    checked={payPeriod2 === 'biweekly'}
                    onChange={(e) => setPayPeriod2(e.target.value)}
                  />
                  <span>Biweekly (Every 2 weeks)</span>
                </label>
              </div>
            </div>

            {error2 && <div className="error-message">{error2}</div>}

            <div className="button-group">
              <button type="submit" className="btn btn-person2-active" disabled={isCalculating2}>
                {isCalculating2 ? 'Calculating...' : '🔢 Calculate Person 2'}
              </button>
              {result2 && (
                <button type="button" className="btn btn-secondary" onClick={handleReset2}>
                  🔄 Reset
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {result2 && renderBreakdown(result2, payPeriod2, showPaycheck2, setShowPaycheck2, showBudget2, setShowBudget2, '📊 Person 2 —', true)}
    </div>
  );
}

export default PayCalculator;
