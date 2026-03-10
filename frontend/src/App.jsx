import { useState, useEffect } from 'react';
import BillForm from './components/BillForm';
import BillList from './components/BillList';
import BillSummary from './components/BillSummary';
import BillSplit from './components/BillSplit';
import PayCalculator from './components/PayCalculator';
import SavingsCalculator from './components/SavingsCalculator';
import HouseholdDashboard from './components/HouseholdDashboard';
import { billsAPI } from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('bills');
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  // Shared state across tabs
  const [payCalcResult1, setPayCalcResult1] = useState(null);
  const [payCalcResult2, setPayCalcResult2] = useState(null);
  const [householdIncomes, setHouseholdIncomes] = useState({ person1: '', person2: '' });
  const [savingsResult, setSavingsResult] = useState(null);

  // Load bills on component mount
  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [billsData, summaryData] = await Promise.all([
        billsAPI.getAllBills(),
        billsAPI.getSummary()
      ]);
      setBills(billsData);
      setSummary(summaryData);
    } catch (err) {
      setError('Failed to load bills. Make sure the backend server is running.');
      console.error('Error loading bills:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBill = async (bill) => {
    await billsAPI.createBill(bill);
    await loadBills(); // Reload to get updated data
  };

  const handleDeleteBill = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billsAPI.deleteBill(id);
        await loadBills(); // Reload to get updated data
      } catch (err) {
        alert('Failed to delete bill');
        console.error('Error deleting bill:', err);
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('darkMode', next);
      return next;
    });
  };

  return (
    <div className="app" data-theme={darkMode ? 'dark' : 'light'}>
      <header className="app-header">
        <div className="header-top-row">
          <h1>💼 Personal Finance Tools</h1>
          <button className="dark-mode-toggle" onClick={toggleDarkMode} title="Toggle dark mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <p>Manage your finances with ease</p>
        
        <nav className="app-nav">
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            🏠 Dashboard
          </button>
          <button 
            className={`nav-tab ${activeTab === 'bills' ? 'active' : ''}`}
            onClick={() => setActiveTab('bills')}
          >
            📋 Bills Tracker
          </button>
          <button 
            className={`nav-tab ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            💰 Pay Calculator
          </button>
          <button 
            className={`nav-tab ${activeTab === 'savings' ? 'active' : ''}`}
            onClick={() => setActiveTab('savings')}
          >
            🎯 Savings Goals
          </button>
        </nav>
      </header>

      <main className="app-content">
        {activeTab === 'dashboard' && (
          <HouseholdDashboard
            bills={bills}
            summary={summary}
            payCalcResult1={payCalcResult1}
            payCalcResult2={payCalcResult2}
            householdIncomes={householdIncomes}
            savingsResult={savingsResult}
          />
        )}

        {activeTab === 'bills' && (
          <>
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            <BillForm onBillAdded={handleAddBill} />
            
            {summary && <BillSummary summary={summary} />}

            <BillSplit
              bills={bills}
              summary={summary}
              incomes={householdIncomes}
              onIncomeChange={setHouseholdIncomes}
              payCalcResult1={payCalcResult1}
              payCalcResult2={payCalcResult2}
            />
            
            <BillList 
              bills={bills} 
              onDeleteBill={handleDeleteBill}
              isLoading={isLoading}
            />
          </>
        )}

        <div style={{ display: activeTab === 'calculator' ? 'contents' : 'none' }}>
          <PayCalculator
            onResult1Change={setPayCalcResult1}
            onResult2Change={setPayCalcResult2}
          />
        </div>

        <div style={{ display: activeTab === 'savings' ? 'contents' : 'none' }}>
          <SavingsCalculator onResultChange={setSavingsResult} />
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with Spring Boot & React</p>
      </footer>
    </div>
  );
}

export default App;
