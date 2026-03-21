package com.billstracker.service;

import com.billstracker.model.Bill;
import com.billstracker.model.BillSummary;
import com.billstracker.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class BillService {
    
    @Autowired
    private BillRepository billRepository;
    
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }
    
    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }
    
    public Bill createBill(Bill bill) {
        // Validate bill
        if (bill.getName() == null || bill.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Bill name cannot be empty");
        }
        if (bill.getAmount() == null || bill.getAmount() <= 0) {
            throw new IllegalArgumentException("Bill amount must be a positive number");
        }
        return billRepository.save(bill);
    }
    
    public void deleteBill(Long id) {
        if (!billRepository.existsById(id)) {
            throw new NoSuchElementException("Bill not found with id: " + id);
        }
        billRepository.deleteById(id);
    }
    
    public BillSummary getSummary() {
        Double total = billRepository.getTotalAmount();
        Double average = billRepository.getAverageAmount();
        Long count = billRepository.count();
        return new BillSummary(total, average, count);
    }
}
