package com.example.onboarding.config;

import com.example.onboarding.entity.*;
import com.example.onboarding.repository.*;
import com.example.onboarding.util.OnboardingProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final OnboardingRepository onboardingRepository;
    private final TaskRepository taskRepository;
    private final TrainingRepository trainingRepository;
    private final DocumentRepository documentRepository;
    private final UserDocumentRepository userDocumentRepository;
    private final BCryptPasswordEncoder encoder;
    private final OnboardingProgressService progressService;

    @Bean
    CommandLineRunner init() {
        return args -> {
            System.out.println("========================================");
            System.out.println("🚀 Starting DataInitializer...");
            System.out.println("========================================");

            // ============================
            // 1. CREATE HR PERSONNEL (2)
            // ============================
            System.out.println("\n📋 Creating HR Personnel...");

            // Admin HR (existing)
            String adminEmail = "admin@test.com";
            User admin = userRepository.findByEmail(adminEmail).orElseGet(() -> new User());
            admin.setUsername("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(encoder.encode("admin123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setProfile(Profile.HR);
            admin.setContactNo("+1-555-0001");
            admin.setEmployeeId("HR-001");
            admin = userRepository.save(admin);
            System.out.println("✅ Created HR Admin: " + admin.getEmail() + " (ID: " + admin.getEmployeeId() + ")");

            // Second HR
            String hr2Email = "hr.jane@test.com";
            User hr2 = userRepository.findByEmail(hr2Email).orElseGet(() -> new User());
            hr2.setUsername("Jane HR");
            hr2.setEmail(hr2Email);
            hr2.setPassword(encoder.encode("hr123"));
            hr2.setRole(Role.ROLE_ADMIN);
            hr2.setProfile(Profile.HR);
            hr2.setContactNo("+1-555-0002");
            hr2.setEmployeeId("HR-002");
            hr2 = userRepository.save(hr2);
            System.out.println("✅ Created HR: " + hr2.getEmail() + " (ID: " + hr2.getEmployeeId() + ")");

            // ============================
            // 2. CREATE REGULAR USERS (2)
            // ============================
            System.out.println("\n👥 Creating Regular Users...");

            // User 1 - John Doe
            String user1Email = "user@test.com";
            User user1 = userRepository.findByEmail(user1Email).orElseGet(() -> new User());
            user1.setUsername("John Doe");
            user1.setEmail(user1Email);
            user1.setPassword(encoder.encode("user123"));
            user1.setRole(Role.ROLE_USER);
            user1.setProfile(Profile.REGULAR);
            user1.setContactNo("+1-555-1001");
            user1.setEmployeeId("EMP-001");
            user1.setAssignedHr(admin);
            user1 = userRepository.save(user1);
            System.out.println("✅ Created User: " + user1.getUsername() + " (" + user1.getEmail() + ")");
            System.out.println("   Assigned HR: " + admin.getUsername());

            // User 2 - Sarah Smith
            String user2Email = "sarah.smith@test.com";
            User user2 = userRepository.findByEmail(user2Email).orElseGet(() -> new User());
            user2.setUsername("Sarah Smith");
            user2.setEmail(user2Email);
            user2.setPassword(encoder.encode("user123"));
            user2.setRole(Role.ROLE_USER);
            user2.setProfile(Profile.REGULAR);
            user2.setContactNo("+1-555-1002");
            user2.setEmployeeId("EMP-002");
            user2.setAssignedHr(hr2);
            user2 = userRepository.save(user2);
            System.out.println("✅ Created User: " + user2.getUsername() + " (" + user2.getEmail() + ")");
            System.out.println("   Assigned HR: " + hr2.getUsername());

            // ============================
            // 3. CREATE ONBOARDING RECORDS
            // ============================
            System.out.println("\n📝 Creating Onboarding Records...");

            // Onboarding for User 1
            final User finalUser1 = user1;
            Onboarding onboarding1 = onboardingRepository.findByEmployee(user1)
                    .orElseGet(() -> {
                        Onboarding ob = new Onboarding();
                        ob.setEmployee(finalUser1);
                        return ob;
                    });
            onboarding1.setStatus(OnboardingStatus.NOT_STARTED);
            onboarding1.setProgress(0);
            onboarding1.setAssignedHr(admin);
            onboardingRepository.save(onboarding1);
            System.out.println("✅ Created Onboarding for: " + user1.getUsername());

            // Onboarding for User 2
            final User finalUser2 = user2;
            Onboarding onboarding2 = onboardingRepository.findByEmployee(user2)
                    .orElseGet(() -> {
                        Onboarding ob = new Onboarding();
                        ob.setEmployee(finalUser2);
                        return ob;
                    });
            onboarding2.setStatus(OnboardingStatus.NOT_STARTED);
            onboarding2.setProgress(0);
            onboarding2.setAssignedHr(hr2);
            onboardingRepository.save(onboarding2);
            System.out.println("✅ Created Onboarding for: " + user2.getUsername());

            // ============================
            // 4. CREATE SAMPLE TASKS
            // ============================
            System.out.println("\n✅ Creating Sample Tasks...");

            // Tasks for User 1 (John Doe)
            if (taskRepository.countByEmployeeId(user1.getId()) == 0) {
                String[] user1Tasks = {
                    "Complete employee information form",
                    "Review company policies and procedures",
                    "Set up workstation and email account",
                    "Meet with team members"
                };

                for (String taskTitle : user1Tasks) {
                    Task task = new Task();
                    task.setTitle(taskTitle);
                    task.setEmployee(user1);
                    task.setCompleted(false);
                    taskRepository.save(task);
                }
                System.out.println("✅ Created " + user1Tasks.length + " tasks for: " + user1.getUsername());
            }

            // Tasks for User 2 (Sarah Smith)
            if (taskRepository.countByEmployeeId(user2.getId()) == 0) {
                String[] user2Tasks = {
                    "Read employee handbook",
                    "Complete IT security training",
                    "Schedule orientation meeting",
                    "Submit emergency contact information",
                    "Review benefits package"
                };

                for (String taskTitle : user2Tasks) {
                    Task task = new Task();
                    task.setTitle(taskTitle);
                    task.setEmployee(user2);
                    task.setCompleted(false);
                    taskRepository.save(task);
                }
                System.out.println("✅ Created " + user2Tasks.length + " tasks for: " + user2.getUsername());
            }

            // ============================
            // 5. CREATE SAMPLE TRAININGS
            // ============================
            System.out.println("\n🎓 Creating Sample Trainings...");

            // Trainings for User 1 (John Doe)
            if (trainingRepository.countByEmployeeId(user1.getId()) == 0) {
                Training training1 = new Training();
                training1.setName("Workplace Safety Training");
                training1.setContent("https://www.osha.gov/training");
                training1.setEmployee(user1);
                training1.setCompleted(false);
                training1.setStarted(false);
                trainingRepository.save(training1);

                Training training2 = new Training();
                training2.setName("Data Privacy and Security");
                training2.setContent("https://www.privacyshield.gov/");
                training2.setEmployee(user1);
                training2.setCompleted(false);
                training2.setStarted(false);
                trainingRepository.save(training2);

                System.out.println("✅ Created 2 trainings for: " + user1.getUsername());
            }

            // Trainings for User 2 (Sarah Smith)
            if (trainingRepository.countByEmployeeId(user2.getId()) == 0) {
                Training training1 = new Training();
                training1.setName("Code of Conduct Training");
                training1.setContent("https://www.ethics.org/");
                training1.setEmployee(user2);
                training1.setCompleted(false);
                training1.setStarted(false);
                trainingRepository.save(training1);

                Training training2 = new Training();
                training2.setName("Diversity and Inclusion");
                training2.setContent("https://www.diversity.com/training");
                training2.setEmployee(user2);
                training2.setCompleted(false);
                training2.setStarted(false);
                trainingRepository.save(training2);

                Training training3 = new Training();
                training3.setName("Customer Service Excellence");
                training3.setContent("https://www.customerservice.org/");
                training3.setEmployee(user2);
                training3.setCompleted(false);
                training3.setStarted(false);
                trainingRepository.save(training3);

                System.out.println("✅ Created 3 trainings for: " + user2.getUsername());
            }

            // ============================
            // 6. CREATE SAMPLE DOCUMENTS
            // ============================
            System.out.println("\n📄 Creating Sample Documents to Upload...");

            if (documentRepository.count() == 0) {
                // Mandatory Documents
                String[] mandatoryDocs = {
                    "Government ID (Passport/Driver's License)",
                    "Social Security Card",
                    "Employment Contract (Signed)",
                    "Direct Deposit Authorization Form",
                    "Emergency Contact Form"
                };

                for (String docName : mandatoryDocs) {
                    Document doc = new Document();
                    doc.setName(docName);
                    doc.setDocumentType(Document.DocumentType.MANDATORY);
                    documentRepository.save(doc);
                }
                System.out.println("✅ Created " + mandatoryDocs.length + " mandatory documents");

                // Optional Documents
                String[] optionalDocs = {
                    "Educational Certificates",
                    "Professional Certifications",
                    "Previous Employment Letters"
                };

                for (String docName : optionalDocs) {
                    Document doc = new Document();
                    doc.setName(docName);
                    doc.setDocumentType(Document.DocumentType.OPTIONAL);
                    documentRepository.save(doc);
                }
                System.out.println("✅ Created " + optionalDocs.length + " optional documents");

                // ============================
                // 6.1 CREATE USER-DOCUMENT LINKS
                // ============================
                System.out.println("\n🔗 Creating UserDocument entries for sample users...");

                // Get all documents
                List<Document> allDocuments = documentRepository.findAll();

                // Create UserDocument for User 1
                for (Document document : allDocuments) {
                    UserDocument userDoc1 = new UserDocument();
                    userDoc1.setUser(user1);
                    userDoc1.setDocument(document);
                    userDoc1.setStatus(UserDocument.UploadStatus.PENDING);
                    userDoc1.setApprovalStatus(UserDocument.ApprovalStatus.PENDING);
                    userDocumentRepository.save(userDoc1);
                }
                System.out.println("✅ Created " + allDocuments.size() + " document entries for: " + user1.getUsername());

                // Create UserDocument for User 2
                for (Document document : allDocuments) {
                    UserDocument userDoc2 = new UserDocument();
                    userDoc2.setUser(user2);
                    userDoc2.setDocument(document);
                    userDoc2.setStatus(UserDocument.UploadStatus.PENDING);
                    userDoc2.setApprovalStatus(UserDocument.ApprovalStatus.PENDING);
                    userDocumentRepository.save(userDoc2);
                }
                System.out.println("✅ Created " + allDocuments.size() + " document entries for: " + user2.getUsername());
            }

            // ============================
            // 7. RECALCULATE PROGRESS
            // ============================
            System.out.println("\n🔄 Recalculating Onboarding Progress...");
            progressService.recalculateForEmployee(user1.getId());
            progressService.recalculateForEmployee(user2.getId());

            // Reload onboardings to show updated progress
            onboarding1 = onboardingRepository.findByEmployee(user1).orElse(null);
            onboarding2 = onboardingRepository.findByEmployee(user2).orElse(null);

            System.out.println("✅ " + user1.getUsername() + " - Status: " +
                (onboarding1 != null ? onboarding1.getStatus() : "N/A") +
                ", Progress: " + (onboarding1 != null ? onboarding1.getProgress() : 0) + "%");
            System.out.println("✅ " + user2.getUsername() + " - Status: " +
                (onboarding2 != null ? onboarding2.getStatus() : "N/A") +
                ", Progress: " + (onboarding2 != null ? onboarding2.getProgress() : 0) + "%");

            // ============================
            // 8. SUMMARY
            // ============================
            System.out.println("\n========================================");
            System.out.println("✅ DataInitializer Complete!");
            System.out.println("========================================");
            System.out.println("📊 Summary:");
            System.out.println("   • HR Personnel: 2");
            System.out.println("   • Regular Users: 2");
            System.out.println("   • Tasks: " + taskRepository.count());
            System.out.println("   • Trainings: " + trainingRepository.count());
            System.out.println("   • Documents: " + documentRepository.count());
            System.out.println("========================================");
            System.out.println("\n🔐 Login Credentials:");
            System.out.println("   Admin HR:");
            System.out.println("      Email: admin@test.com");
            System.out.println("      Password: admin123");
            System.out.println("   HR Jane:");
            System.out.println("      Email: hr.jane@test.com");
            System.out.println("      Password: hr123");
            System.out.println("   User John:");
            System.out.println("      Email: user@test.com");
            System.out.println("      Password: user123");
            System.out.println("   User Sarah:");
            System.out.println("      Email: sarah.smith@test.com");
            System.out.println("      Password: user123");
            System.out.println("========================================\n");
        };
    }
}
