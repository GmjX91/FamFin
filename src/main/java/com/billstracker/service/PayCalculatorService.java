package com.billstracker.service;

import com.billstracker.model.PayCalculation;
import org.springframework.stereotype.Service;

@Service
public class PayCalculatorService {
    
    // Constants
    private static final int HOURS_PER_WEEK = 40;
    private static final int WEEKS_PER_YEAR = 52;
    private static final int BIWEEKS_PER_YEAR = 26;
    private static final int MONTHS_PER_YEAR = 12;
    
    // Tax rates
    private static final double FEDERAL_TAX_RATE = 0.12;
    private static final double STATE_TAX_RATE = 0.045;  // NC flat tax
    private static final double SOCIAL_SECURITY_RATE = 0.062;
    private static final double MEDICARE_RATE = 0.0145;
    private static final double TOTAL_TAX_RATE = FEDERAL_TAX_RATE + STATE_TAX_RATE + 
                                                   SOCIAL_SECURITY_RATE + MEDICARE_RATE;
    
    /**
     * Calculate pay breakdown from hourly rate
     */
    public PayCalculation calculateFromHourlyRate(double hourlyRate) {
        validatePositive(hourlyRate, "Hourly rate");
        
        double yearlySalary = hourlyRate * HOURS_PER_WEEK * WEEKS_PER_YEAR;
        return buildPayCalculation(hourlyRate, yearlySalary);
    }
    
    /**
     * Calculate pay breakdown from yearly salary
     */
    public PayCalculation calculateFromYearlySalary(double yearlySalary) {
        validatePositive(yearlySalary, "Yearly salary");
        
        double hourlyRate = yearlySalary / (HOURS_PER_WEEK * WEEKS_PER_YEAR);
        return buildPayCalculation(hourlyRate, yearlySalary);
    }
    
    /**
     * Build PayCalculation object with all pay period calculations
     */
    private PayCalculation buildPayCalculation(double hourlyRate, double yearlySalary) {
        double monthlyGross = yearlySalary / MONTHS_PER_YEAR;
        double monthlyNet = monthlyGross * (1 - TOTAL_TAX_RATE);
        
        double biweeklyGross = yearlySalary / BIWEEKS_PER_YEAR;
        double biweeklyNet = biweeklyGross * (1 - TOTAL_TAX_RATE);
        
        double weeklyGross = hourlyRate * HOURS_PER_WEEK;
        double weeklyNet = weeklyGross * (1 - TOTAL_TAX_RATE);
        
        return new PayCalculation(
            hourlyRate,
            yearlySalary,
            monthlyGross,
            monthlyNet,
            biweeklyGross,
            biweeklyNet,
            weeklyGross,
            weeklyNet,
            TOTAL_TAX_RATE
        );
    }
    
    /**
     * Validate that value is positive
     */
    private void validatePositive(double value, String fieldName) {
        if (value <= 0) {
            throw new IllegalArgumentException(fieldName + " must be a positive number");
        }
    }
}
