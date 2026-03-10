package com.billstracker.controller;

import com.billstracker.model.PayCalculation;
import com.billstracker.service.PayCalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pay-calculator")
@CrossOrigin(origins = "http://localhost:3000")
public class PayCalculatorController {
    
    @Autowired
    private PayCalculatorService payCalculatorService;
    
    /**
     * Calculate pay from hourly rate
     * POST /api/pay-calculator/from-hourly
     * Body: { "hourlyRate": 25.0 }
     */
    @PostMapping("/from-hourly")
    public ResponseEntity<?> calculateFromHourly(@RequestBody Map<String, Double> request) {
        try {
            Double hourlyRate = request.get("hourlyRate");
            if (hourlyRate == null) {
                return ResponseEntity.badRequest().body("Hourly rate is required");
            }
            
            PayCalculation result = payCalculatorService.calculateFromHourlyRate(hourlyRate);
            return ResponseEntity.ok(result);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Calculate pay from yearly salary
     * POST /api/pay-calculator/from-yearly
     * Body: { "yearlySalary": 52000.0 }
     */
    @PostMapping("/from-yearly")
    public ResponseEntity<?> calculateFromYearly(@RequestBody Map<String, Double> request) {
        try {
            Double yearlySalary = request.get("yearlySalary");
            if (yearlySalary == null) {
                return ResponseEntity.badRequest().body("Yearly salary is required");
            }
            
            PayCalculation result = payCalculatorService.calculateFromYearlySalary(yearlySalary);
            return ResponseEntity.ok(result);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
