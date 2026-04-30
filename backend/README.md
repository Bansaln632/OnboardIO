# 🔧 OnboardIO Backend - Technical Documentation

> Spring Boot backend service for the OnboardIO employee onboarding platform

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Security & Authentication](#security--authentication)
- [File Storage Strategy](#file-storage-strategy)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Key Features](#key-features)
- [Dependencies](#dependencies)
- [Running the Application](#running-the-application)

---

## 🎯 Overview

The OnboardIO backend is a RESTful API service built with **Spring Boot 4.0.1** that provides:
- User authentication and authorization (JWT + OAuth2)
- Employee onboarding management
- Task and training assignment
- Document upload and approval workflow
- Progress tracking and status management
- Role-based access control (Admin/User)

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Spring Boot** | 4.0.1 | Application framework |
| **Java** | 17 | Programming language |
| **Spring Security** | 6.x | Security framework |
| **Spring Data JPA** | 4.x | Data access layer |
| **Hibernate** | 6.x | ORM framework |
| **H2 Database** | Runtime | In-memory database (dev) |
| **JJWT** | 0.11.5 | JWT token generation |
| **OAuth2 Client** | Spring Boot Starter | Google Sign-In |
| **SpringDoc OpenAPI** | 2.3.0 | API documentation |
| **Lombok** | Provided | Boilerplate reduction |
| **BCrypt** | Spring Security | Password encryption |
| **Maven** | 3.6+ | Build tool |

---

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│              (Frontend React App)                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     │ JWT Token
┌────────────────────▼────────────────────────────────────┐
│                 Controller Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │    Auth     │  │    Admin    │  │    User     │   │
│  │ Controller  │  │ Controller  │  │ Controller  │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
└─────────┼─────────────────┼─────────────────┼──────────┘
          │                 │                 │
┌─────────▼─────────────────▼─────────────────▼──────────┐
│                  Security Layer                         │
│  ┌──────────────────────────────────────────────┐     │
│  │  JWT Filter → Validate Token → Set Auth     │     │
│  └──────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
          │
┌─────────▼─────────────────────────────────────────────┐
│                  Service Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │    Auth     │  │ Onboarding  │  │  Progress   │  │
│  │   Service   │  │   Service   │  │   Service   │  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │
└─────────┼─────────────────┼─────────────────┼─────────┘
          │                 │                 │
┌─────────▼─────────────────▼─────────────────▼─────────┐
│              Repository Layer (Spring Data JPA)        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │   User   │  │   Task   │  │ Document │  ...      │
│  │   Repo   │  │   Repo   │  │   Repo   │           │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘           │
└───────┼─────────────┼─────────────┼───────────────────┘
        │             │             │
┌───────▼─────────────▼─────────────▼───────────────────┐
│                  Database Layer                        │
│           H2 (Dev) / PostgreSQL (Prod)                │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
backend/
├── src/main/java/com/example/onboarding/
│   │
│   ├── config/                      # Configuration Classes
│   │   ├── SecurityConfig.java      # Security & CORS config
│   │   ├── DataInitializer.java     # Sample data loader
│   │   └── SwaggerConfig.java       # API documentation config
│   │
│   ├── controller/                  # REST API Endpoints
│   │   ├── AuthController.java      # /api/auth/*
│   │   ├── AdminUserController.java # /api/admin/users
│   │   ├── AdminController.java     # /api/admin/*
│   │   ├── UserTaskController.java  # /api/user/task
│   │   ├── UserTrainingController.java  # /api/user/training
│   │   ├── UserDocumentController.java  # /api/user/documents
│   │   └── UserOnboardingController.java # /api/user/onboarding
│   │
│   ├── dto/                         # Data Transfer Objects
│   │   ├── LoginRequest.java        # Login payload
│   │   ├── SignupRequest.java       # Signup payload
│   │   ├── OnboardingDTO.java       # Onboarding response
│   │   ├── TaskDTO.java             # Task response
│   │   ├── TrainingDTO.java         # Training response
│   │   └── UserDocumentDTO.java     # Document response
│   │
│   ├── entity/                      # JPA Entities
│   │   ├── User.java                # User entity (employees + HR)
│   │   ├── Onboarding.java          # Onboarding status
│   │   ├── Task.java                # Task entity
│   │   ├── Training.java            # Training entity
│   │   ├── Document.java            # Document template
│   │   ├── UserDocument.java        # Uploaded documents
│   │   ├── OnboardingAssignmentHistory.java # HR assignment audit
│   │   ├── Role.java                # Enum: ROLE_ADMIN, ROLE_USER
│   │   ├── Profile.java             # Enum: HR, REGULAR
│   │   ├── OnboardingStatus.java    # Enum: NOT_STARTED, IN_PROGRESS, COMPLETED
│   │   └── ApprovalStatus.java      # Enum: PENDING, APPROVED, REJECTED
│   │
│   ├── repository/                  # Data Access Layer
│   │   ├── UserRepository.java      # User CRUD
│   │   ├── OnboardingRepository.java # Onboarding CRUD
│   │   ├── TaskRepository.java      # Task CRUD + queries
│   │   ├── TrainingRepository.java  # Training CRUD + queries
│   │   ├── DocumentRepository.java  # Document template CRUD
│   │   ├── UserDocumentRepository.java # User document CRUD
│   │   └── OnboardingAssignmentHistoryRepository.java
│   │
│   ├── security/                    # Security Components
│   │   ├── JwtUtil.java             # JWT generation & validation
│   │   ├── JwtFilter.java           # JWT authentication filter
│   │   ├── CustomUserDetailsService.java # Load user by email
│   │   └── OAuth2AuthenticationSuccessHandler.java # Google login
│   │
│   ├── service/                     # Business Logic
│   │   ├── AuthService.java         # Authentication logic
│   │   ├── OnboardingService.java   # Onboarding management
│   │   └── (other services as needed)
│   │
│   └── util/                        # Utility Classes
│       ├── EmployeeIdService.java   # Auto-generate EMP-001, EMP-002...
│       └── OnboardingProgressService.java # Calculate progress %
│
├── src/main/resources/
│   ├── application.properties       # Application configuration
│   └── (other resources)
│
├── src/test/java/                   # Unit & Integration Tests
│
└── pom.xml                          # Maven dependencies
```

---

## 🔐 Security & Authentication

### 1. JWT Authentication

**Implementation**: JJWT library (io.jsonwebtoken)

#### Token Generation
```java
// JwtUtil.java
public String generateToken(String email, String role) {
    return Jwts.builder()
        .setSubject(email)
        .claim("role", role)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
        .signWith(getKey(), SignatureAlgorithm.HS256)
        .compact();
}
```

#### Token Validation
```java
// JwtFilter.java
- Extract token from Authorization header
- Validate token signature and expiration
- Extract email and role from claims
- Set authentication in SecurityContext
```

**Token Structure**:
```json
{
  "sub": "user@test.com",
  "role": "ROLE_USER",
  "iat": 1737504000,
  "exp": 1737590400
}
```

### 2. OAuth2 Google Sign-In

**Flow**:
```
User clicks "Sign in with Google"
        ↓
Frontend redirects to: /oauth2/authorization/google
        ↓
Spring Security OAuth2 takes over
        ↓
User authenticates with Google
        ↓
Google redirects back to: /login/oauth2/code/google
        ↓
OAuth2AuthenticationSuccessHandler:
  - Extract email, name, googleId from OAuth2User
  - Find or create user in database
  - Generate JWT token
  - Redirect to frontend with token
```

**Configuration** (`application.properties`):
```properties
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.scope=profile,email
```

### 3. Password Encryption

**Algorithm**: BCrypt (Spring Security)

```java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hashedPassword = encoder.encode("plainPassword");
boolean matches = encoder.matches("plainPassword", hashedPassword);
```

**Strength**: 10 rounds (default)

### 4. Role-Based Access Control

**Roles**:
- `ROLE_ADMIN` - HR personnel (can manage onboarding)
- `ROLE_USER` - Employees (can complete onboarding)

**Endpoint Protection**:
```java
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> adminEndpoint() { ... }

@PreAuthorize("hasRole('USER')")
public ResponseEntity<?> userEndpoint() { ... }
```

### 5. CORS Configuration

**Allowed Origins**: `http://localhost:5173` (frontend)
**Allowed Methods**: GET, POST, PUT, DELETE
**Allowed Headers**: Authorization, Content-Type
**Credentials**: Enabled

---

## 💾 File Storage Strategy

### Local File System Storage

**Why Local Storage?**
- ✅ Simple implementation
- ✅ No external service dependencies
- ✅ Free (no costs)
- ✅ Fast access
- ✅ Easy to implement
- ⚠️ Not scalable for production (use S3/Azure Blob)

### Storage Structure

```
project-root/
└── uploads/
    ├── user_1/
    │   ├── uuid-1.pdf
    │   └── uuid-2.pdf
    ├── user_2/
    │   ├── uuid-3.pdf
    │   └── uuid-4.pdf
    └── user_N/
        └── uuid-N.pdf
```

### Upload Flow

```java
// 1. Receive file from frontend
@PostMapping("/upload")
public ResponseEntity<?> uploadDocument(
    @RequestParam("file") MultipartFile file,
    @RequestParam("documentTypeId") Long documentTypeId
) {
    // 2. Validate file
    - Check file size (5KB - 20MB)
    - Check file type (PDF only)
    - Check if document type exists
    
    // 3. Generate unique filename
    String filename = UUID.randomUUID().toString() + ".pdf";
    
    // 4. Create user directory if not exists
    Path userDir = Paths.get("uploads/user_" + userId);
    Files.createDirectories(userDir);
    
    // 5. Save file to disk
    Path filePath = userDir.resolve(filename);
    Files.copy(file.getInputStream(), filePath);
    
    // 6. Save metadata to database
    UserDocument doc = new UserDocument();
    doc.setFilePath(filePath.toString());
    doc.setUser(user);
    doc.setDocumentType(documentType);
    doc.setApprovalStatus(ApprovalStatus.PENDING);
    userDocumentRepository.save(doc);
    
    return ResponseEntity.ok("Uploaded successfully");
}
```

### Download Flow

```java
@GetMapping("/download/{id}")
public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
    // 1. Get document metadata from database
    UserDocument doc = userDocumentRepository.findById(id);
    
    // 2. Load file from disk
    Path filePath = Paths.get(doc.getFilePath());
    Resource resource = new FileSystemResource(filePath);
    
    // 3. Return file with headers
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, 
                "attachment; filename=\"" + filePath.getFileName() + "\"")
        .contentType(MediaType.APPLICATION_PDF)
        .body(resource);
}
```

### File Validation

```java
// Size validation
if (file.getSize() < 5 * 1024) {
    throw new RuntimeException("File size must be at least 5KB");
}
if (file.getSize() > 20 * 1024 * 1024) {
    throw new RuntimeException("File size must not exceed 20MB");
}

// Type validation
if (!file.getContentType().equals("application/pdf")) {
    throw new RuntimeException("Only PDF files are allowed");
}
```

### Production Alternatives

For production deployment, consider:

1. **AWS S3**
   ```java
   AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
   s3Client.putObject(bucketName, key, file.getInputStream(), metadata);
   ```

2. **Azure Blob Storage**
   ```java
   BlobClient blobClient = blobContainerClient.getBlobClient(blobName);
   blobClient.upload(data);
   ```

3. **Google Cloud Storage**
   ```java
   Storage storage = StorageOptions.getDefaultInstance().getService();
   storage.create(blobInfo, content);
   ```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐          ┌──────────────────┐
│      User       │          │   Onboarding     │
├─────────────────┤          ├──────────────────┤
│ id (PK)         │◄────────┐│ id (PK)          │
│ email           │         ││ employee_id (FK) │
│ username        │         ││ assigned_hr_id   │
│ password        │         ││ status           │
│ employee_id     │         ││ progress         │
│ role            │         │└──────────────────┘
│ profile         │         │
│ contact_no      │         │
│ google_id       │         │
│ assigned_hr_id  │◄────────┘
└─────────────────┘
        │                    
        │ 1:N                
        ▼                    
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│      Task       │     │    Training      │     │    Document      │
├─────────────────┤     ├──────────────────┤     ├──────────────────┤
│ id (PK)         │     │ id (PK)          │     │ id (PK)          │
│ title           │     │ name             │     │ name             │
│ completed       │     │ content (URL)    │     │ document_type    │
│ employee_id(FK) │     │ completed        │     │ (MANDATORY/      │
└─────────────────┘     │ started          │     │  OPTIONAL)       │
                        │ employee_id (FK) │     └──────────────────┘
                        └──────────────────┘              │
                                                          │ N:1
                                                          ▼
                                              ┌──────────────────┐
                                              │  UserDocument    │
                                              ├──────────────────┤
                                              │ id (PK)          │
                                              │ user_id (FK)     │
                                              │ document_type(FK)│
                                              │ file_path        │
                                              │ approval_status  │
                                              │ uploaded_at      │
                                              └──────────────────┘
```

### Key Tables

#### 1. User
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255),
    password VARCHAR(255),
    employee_id VARCHAR(50) UNIQUE,
    role VARCHAR(50),  -- ROLE_ADMIN, ROLE_USER
    profile VARCHAR(50),  -- HR, REGULAR
    contact_no VARCHAR(20),
    google_id VARCHAR(255) UNIQUE,
    assigned_hr_id BIGINT,
    FOREIGN KEY (assigned_hr_id) REFERENCES users(id)
);
```

#### 2. Onboarding
```sql
CREATE TABLE onboarding (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT UNIQUE NOT NULL,
    assigned_hr_id BIGINT,
    status VARCHAR(50),  -- NOT_STARTED, IN_PROGRESS, COMPLETED
    progress INT,  -- 0-100
    FOREIGN KEY (employee_id) REFERENCES users(id),
    FOREIGN KEY (assigned_hr_id) REFERENCES users(id)
);
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | No |
| POST | `/login` | Login with credentials | No |
| GET | `/oauth2/authorization/google` | Google Sign-In | No |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/onboarding/users` | Get all onboarding users | Admin |
| GET | `/users` | Get all users | Admin |
| PUT | `/{id}/assign-hr` | Assign HR to user | Admin |
| POST | `/task` | Create task for user | Admin |
| DELETE | `/task/{id}` | Delete task | Admin |
| POST | `/training` | Create training for user | Admin |
| DELETE | `/training/{id}` | Delete training | Admin |
| POST | `/document` | Create document template | Admin |
| GET | `/documents/{userId}` | Get user's uploaded documents | Admin |
| PUT | `/documents/{id}/review` | Approve/reject document | Admin |

### User (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/onboarding` | Get my onboarding status | User |
| GET | `/task` | Get my tasks | User |
| PUT | `/task/{id}` | Mark task as complete | User |
| GET | `/training` | Get my trainings | User |
| POST | `/training/{id}/visit` | Mark training complete | User |
| GET | `/documents` | Get document templates | User |
| POST | `/documents/upload` | Upload document | User |

---

## ⚙️ Configuration

### application.properties

```properties
# Application Info
spring.application.name=OnboardIO
server.port=8080

# H2 Database
spring.datasource.url=jdbc:h2:mem:onboardingdb
spring.h2.console.enabled=true

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your-256-bit-secret-key
jwt.expiration=86400000

# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID:}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET:}

# File Upload
spring.servlet.multipart.max-file-size=20MB
```

---

## 🚀 Running the Application

```bash
cd backend
mvn spring-boot:run
```

**Access Points**:
- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console

---

**Backend Version**: 1.0.0  
**Last Updated**: January 21, 2026

