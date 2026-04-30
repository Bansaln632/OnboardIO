package com.example.onboarding.controller.admin;

import com.example.onboarding.dto.DtoMapper;
import com.example.onboarding.dto.OnboardingAssignmentHistoryDTO;
import com.example.onboarding.dto.OnboardingDTO;
import com.example.onboarding.entity.Onboarding;
import com.example.onboarding.entity.OnboardingAssignmentHistory;
import com.example.onboarding.entity.Profile;
import com.example.onboarding.entity.User;
import com.example.onboarding.repository.OnboardingAssignmentHistoryRepository;
import com.example.onboarding.repository.OnboardingRepository;
import com.example.onboarding.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/onboarding")
@RequiredArgsConstructor
public class AdminOnboardingController {

    private final OnboardingRepository onboardingRepository;
    private final UserRepository userRepository;
    private final OnboardingAssignmentHistoryRepository historyRepository;

    @GetMapping
    public List<OnboardingDTO> getAllOnboardings() {
        return onboardingRepository.findAll().stream().map(DtoMapper::toOnboardingDto).collect(Collectors.toList());
    }

    @GetMapping("/users")
    public List<com.example.onboarding.dto.UserDTO> getAllUsers() {
        // Return only HR profiles for assignment
        return userRepository.findByProfile(Profile.HR).stream().map(DtoMapper::toUserDto).collect(Collectors.toList());
    }

    @PutMapping("/{id}/assign-hr")
    @Transactional
    public void assignHr(
            @PathVariable Long id,
            @RequestParam Long hrId,
            @RequestParam(required = false, defaultValue = "system") String performedBy
    ) {
        Onboarding onboarding = onboardingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Onboarding not found"));

        User hr = userRepository.findById(hrId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "HR user not found"));

        // Ensure selected user is an HR
        if (hr.getProfile() != Profile.HR) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected user is not an HR");
        }

        User previous = onboarding.getAssignedHr();

        onboarding.setAssignedHr(hr);
        onboardingRepository.save(onboarding);

        // Also set the employee's assignedHr relation and persist
        User employee = onboarding.getEmployee();
        if (employee != null) {
            employee.setAssignedHr(hr);
            userRepository.save(employee);
        }

        // Record history
        OnboardingAssignmentHistory hist = new OnboardingAssignmentHistory();
        hist.setOnboarding(onboarding);
        hist.setPreviousHr(previous);
        hist.setNewHr(hr);
        hist.setAction(previous == null ? "ASSIGNED" : "REASSIGNED");
        hist.setTimestamp(Instant.now());
        hist.setPerformedBy(performedBy);
        historyRepository.save(hist);
    }

    @PutMapping("/{id}/unassign-hr")
    @Transactional
    public void unassignHr(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "system") String performedBy
    ) {
        Onboarding onboarding = onboardingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Onboarding not found"));

        User previous = onboarding.getAssignedHr();
        if (previous == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No HR assigned");
        }

        onboarding.setAssignedHr(null);
        onboardingRepository.save(onboarding);

        User employee = onboarding.getEmployee();
        if (employee != null) {
            employee.setAssignedHr(null);
            userRepository.save(employee);
        }

        OnboardingAssignmentHistory hist = new OnboardingAssignmentHistory();
        hist.setOnboarding(onboarding);
        hist.setPreviousHr(previous);
        hist.setNewHr(null);
        hist.setAction("UNASSIGNED");
        hist.setTimestamp(Instant.now());
        hist.setPerformedBy(performedBy);
        historyRepository.save(hist);
    }

    @GetMapping("/{id}/assignment-history")
    public List<OnboardingAssignmentHistoryDTO> getAssignmentHistory(@PathVariable Long id) {
        // This returns history entries for the onboarding
        List<OnboardingAssignmentHistory> entries = historyRepository.findByOnboardingIdOrderByTimestampDesc(id);
        return entries.stream().map(DtoMapper::toHistoryDto).collect(Collectors.toList());
    }
}
