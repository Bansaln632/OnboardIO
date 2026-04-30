package com.example.onboarding.repository;

import com.example.onboarding.entity.Onboarding;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.example.onboarding.entity.User;

public interface OnboardingRepository extends JpaRepository<Onboarding, Long> {
    Optional<Onboarding> findByEmployee(User user);
    Optional<Onboarding> findByEmployeeId(Long employeeId);
}

