package com.billstracker.controller;

import com.billstracker.model.Bill;
import com.billstracker.model.BillSummary;
import com.billstracker.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:3000")
public class BillController {
    
    @Autowired
    private BillService billService;
    
    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {
        List<Bill> bills = billService.getAllBills();
        return ResponseEntity.ok(bills);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        return billService.getBillById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createBill(@RequestBody Bill bill) {
        try {
            Bill createdBill = billService.createBill(bill);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBill);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/summary")
    public ResponseEntity<BillSummary> getSummary() {
        BillSummary summary = billService.getSummary();
        return ResponseEntity.ok(summary);
    }
}
