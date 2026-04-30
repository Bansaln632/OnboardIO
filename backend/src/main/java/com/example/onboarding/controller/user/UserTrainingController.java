package com.example.onboarding.controller.user;

import com.example.onboarding.dto.DtoMapper;
import com.example.onboarding.dto.TrainingDTO;
import com.example.onboarding.entity.User;
import com.example.onboarding.entity.Training;
import com.example.onboarding.repository.UserRepository;
import com.example.onboarding.repository.TrainingRepository;
import com.example.onboarding.util.OnboardingProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/trainings")
@RequiredArgsConstructor
public class UserTrainingController {

    private final TrainingRepository trainingRepository;
    private final UserRepository userRepository;
    private final OnboardingProgressService progressService;

    @GetMapping
    public List<TrainingDTO> getMyTrainings(Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return trainingRepository.findByEmployee(user).stream().map(DtoMapper::toTrainingDto).collect(Collectors.toList());
    }

    @PutMapping("/{trainingId}/complete")
    public void completeTraining(@PathVariable Long trainingId) {

        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        training.setCompleted(true);
        trainingRepository.save(training);

        if (training.getEmployee() != null) {
            progressService.recalculateForEmployee(training.getEmployee().getId());
        }
    }

    @PutMapping("/{trainingId}/start")
    public void startTraining(@PathVariable Long trainingId, Authentication authentication) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        // optional: validate the user matches training.employee
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!training.getEmployee().getId().equals(user.getId())) {
            throw new RuntimeException("Cannot start a training not assigned to you");
        }

        training.setStarted(true);
        trainingRepository.save(training);
    }

    @PostMapping("/{trainingId}/visit")
    public void visitTraining(@PathVariable Long trainingId, Authentication authentication) {
        // Called when the user visits the training link; mark completed
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!training.getEmployee().getId().equals(user.getId())) {
            throw new RuntimeException("Cannot visit a training not assigned to you");
        }

        training.setCompleted(true);
        trainingRepository.save(training);

        // Recalculate progress
        progressService.recalculateForEmployee(user.getId());
    }
}
