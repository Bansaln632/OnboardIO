package com.example.onboarding.controller.admin;

import com.example.onboarding.dto.DtoMapper;
import com.example.onboarding.dto.TaskDTO;
import com.example.onboarding.entity.Task;
import com.example.onboarding.repository.TaskRepository;
import com.example.onboarding.entity.User;
import com.example.onboarding.repository.UserRepository;
import com.example.onboarding.util.OnboardingProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/tasks")
@RequiredArgsConstructor
public class AdminTaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final OnboardingProgressService progressService;

    @PostMapping("/assign")
    public void assignTask(
            @RequestParam Long userId,
            @RequestParam String title
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task();
        task.setTitle(title);
        task.setCompleted(false);
        task.setEmployee(user);

        taskRepository.save(task);

        // Recalculate onboarding progress for the employee
        progressService.recalculateForEmployee(user.getId());
    }

    @GetMapping
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream().map(DtoMapper::toTaskDto).collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task != null) {
            Long empId = task.getEmployee() != null ? task.getEmployee().getId() : null;
            taskRepository.deleteById(id);
            if (empId != null) progressService.recalculateForEmployee(empId);
        }
    }
}
