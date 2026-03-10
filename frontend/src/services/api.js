import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const billsAPI = {
  // Get all bills
  getAllBills: async () => {
    const response = await axios.get(`${API_BASE_URL}/bills`);
    return response.data;
  },

  // Create a new bill
  createBill: async (bill) => {
    const response = await axios.post(`${API_BASE_URL}/bills`, bill);
    return response.data;
  },

  // Delete a bill
  deleteBill: async (id) => {
    await axios.delete(`${API_BASE_URL}/bills/${id}`);
  },

  // Get summary statistics
  getSummary: async () => {
    const response = await axios.get(`${API_BASE_URL}/bills/summary`);
    return response.data;
  }
};
