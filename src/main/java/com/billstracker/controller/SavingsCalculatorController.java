package com.billstracker.controller;

import com.billstracker.model.MonthlyProjection;
import com.billstracker.model.SavingsCalculation;
import com.billstracker.service.SavingsCalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/savings-calculator")
@CrossOrigin(origins = "http://localhost:3000")
public class SavingsCalculatorController {
    
    @Autowired
    private SavingsCalculatorService savingsCalculatorService;
    
    /**
     * Calculate savings contributions
     * POST /api/savings-calculator/calculate
     * Body: { "savingsGoal": 10000, "timeframeMonths": 12, "currentSavings": 1000, "interestRate": 4.5 }
     */
    @PostMapping("/calculate")
    public ResponseEntity<?> calculateSavings(@RequestBody Map<String, Object> request) {
        try {
            Double savingsGoal = getDoubleValue(request, "savingsGoal");
            Integer timeframeMonths = getIntegerValue(request, "timeframeMonths");
            Double currentSavings = getDoubleValue(request, "currentSavings");
            Double interestRate = getDoubleValue(request, "interestRate");
            
            if (savingsGoal == null) {
                return ResponseEntity.badRequest().body("Savings goal is required");
            }
            if (timeframeMonths == null) {
                return ResponseEntity.badRequest().body("Timeframe is required");
            }
            
            // Default current savings to 0 if not provided
            if (currentSavings == null) {
                currentSavings = 0.0;
            }
            
            // Default interest rate to 0 if not provided
            if (interestRate == null) {
                interestRate = 0.0;
            }
            
            SavingsCalculation result = savingsCalculatorService.calculateSavingsContributions(
                savingsGoal, timeframeMonths, currentSavings, interestRate
            );
            return ResponseEntity.ok(result);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Calculate savings growth projection
     * POST /api/savings-calculator/project-growth
     * Body: { "monthlyContribution": 500, "timeframeMonths": 24, "currentSavings": 1000, "interestRate": 4.5 }
     */
    @PostMapping("/project-growth")
    public ResponseEntity<?> projectGrowth(@RequestBody Map<String, Object> request) {
        try {
            Double monthlyContribution = getDoubleValue(request, "monthlyContribution");
            Integer timeframeMonths = getIntegerValue(request, "timeframeMonths");
            Double currentSavings = getDoubleValue(request, "currentSavings");
            Double interestRate = getDoubleValue(request, "interestRate");
            
            if (monthlyContribution == null) {
                return ResponseEntity.badRequest().body("Monthly contribution is required");
            }
            if (timeframeMonths == null) {
                return ResponseEntity.badRequest().body("Timeframe is required");
            }
            
            // Default current savings to 0 if not provided
            if (currentSavings == null) {
                currentSavings = 0.0;
            }
            
            // Default interest rate to 0 if not provided
            if (interestRate == null) {
                interestRate = 0.0;
            }
            
            List<MonthlyProjection> projections = savingsCalculatorService.calculateMonthlyProjections(
                currentSavings, monthlyContribution, timeframeMonths, interestRate
            );
            return ResponseEntity.ok(projections);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    private Double getDoubleValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    private Integer getIntegerValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
