package com.example.onboarding.controller.user;

import com.example.onboarding.dto.DtoMapper;
import com.example.onboarding.dto.TaskDTO;
import com.example.onboarding.entity.User;
import com.example.onboarding.entity.Task;
import com.example.onboarding.repository.UserRepository;
import com.example.onboarding.repository.TaskRepository;
import com.example.onboarding.util.OnboardingProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/tasks")
@RequiredArgsConstructor
public class UserTaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final OnboardingProgressService progressService;

    @GetMapping
    public List<TaskDTO> getMyTasks(Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return taskRepository.findByEmployee(user).stream().map(DtoMapper::toTaskDto).collect(Collectors.toList());
    }

    @PutMapping("/{taskId}/complete")
    public void completeTask(@PathVariable Long taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setCompleted(true);
        taskRepository.save(task);

        // Recalculate onboarding progress for the employee
        if (task.getEmployee() != null) {
            progressService.recalculateForEmployee(task.getEmployee().getId());
        }
    }
}
