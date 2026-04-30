package com.example.onboarding.repository;

import com.example.onboarding.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.example.onboarding.entity.User;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByEmployee(User user);

    @Query("select count(t) from Task t where t.employee.id = :employeeId")
    long countByEmployeeId(Long employeeId);

    @Query("select count(t) from Task t where t.employee.id = :employeeId and t.completed = true")
    long countCompletedByEmployeeId(Long employeeId);
}
