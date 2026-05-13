package com.example.onboarding.repository;

import com.example.onboarding.entity.Onboarding;
import com.example.onboarding.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OnboardingRepository extends JpaRepository<Onboarding, Long> {
    Optional<Onboarding> findByEmployee(User user);
    Optional<Onboarding> findByEmployeeId(Long employeeId);
}

