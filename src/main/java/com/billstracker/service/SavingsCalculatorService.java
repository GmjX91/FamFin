package com.billstracker.service;

import com.billstracker.model.MonthlyProjection;
import com.billstracker.model.SavingsCalculation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SavingsCalculatorService {
    
    private static final double WEEKS_PER_MONTH = 4.33;
    private static final int BIWEEKS_PER_MONTH = 2;
    
    /**
     * Calculate required contributions to reach savings goal with interest
     */
    public SavingsCalculation calculateSavingsContributions(double savingsGoal, int timeframeMonths, 
                                                             double currentSavings, double annualInterestRate) {
        // Validate inputs
        validateInputs(savingsGoal, timeframeMonths, currentSavings);
        validateInterestRate(annualInterestRate);
        
        // Calculate amount needed to save
        double amountNeeded = savingsGoal - currentSavings;
        
        // If already at or above goal
        if (amountNeeded <= 0) {
            SavingsCalculation result = new SavingsCalculation(savingsGoal, timeframeMonths, currentSavings, 0, 0, 0);
            result.setInterestRate(annualInterestRate);
            result.setTotalInterestEarned(0);
            result.setMonthlyProjections(new ArrayList<>());
            return result;
        }
        
        double monthlyContribution;
        
        if (annualInterestRate > 0) {
            // Calculate contribution with compound interest
            monthlyContribution = calculateContributionWithInterest(
                currentSavings, savingsGoal, timeframeMonths, annualInterestRate
            );
        } else {
            // Simple calculation without interest
            monthlyContribution = amountNeeded / timeframeMonths;
        }
        
        // Calculate weekly and biweekly contributions
        double weeklyContribution = monthlyContribution / WEEKS_PER_MONTH;
        double biweeklyContribution = monthlyContribution / BIWEEKS_PER_MONTH;
        
        // Generate monthly projections
        List<MonthlyProjection> projections = calculateMonthlyProjections(
            currentSavings, monthlyContribution, timeframeMonths, annualInterestRate
        );
        
        double totalInterest = projections.isEmpty() ? 0 : 
            projections.get(projections.size() - 1).getBalance() - currentSavings - (monthlyContribution * timeframeMonths);
        
        SavingsCalculation result = new SavingsCalculation(
            savingsGoal,
            timeframeMonths,
            currentSavings,
            weeklyContribution,
            biweeklyContribution,
            monthlyContribution
        );
        result.setInterestRate(annualInterestRate);
        result.setTotalInterestEarned(Math.max(0, totalInterest));
        result.setMonthlyProjections(projections);
        
        return result;
    }
    
    /**
     * Calculate monthly projections with compound interest
     */
    public List<MonthlyProjection> calculateMonthlyProjections(double initialBalance, double monthlyContribution, 
                                                                int timeframeMonths, double annualInterestRate) {
        List<MonthlyProjection> projections = new ArrayList<>();
        double monthlyRate = annualInterestRate / 12.0 / 100.0;
        double balance = initialBalance;
        
        for (int month = 0; month <= timeframeMonths; month++) {
            double contribution = (month == 0) ? 0 : monthlyContribution;
            double interestEarned = balance * monthlyRate;
            
            balance += contribution + interestEarned;
            
            projections.add(new MonthlyProjection(month, contribution, interestEarned, balance));
        }
        
        return projections;
    }
    
    /**
     * Calculate required monthly contribution using Future Value of Annuity formula
     */
    private double calculateContributionWithInterest(double presentValue, double futureValue, 
                                                      int months, double annualInterestRate) {
        double monthlyRate = annualInterestRate / 12.0 / 100.0;
        
        if (monthlyRate == 0) {
            return (futureValue - presentValue) / months;
        }
        
        // FV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r]
        // Solving for PMT:
        // PMT = (FV - PV * (1 + r)^n) * r / ((1 + r)^n - 1)
        
        double growthFactor = Math.pow(1 + monthlyRate, months);
        double futureValueOfPresent = presentValue * growthFactor;
        double annuityFactor = (growthFactor - 1) / monthlyRate;
        
        return (futureValue - futureValueOfPresent) / annuityFactor;
    }
    
    /**
     * Validate inputs
     */
    private void validateInputs(double savingsGoal, int timeframeMonths, double currentSavings) {
        if (savingsGoal <= 0) {
            throw new IllegalArgumentException("Savings goal must be greater than zero");
        }
        if (timeframeMonths <= 0) {
            throw new IllegalArgumentException("Timeframe must be at least 1 month");
        }
        if (currentSavings < 0) {
            throw new IllegalArgumentException("Current savings cannot be negative");
        }
    }
    
    /**
     * Validate interest rate
     */
    private void validateInterestRate(double annualInterestRate) {
        if (annualInterestRate < 0 || annualInterestRate > 100) {
            throw new IllegalArgumentException("Interest rate must be between 0 and 100");
        }
    }
}
