package com.example.onboarding.controller.user;

import com.example.onboarding.entity.Document;
import com.example.onboarding.entity.UserDocument;
import com.example.onboarding.entity.Onboarding;
import com.example.onboarding.entity.OnboardingStatus;
import com.example.onboarding.entity.Profile;
import com.example.onboarding.entity.Role;
import com.example.onboarding.entity.User;
import com.example.onboarding.repository.DocumentRepository;
import com.example.onboarding.repository.UserDocumentRepository;
import com.example.onboarding.repository.OnboardingRepository;
import com.example.onboarding.repository.UserRepository;
import com.example.onboarding.security.JwtUtil;
import com.example.onboarding.util.EmployeeIdService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder;
    private final EmployeeIdService employeeIdService;
    private final DocumentRepository documentRepository;
    private final UserDocumentRepository userDocumentRepository;
    private final OnboardingRepository onboardingRepository;

    @PostMapping("/signup")
    @Transactional
    public void signup(@RequestBody User user) {
        user.setPassword(encoder.encode(user.getPassword()));

        // Generate employeeId if not provided
        if (user.getEmployeeId() == null || user.getEmployeeId().isBlank()) {
            String empId = employeeIdService.nextEmployeeId();
            user.setEmployeeId(empId);
        }

        // Assign role based on profile
        if (user.getProfile() == Profile.HR) {
            user.setRole(Role.ROLE_ADMIN);
        } else {
            user.setRole(Role.ROLE_USER);
        }

        try {
            User savedUser = userRepository.save(user);

            // Auto-create Onboarding record for new regular users (not for admins)
            if (user.getProfile() != Profile.HR) {
                Onboarding onboarding = new Onboarding();
                onboarding.setEmployee(savedUser);
                onboarding.setStatus(OnboardingStatus.NOT_STARTED);
                onboarding.setProgress(0);
                onboarding.setDocumentUploadStatus(Onboarding.DocumentUploadStatus.PENDING);
                onboardingRepository.save(onboarding);
            }

            // Auto-create UserDocument records for all existing documents (only for regular users)
            if (user.getProfile() != Profile.HR) {
                List<Document> allDocuments = documentRepository.findAll();
                for (Document document : allDocuments) {
                    UserDocument userDoc = new UserDocument();
                    userDoc.setUser(savedUser);
                    userDoc.setDocument(document);
                    userDoc.setStatus(UserDocument.UploadStatus.PENDING);
                    userDoc.setApprovalStatus(UserDocument.ApprovalStatus.PENDING);
                    userDocumentRepository.save(userDoc);
                }
                // Flush to ensure IDs are generated
                userDocumentRepository.flush();
            }

        } catch (DataIntegrityViolationException ex) {
            // Map common unique constraint violations to friendly messages
            String cause = "";
            try {
                if (ex.getMostSpecificCause() != null && ex.getMostSpecificCause().getMessage() != null) {
                    cause = ex.getMostSpecificCause().getMessage().toLowerCase();
                }
            } catch (Exception ignored) {
            }

            String message = "Duplicate value";
            if (cause.contains("email")) {
                message = "Email already exists";
            } else if (cause.contains("employee_id") || cause.contains("employeeid") || cause.contains("employee id") || cause.contains("employeeid")) {
                message = "Employee ID already exists";
            } else if (cause.contains("unique") && cause.contains("email")) {
                message = "Email already exists";
            }

            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Signup failed");
        }
    }

    @PostMapping("/login")
    public String login(@RequestBody User request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null || !encoder.matches(request.getPassword(), user.getPassword())) {
            // return 401 for both not found and invalid password to avoid leaking which
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }
}
