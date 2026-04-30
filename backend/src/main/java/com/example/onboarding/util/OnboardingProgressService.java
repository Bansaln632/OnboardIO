package com.example.onboarding.util;

import com.example.onboarding.entity.Onboarding;
import com.example.onboarding.entity.OnboardingStatus;
import com.example.onboarding.repository.TaskRepository;
import com.example.onboarding.repository.TrainingRepository;
import com.example.onboarding.repository.UserDocumentRepository;
import com.example.onboarding.repository.OnboardingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OnboardingProgressService {

    private final TaskRepository taskRepository;
    private final TrainingRepository trainingRepository;
    private final UserDocumentRepository userDocumentRepository;
    private final OnboardingRepository onboardingRepository;

    /**
     * Recalculate onboarding progress for an employee.
     *
     * Progress calculation includes:
     * - All assigned tasks
     * - All assigned trainings
     * - Only MANDATORY documents (OPTIONAL documents are excluded)
     *
     * Each completed item contributes equally to the overall progress percentage.
     */
    @Transactional
    public void recalculateForEmployee(Long employeeId) {
        // Count all assigned items
        long tasks = taskRepository.countByEmployeeId(employeeId);
        long trainings = trainingRepository.countByEmployeeId(employeeId);
        long mandatoryDocuments = userDocumentRepository.countMandatoryDocumentsByUserId(employeeId);

        // Total activities = tasks + trainings + mandatory documents (optional documents excluded)
        long total = tasks + trainings + mandatoryDocuments;

        int progress;

        if (total == 0) {
            progress = 0;
        } else {
            // Count completed items
            long completedTasks = taskRepository.countCompletedByEmployeeId(employeeId);
            long completedTrainings = trainingRepository.countCompletedByEmployeeId(employeeId);
            long approvedMandatoryDocuments = userDocumentRepository.countApprovedMandatoryDocumentsByUserId(employeeId);

            // Total completed = completed tasks + completed trainings + approved mandatory documents
            long completed = completedTasks + completedTrainings + approvedMandatoryDocuments;

            // Calculate percentage: (completed / total) * 100
            progress = (int) Math.round((completed * 100.0) / total);
        }

        // Update onboarding record with new progress
        var onboardingOpt = onboardingRepository.findByEmployeeId(employeeId);
        if (onboardingOpt.isPresent()) {
            var o = onboardingOpt.get();
            o.setProgress(progress);

            // Update status based on progress and total activities
            if (total == 0 ) {
                // No activities assigned or completed yet
                o.setStatus(OnboardingStatus.NOT_STARTED);
            } else if (progress >= 100) {
                // All activities completed
                o.setStatus(OnboardingStatus.COMPLETED);
            } else {
                // Activities assigned but not all completed (even if 0%)
                o.setStatus(OnboardingStatus.IN_PROGRESS);
            }

            onboardingRepository.save(o);
        }
    }
}
