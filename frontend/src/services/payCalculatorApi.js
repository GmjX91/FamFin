import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/pay-calculator';

export const payCalculatorAPI = {
  // Calculate from hourly rate
  calculateFromHourly: async (hourlyRate) => {
    const response = await axios.post(`${API_BASE_URL}/from-hourly`, {
      hourlyRate: hourlyRate
    });
    return response.data;
  },

  // Calculate from yearly salary
  calculateFromYearly: async (yearlySalary) => {
    const response = await axios.post(`${API_BASE_URL}/from-yearly`, {
      yearlySalary: yearlySalary
    });
    return response.data;
  }
};
