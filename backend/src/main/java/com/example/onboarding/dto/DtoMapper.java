package com.example.onboarding.dto;

import com.example.onboarding.entity.Onboarding;
import com.example.onboarding.entity.OnboardingAssignmentHistory;
import com.example.onboarding.entity.Task;
import com.example.onboarding.entity.Training;
import com.example.onboarding.entity.User;

public class DtoMapper {

    public static UserDTO toUserDto(User u) {
        if (u == null) return null;
        return new UserDTO(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getRole(),
                u.getContactNo(),
                u.getEmployeeId(),
                u.getProfile()
        );
    }

    public static OnboardingDTO toOnboardingDto(Onboarding o) {
        if (o == null) return null;
        Long assignedHrId = o.getAssignedHr() != null ? o.getAssignedHr().getId() : null;
        String assignedHrUsername = o.getAssignedHr() != null ? o.getAssignedHr().getUsername() : null;
        return new OnboardingDTO(
                o.getId(),
                o.getEmployee() != null ? o.getEmployee().getId() : null,
                o.getEmployee() != null ? o.getEmployee().getUsername() : null,
                o.getStatus() != null ? o.getStatus().name() : null,
                o.getProgress(),
                assignedHrId,
                assignedHrUsername
        );
    }

    public static TaskDTO toTaskDto(Task t) {
        if (t == null) return null;
        return new TaskDTO(
                t.getId(),
                t.getTitle(),
                t.isCompleted(),
                t.getEmployee() != null ? t.getEmployee().getId() : null,
                t.getEmployee() != null ? t.getEmployee().getUsername() : null
        );
    }

    public static TrainingDTO toTrainingDto(Training t) {
        if (t == null) return null;
        String content = null;
        try {
            java.lang.reflect.Field f = t.getClass().getDeclaredField("content");
            f.setAccessible(true);
            Object val = f.get(t);
            if (val instanceof String) content = (String) val;
        } catch (Exception ignored) {
        }
        return new TrainingDTO(
                t.getId(),
                t.getName(),
                t.isStarted(),
                t.isCompleted(),
                t.getEmployee() != null ? t.getEmployee().getId() : null,
                t.getEmployee() != null ? t.getEmployee().getUsername() : null,
                content
        );
    }

    public static OnboardingAssignmentHistoryDTO toHistoryDto(OnboardingAssignmentHistory h) {
        if (h == null) return null;
        return new OnboardingAssignmentHistoryDTO(
                h.getId(),
                h.getOnboarding() != null ? h.getOnboarding().getId() : null,
                h.getPreviousHr() != null ? h.getPreviousHr().getId() : null,
                h.getPreviousHr() != null ? h.getPreviousHr().getUsername() : null,
                h.getNewHr() != null ? h.getNewHr().getId() : null,
                h.getNewHr() != null ? h.getNewHr().getUsername() : null,
                h.getAction(),
                h.getTimestamp(),
                h.getPerformedBy()
        );
    }
}
