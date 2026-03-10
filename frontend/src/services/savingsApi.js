import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/savings-calculator';

export const savingsAPI = {
  // Calculate savings contributions with interest
  calculateSavings: async (savingsGoal, timeframeMonths, currentSavings = 0, interestRate = 0) => {
    const response = await axios.post(`${API_BASE_URL}/calculate`, {
      savingsGoal,
      timeframeMonths,
      currentSavings,
      interestRate
    });
    return response.data;
  },

  // Project savings growth over time
  projectGrowth: async (monthlyContribution, timeframeMonths, currentSavings = 0, interestRate = 0) => {
    const response = await axios.post(`${API_BASE_URL}/project-growth`, {
      monthlyContribution,
      timeframeMonths,
      currentSavings,
      interestRate
    });
    return response.data;
  }
};
