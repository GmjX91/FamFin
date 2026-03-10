package com.billstracker.repository;

import com.billstracker.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    
    @Query("SELECT SUM(b.amount) FROM Bill b")
    Double getTotalAmount();
    
    @Query("SELECT AVG(b.amount) FROM Bill b")
    Double getAverageAmount();
}
