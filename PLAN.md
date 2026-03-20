# Bug Fix Plan for FamFin

## Bugs to Fix (Ordered by Priority)

### 1. Backend: Zero-amount bills allowed (BillService.java:31)
- **Issue:** `bill.getAmount() < 0` allows $0 bills despite error message saying "positive number"
- **Fix:** Change to `bill.getAmount() <= 0`

### 2. Backend: Silent 204 on delete of non-existent bill (BillController.java:44-48)
- **Issue:** Deleting a non-existent bill returns 204 instead of 404
- **Fix:** Add existence check in BillService.deleteBill() and throw exception; handle in controller

### 3. Frontend: Null crash in BillSummary (BillSummary.jsx:12,17)
- **Issue:** `summary.total.toFixed(2)` throws if value is null/undefined
- **Fix:** Add null guards: `(summary.total ?? 0).toFixed(2)`

### 4. Frontend: Empty array crash in SavingsCalculator (SavingsCalculator.jsx:110,112)
- **Issue:** `projections[projections.length - 1]` throws if array is empty
- **Fix:** Guard with `if (projections.length > 0)` before accessing last element

### 5. Frontend: Error messages can show [object Object] (multiple components)
- **Files:** BillForm.jsx:42, PayCalculator.jsx:56,92, SavingsCalculator.jsx:65,117
- **Issue:** `err.response?.data` could be an object, not a string
- **Fix:** Normalize error: `typeof err.response?.data === 'string' ? err.response.data : 'Failed. Please try again.'`

### 6. Frontend: Missing useEffect dependency (BillSplit.jsx:9-26)
- **Issue:** `onIncomeChange` missing from dependency arrays
- **Fix:** Wrap `onIncomeChange` in `useCallback` in App.jsx (or add to deps + stabilize the callback)
