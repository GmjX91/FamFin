package com.billstracker.model;

import java.util.List;

public class SavingsCalculation {
    private double savingsGoal;
    private int timeframeMonths;
    private double currentSavings;
    private double interestRate;
    private double weeklyContribution;
    private double biweeklyContribution;
    private double monthlyContribution;
    private double totalInterestEarned;
    private List<MonthlyProjection> monthlyProjections;
    
    public SavingsCalculation() {
    }
    
    public SavingsCalculation(double savingsGoal, int timeframeMonths, double currentSavings,
                             double weeklyContribution, double biweeklyContribution, double monthlyContribution) {
        this.savingsGoal = savingsGoal;
        this.timeframeMonths = timeframeMonths;
        this.currentSavings = currentSavings;
        this.weeklyContribution = weeklyContribution;
        this.biweeklyContribution = biweeklyContribution;
        this.monthlyContribution = monthlyContribution;
    }
    
    // Getters and Setters
    public double getSavingsGoal() {
        return savingsGoal;
    }
    
    public void setSavingsGoal(double savingsGoal) {
        this.savingsGoal = savingsGoal;
    }
    
    public int getTimeframeMonths() {
        return timeframeMonths;
    }
    
    public void setTimeframeMonths(int timeframeMonths) {
        this.timeframeMonths = timeframeMonths;
    }
    
    public double getCurrentSavings() {
        return currentSavings;
    }
    
    public void setCurrentSavings(double currentSavings) {
        this.currentSavings = currentSavings;
    }
    
    public double getWeeklyContribution() {
        return weeklyContribution;
    }
    
    public void setWeeklyContribution(double weeklyContribution) {
        this.weeklyContribution = weeklyContribution;
    }
    
    public double getBiweeklyContribution() {
        return biweeklyContribution;
    }
    
    public void setBiweeklyContribution(double biweeklyContribution) {
        this.biweeklyContribution = biweeklyContribution;
    }
    
    public double getMonthlyContribution() {
        return monthlyContribution;
    }
    
    public void setMonthlyContribution(double monthlyContribution) {
        this.monthlyContribution = monthlyContribution;
    }
    
    public double getInterestRate() {
        return interestRate;
    }
    
    public void setInterestRate(double interestRate) {
        this.interestRate = interestRate;
    }
    
    public double getTotalInterestEarned() {
        return totalInterestEarned;
    }
    
    public void setTotalInterestEarned(double totalInterestEarned) {
        this.totalInterestEarned = totalInterestEarned;
    }
    
    public List<MonthlyProjection> getMonthlyProjections() {
        return monthlyProjections;
    }
    
    public void setMonthlyProjections(List<MonthlyProjection> monthlyProjections) {
        this.monthlyProjections = monthlyProjections;
    }
}
