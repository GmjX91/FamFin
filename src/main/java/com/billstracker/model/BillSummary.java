package com.billstracker.model;

public class BillSummary {
    private Double total;
    private Double average;
    private Long count;
    
    public BillSummary(Double total, Double average, Long count) {
        this.total = total != null ? total : 0.0;
        this.average = average != null ? average : 0.0;
        this.count = count != null ? count : 0L;
    }
    
    // Getters and Setters
    public Double getTotal() {
        return total;
    }
    
    public void setTotal(Double total) {
        this.total = total;
    }
    
    public Double getAverage() {
        return average;
    }
    
    public void setAverage(Double average) {
        this.average = average;
    }
    
    public Long getCount() {
        return count;
    }
    
    public void setCount(Long count) {
        this.count = count;
    }
}
