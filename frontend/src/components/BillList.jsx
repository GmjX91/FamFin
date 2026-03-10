function BillList({ bills, onDeleteBill, isLoading }) {
  if (isLoading) {
    return <div className="loading">Loading bills...</div>;
  }

  if (bills.length === 0) {
    return (
      <div className="no-bills">
        <p>No bills added yet. Add your first bill above!</p>
      </div>
    );
  }

  return (
    <div className="bill-list-container">
      <h2>Your Bills</h2>
      <div className="table-responsive">
        <table className="bills-table">
          <thead>
            <tr>
              <th>Bill Name</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.name}</td>
                <td><span className={`category-badge cat-${(bill.category || 'Other').toLowerCase().replace(/[^a-z]/g, '')}`}>{bill.category || 'Other'}</span></td>
                <td className="amount">${bill.amount.toFixed(2)}</td>
                <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => onDeleteBill(bill.id)}
                    className="btn btn-delete"
                    title="Delete bill"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BillList;
