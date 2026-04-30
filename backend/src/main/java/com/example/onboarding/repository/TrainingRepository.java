package com.example.onboarding.repository;

import com.example.onboarding.entity.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.example.onboarding.entity.User;

public interface TrainingRepository extends JpaRepository<Training, Long> {
    List<Training> findByEmployee(User user);

    @Query("select count(t) from Training t where t.employee.id = :employeeId")
    long countByEmployeeId(Long employeeId);

    @Query("select count(t) from Training t where t.employee.id = :employeeId and t.completed = true")
    long countCompletedByEmployeeId(Long employeeId);
}