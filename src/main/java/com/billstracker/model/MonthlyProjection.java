package com.billstracker.model;

public class MonthlyProjection {
    private int month;
    private double contribution;
    private double interestEarned;
    private double balance;
    
    public MonthlyProjection() {
    }
    
    public MonthlyProjection(int month, double contribution, double interestEarned, double balance) {
        this.month = month;
        this.contribution = contribution;
        this.interestEarned = interestEarned;
        this.balance = balance;
    }
    
    // Getters and Setters
    public int getMonth() {
        return month;
    }
    
    public void setMonth(int month) {
        this.month = month;
    }
    
    public double getContribution() {
        return contribution;
    }
    
    public void setContribution(double contribution) {
        this.contribution = contribution;
    }
    
    public double getInterestEarned() {
        return interestEarned;
    }
    
    public void setInterestEarned(double interestEarned) {
        this.interestEarned = interestEarned;
    }
    
    public double getBalance() {
        return balance;
    }
    
    public void setBalance(double balance) {
        this.balance = balance;
    }
}
