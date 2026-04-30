package com.example.onboarding.controller.admin;

import com.example.onboarding.dto.DtoMapper;
import com.example.onboarding.dto.TrainingDTO;
import com.example.onboarding.entity.Training;
import com.example.onboarding.entity.User;
import com.example.onboarding.repository.TrainingRepository;
import com.example.onboarding.repository.UserRepository;
import com.example.onboarding.util.OnboardingProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/trainings")
@RequiredArgsConstructor
public class AdminTrainingController {

    private final TrainingRepository trainingRepository;
    private final UserRepository userRepository;
    private final OnboardingProgressService progressService;

    @PostMapping("/assign")
    public void assignTraining(
            @RequestParam Long userId,
            @RequestParam String trainingName,
            @RequestParam(required = false) String content
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Training training = new Training();
        training.setName(trainingName);
        training.setCompleted(false);
        training.setEmployee(user);
        training.setContent(content);

        trainingRepository.save(training);

        // Recalculate onboarding progress for the employee
        progressService.recalculateForEmployee(user.getId());
    }

    @GetMapping
    public List<TrainingDTO> getAllTrainings() {
        return trainingRepository.findAll().stream().map(DtoMapper::toTrainingDto).collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public void deleteTraining(@PathVariable Long id) {
        Training t = trainingRepository.findById(id).orElse(null);
        if (t != null) {
            Long empId = t.getEmployee() != null ? t.getEmployee().getId() : null;
            trainingRepository.deleteById(id);
            if (empId != null) progressService.recalculateForEmployee(empId);
        }
    }
}
