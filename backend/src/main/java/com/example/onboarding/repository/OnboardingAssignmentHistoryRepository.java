package com.example.onboarding.repository;

import com.example.onboarding.entity.OnboardingAssignmentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OnboardingAssignmentHistoryRepository extends JpaRepository<OnboardingAssignmentHistory, Long> {
    List<OnboardingAssignmentHistory> findByOnboardingIdOrderByTimestampDesc(Long onboardingId);
}

