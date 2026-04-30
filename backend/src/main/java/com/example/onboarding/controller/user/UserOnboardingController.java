package com.example.onboarding.controller.user;

import com.example.onboarding.dto.DtoMapper;
import com.example.onboarding.dto.OnboardingDTO;
import com.example.onboarding.entity.Onboarding;
import com.example.onboarding.entity.OnboardingStatus;
import com.example.onboarding.entity.User;
import com.example.onboarding.repository.OnboardingRepository;
import com.example.onboarding.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/onboarding")
@RequiredArgsConstructor
public class UserOnboardingController {

    private final OnboardingRepository onboardingRepository;
    private final UserRepository userRepository;

    @GetMapping
    public OnboardingDTO getMyOnboarding(Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find existing onboarding or create new one if it doesn't exist
        Onboarding onboarding = onboardingRepository.findByEmployee(user)
                .orElseGet(() -> {
                    // Auto-create onboarding record for user if it doesn't exist
                    Onboarding newOnboarding = new Onboarding();
                    newOnboarding.setEmployee(user);
                    newOnboarding.setStatus(OnboardingStatus.NOT_STARTED);
                    newOnboarding.setProgress(0);
                    newOnboarding.setDocumentUploadStatus(Onboarding.DocumentUploadStatus.PENDING);
                    return onboardingRepository.save(newOnboarding);
                });

        return DtoMapper.toOnboardingDto(onboarding);
    }
}
