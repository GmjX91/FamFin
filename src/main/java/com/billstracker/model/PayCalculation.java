package com.billstracker.model;

public class PayCalculation {
    private double hourlyRate;
    private double yearlySalary;
    private double monthlyGross;
    private double monthlyNet;
    private double biweeklyGross;
    private double biweeklyNet;
    private double weeklyGross;
    private double weeklyNet;
    private double totalTaxRate;
    
    public PayCalculation() {
    }
    
    public PayCalculation(double hourlyRate, double yearlySalary, double monthlyGross, 
                         double monthlyNet, double biweeklyGross, double biweeklyNet,
                         double weeklyGross, double weeklyNet, double totalTaxRate) {
        this.hourlyRate = hourlyRate;
        this.yearlySalary = yearlySalary;
        this.monthlyGross = monthlyGross;
        this.monthlyNet = monthlyNet;
        this.biweeklyGross = biweeklyGross;
        this.biweeklyNet = biweeklyNet;
        this.weeklyGross = weeklyGross;
        this.weeklyNet = weeklyNet;
        this.totalTaxRate = totalTaxRate;
    }
    
    // Getters and Setters
    public double getHourlyRate() {
        return hourlyRate;
    }
    
    public void setHourlyRate(double hourlyRate) {
        this.hourlyRate = hourlyRate;
    }
    
    public double getYearlySalary() {
        return yearlySalary;
    }
    
    public void setYearlySalary(double yearlySalary) {
        this.yearlySalary = yearlySalary;
    }
    
    public double getMonthlyGross() {
        return monthlyGross;
    }
    
    public void setMonthlyGross(double monthlyGross) {
        this.monthlyGross = monthlyGross;
    }
    
    public double getMonthlyNet() {
        return monthlyNet;
    }
    
    public void setMonthlyNet(double monthlyNet) {
        this.monthlyNet = monthlyNet;
    }
    
    public double getBiweeklyGross() {
        return biweeklyGross;
    }
    
    public void setBiweeklyGross(double biweeklyGross) {
        this.biweeklyGross = biweeklyGross;
    }
    
    public double getBiweeklyNet() {
        return biweeklyNet;
    }
    
    public void setBiweeklyNet(double biweeklyNet) {
        this.biweeklyNet = biweeklyNet;
    }
    
    public double getWeeklyGross() {
        return weeklyGross;
    }
    
    public void setWeeklyGross(double weeklyGross) {
        this.weeklyGross = weeklyGross;
    }
    
    public double getWeeklyNet() {
        return weeklyNet;
    }
    
    public void setWeeklyNet(double weeklyNet) {
        this.weeklyNet = weeklyNet;
    }
    
    public double getTotalTaxRate() {
        return totalTaxRate;
    }
    
    public void setTotalTaxRate(double totalTaxRate) {
        this.totalTaxRate = totalTaxRate;
    }
}
