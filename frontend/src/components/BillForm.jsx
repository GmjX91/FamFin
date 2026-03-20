import { useState } from 'react';

const CATEGORIES = [
  'Housing', 'Utilities', 'Subscriptions', 'Transportation',
  'Insurance', 'Food & Groceries', 'Other'
];

function BillForm({ onBillAdded }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim().slice(0, 100);
    if (!trimmedName) {
      setError('Bill name is required');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter an amount greater than $0');
      return;
    }
    if (amountNum > 999999.99) {
      setError('Amount cannot exceed $999,999.99');
      return;
    }

    setIsSubmitting(true);
    try {
      await onBillAdded({ name: trimmedName, amount: amountNum, category });
      setName('');
      setAmount('');
      setCategory('Other');
    } catch (err) {
      const msg = err.response?.data;
      setError(typeof msg === 'string' ? msg : 'Failed to add bill');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bill-form-container">
      <h2>Add New Bill</h2>
      <form onSubmit={handleSubmit} className="bill-form">
        <div className="form-group">
          <label htmlFor="name">Bill Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Electric Bill"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            max="999999.99"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
            className="form-select"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Bill'}
        </button>
      </form>
    </div>
  );
}

export default BillForm;
