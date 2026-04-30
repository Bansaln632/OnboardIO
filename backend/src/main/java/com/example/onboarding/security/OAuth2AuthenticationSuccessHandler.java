package com.example.onboarding.security;

import com.example.onboarding.entity.Document;
import com.example.onboarding.entity.Onboarding;
import com.example.onboarding.entity.OnboardingStatus;
import com.example.onboarding.entity.Profile;
import com.example.onboarding.entity.Role;
import com.example.onboarding.entity.User;
import com.example.onboarding.entity.UserDocument;
import com.example.onboarding.repository.DocumentRepository;
import com.example.onboarding.repository.OnboardingRepository;
import com.example.onboarding.repository.UserDocumentRepository;
import com.example.onboarding.repository.UserRepository;
import com.example.onboarding.util.EmployeeIdService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * OAuth2 Authentication Success Handler
 * Handles successful Google Sign-In by:
 * 1. Creating or updating user in database
 * 2. Generating JWT token
 * 3. Redirecting to frontend with token
 */
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final OnboardingRepository onboardingRepository;
    private final EmployeeIdService employeeIdService;
    private final DocumentRepository documentRepository;
    private final UserDocumentRepository userDocumentRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Extract user info from Google
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");

        if (email == null || email.isEmpty()) {
            // Redirect to error page if email not provided
            getRedirectStrategy().sendRedirect(request, response,
                "http://localhost:5173/login?error=no_email");
            return;
        }

        // Find or create user
        User user = findOrCreateUser(email, name, googleId);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        // Redirect to frontend with token
        String targetUrl = UriComponentsBuilder
                .fromUriString("http://localhost:5173/oauth2/redirect")
                .queryParam("token", token)
                .build()
                .toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    /**
     * Find existing user or create new one for Google Sign-In
     */
    private User findOrCreateUser(String email, String name, String googleId) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            // Update Google ID if not already set
            User user = existingUser.get();
            if (user.getGoogleId() == null || user.getGoogleId().isEmpty()) {
                user.setGoogleId(googleId);
                userRepository.save(user);
            }
            return user;
        }

        // Create new user for Google Sign-In
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUsername(name != null ? name : email.split("@")[0]);
        newUser.setGoogleId(googleId);

        // No password for OAuth users (they sign in via Google)
        newUser.setPassword(""); // Empty password, can't login via traditional method

        // Generate employee ID
        newUser.setEmployeeId(employeeIdService.nextEmployeeId());

        // Set default profile and role
        newUser.setProfile(Profile.REGULAR);
        newUser.setRole(Role.ROLE_USER);

        User savedUser = userRepository.save(newUser);

        // Create onboarding record
        Onboarding onboarding = new Onboarding();
        onboarding.setEmployee(savedUser);
        onboarding.setStatus(OnboardingStatus.NOT_STARTED);
        onboarding.setProgress(0);
        onboarding.setDocumentUploadStatus(Onboarding.DocumentUploadStatus.PENDING);
        onboardingRepository.save(onboarding);

        // Auto-create UserDocument records for all existing documents
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

        return savedUser;
    }
}
