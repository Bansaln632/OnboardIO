# 🚀 OnboardIO - Modern Employee Onboarding Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A comprehensive, modern employee onboarding system built with Spring Boot and React that streamlines the entire onboarding process from task management to document verification.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Application Flow](#application-flow)
- [User Roles](#user-roles)
- [Sample Data](#sample-data)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**OnboardIO** is a full-stack employee onboarding management system designed to simplify and automate the onboarding process for HR teams and new employees. It provides a centralized platform for task management, training assignment, document collection, and progress tracking.

### Why OnboardIO?

- ✅ **Streamlined Onboarding**: Reduce onboarding time from weeks to days
- 📊 **Real-time Progress Tracking**: Monitor each employee's onboarding status
- 🔐 **Secure Authentication**: JWT-based auth with Google Sign-In support
- 📄 **Document Management**: Automated document collection and approval workflow
- 🎓 **Training Integration**: Assign and track mandatory training completion
- 👥 **HR Assignment**: Automatic HR assignment for personalized support

---

## ✨ Features

### For HR/Admin

- 👥 **Employee Management**: View all onboarding employees with status and progress
- ✅ **Task Assignment**: Create and assign onboarding tasks to employees
- 🎓 **Training Management**: Assign training courses with external links
- 📄 **Document Templates**: Define mandatory/optional documents for upload
- ✔️ **Document Review**: Review and approve/reject uploaded documents
- 📊 **Progress Dashboard**: Real-time overview of all onboarding activities
- 🔄 **HR Assignment**: Assign HR representatives to employees
- 📜 **Assignment History**: Track HR assignment changes with audit trail

### For Employees

- 📋 **Task List**: View and complete assigned onboarding tasks
- 🎓 **Training Portal**: Access training materials and mark as complete
- 📤 **Document Upload**: Upload required documents (PDF, 5KB-20MB)
- 📊 **Progress Tracking**: View onboarding progress percentage
- 👤 **Profile Management**: Update personal information
- 🔔 **Status Updates**: Real-time status (Not Started, In Progress, Completed)

### Authentication & Security

- 🔐 **JWT Authentication**: Secure token-based authentication
- 🌐 **Google Sign-In**: OAuth2 integration for easy login
- 🔒 **Role-Based Access**: Admin (HR) and User (Employee) roles
- 🛡️ **Password Encryption**: BCrypt password hashing
- 🚫 **Protected Routes**: Frontend and backend route protection

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │  Admin   │  │   User   │  │Activities│   │
│  │  /Signup │  │Dashboard │  │Dashboard │  │   Page   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│       └─────────────┴──────────────┴─────────────┘          │
│                         │                                    │
│                    Axios HTTP Client                         │
└────────────────────────┼────────────────────────────────────┘
                         │
                    JWT Token (Authorization Header)
                         │
┌────────────────────────┼────────────────────────────────────┐
│                         │ Spring Boot Backend                │
│                    ┌────▼─────┐                             │
│                    │ Security │ ← JWT Filter + OAuth2       │
│                    │  Layer   │                             │
│                    └────┬─────┘                             │
│                         │                                    │
│       ┌─────────────────┼─────────────────┐                │
│       │                 │                 │                 │
│  ┌────▼─────┐    ┌─────▼──────┐   ┌─────▼──────┐         │
│  │  Auth    │    │   Admin    │   │    User    │         │
│  │Controller│    │ Controller │   │ Controller │         │
│  └────┬─────┘    └─────┬──────┘   └─────┬──────┘         │
│       │                │                 │                 │
│       │         ┌──────▼──────┐          │                 │
│       │         │  Services   │          │                 │
│       │         │  (Business  │          │                 │
│       │         │   Logic)    │          │                 │
│       │         └──────┬──────┘          │                 │
│       │                │                 │                 │
│       │         ┌──────▼──────────────┐  │                 │
│       │         │   Repositories      │  │                 │
│       │         │   (Data Access)     │  │                 │
│       │         └──────┬──────────────┘  │                 │
│       │                │                 │                 │
│       └────────────────┴─────────────────┘                 │
│                        │                                    │
│                 ┌──────▼──────┐                            │
│                 │  H2 Database │ (In-Memory)               │
│                 │  JPA/Hibernate│                          │
│                 └──────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 4.0.1
- **Language**: Java 17
- **Security**: Spring Security 6 + JWT (JJWT 0.11.5)
- **OAuth2**: Google Sign-In integration
- **Database**: H2 (In-Memory) / PostgreSQL (Production-ready)
- **ORM**: Spring Data JPA / Hibernate
- **API Documentation**: Swagger/OpenAPI 3 (SpringDoc)
- **Build Tool**: Maven
- **Validation**: Bean Validation (JSR-380)

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.12.0
- **HTTP Client**: Axios 1.13.2
- **Styling**: Tailwind CSS 4.1.18
- **Icons**: Inline SVG
- **State Management**: React Hooks (useState, useEffect)

### Development Tools
- **Backend Hot Reload**: Spring Boot DevTools
- **Frontend Hot Reload**: Vite HMR
- **API Testing**: Swagger UI
- **Database Console**: H2 Console

---

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

### Required
- **Java 17 or higher** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
- **Node.js 20.17.0+** - [Download](https://nodejs.org/)
- **npm 10.8.2+** (comes with Node.js)

### Optional
- **Git** - For cloning the repository
- **IDE**: IntelliJ IDEA / VS Code / Eclipse
- **Postman** - For API testing

### Verify Installation

```bash
# Check Java version
java -version
# Expected: java version "17.x.x" or higher

# Check Maven version
mvn -version
# Expected: Apache Maven 3.6.x or higher

# Check Node.js version
node --version
# Expected: v20.17.0 or higher

# Check npm version
npm --version
# Expected: 10.8.2 or higher
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd employeeOnBoarding
```

### 2. Configure Google OAuth2 (Optional)

If you want to enable Google Sign-In:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`
6. Update `backend/src/main/resources/application.properties`:

```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
```

### 3. Start Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

**Backend will start on**: `http://localhost:8080`

**Verify backend is running**:
- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:onboardingdb`
  - Username: `sa`
  - Password: (blank)

### 4. Start Frontend

```bash
# Open new terminal
# Navigate to frontend directory
cd frontend/employee-onboarding-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will start on**: `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to: **http://localhost:5173**

---

## 🔑 Default Login Credentials

The application comes with pre-populated sample data:

### Admin/HR Accounts

| Role | Email | Password | Employee ID |
|------|-------|----------|-------------|
| Admin HR | admin@test.com | admin123 | HR-001 |
| HR Personnel | hr.jane@test.com | hr123 | HR-002 |

### Employee Accounts

| Name | Email | Password | Employee ID |
|------|-------|----------|-------------|
| John Doe | user@test.com | user123 | EMP-001 |
| Sarah Smith | sarah.smith@test.com | user123 | EMP-002 |

---

## 🔄 Application Flow

### 1. Authentication Flow

```
User opens http://localhost:5173
        ↓
Home Page (Login/Signup)
        ↓
┌───────────────────────┐
│ Traditional Login     │ → Email + Password → JWT Token
└───────────────────────┘
        OR
┌───────────────────────┐
│ Google Sign-In        │ → OAuth2 Flow → JWT Token
└───────────────────────┘
        ↓
Token stored in localStorage
        ↓
Role-based redirect:
  - Admin → /admin (Admin Dashboard)
  - User → /user (User Dashboard)
```

### 2. Admin Workflow

```
Admin Login (admin@test.com)
        ↓
Admin Dashboard
├── View Employee Onboardings
│   ├── Employee Name
│   ├── Status (Not Started, In Progress, Completed)
│   ├── Progress (0-100%)
│   └── Assigned HR
│
└── Activities Menu
    ├── Manage Tasks
    │   └── Assign tasks to employees
    │
    ├── Manage Trainings
    │   └── Assign training courses
    │
    ├── HR Assignment
    │   ├── Assign/Unassign HR
    │   └── View history
    │
    ├── Document Templates
    │   └── Define mandatory/optional docs
    │
    └── Document Review
        ├── View uploaded documents
        └── Approve/Reject
```

### 3. Employee Workflow

```
Employee Login (user@test.com)
        ↓
User Dashboard
├── View Onboarding Status
│   ├── Progress percentage
│   ├── Current status
│   └── Assigned HR
│
└── Activities Menu
    ├── My Tasks
    │   └── Mark tasks as complete
    │
    ├── My Trainings
    │   ├── View training links
    │   └── Start training (auto-complete on link visit)
    │
    └── Upload Documents
        ├── Upload required documents
        ├── View upload status
        └── Check approval status
```

### 4. Progress Calculation

The system automatically calculates onboarding progress:

```
Total Activities = Tasks + Trainings + Mandatory Documents
Completed Activities = Completed Tasks + Completed Trainings + Approved Docs
Progress % = (Completed / Total) × 100

Example:
- Tasks: 4 (2 completed)
- Trainings: 2 (1 completed)
- Mandatory Docs: 5 (2 approved)
- Total: 11
- Completed: 5
- Progress: 5/11 = 45%
```

**Status Updates**:
- `NOT_STARTED`: Progress = 0%
- `IN_PROGRESS`: 0% < Progress < 100%
- `COMPLETED`: Progress = 100%

---

## 👥 User Roles

### ROLE_ADMIN (HR Personnel)

**Permissions**:
- ✅ View all employee onboardings
- ✅ Assign/unassign tasks to employees
- ✅ Create/manage training courses
- ✅ Define document templates
- ✅ Review and approve/reject documents
- ✅ Assign HR representatives to employees
- ✅ View assignment history
- ✅ Access all admin endpoints

**Profile**: `HR`

### ROLE_USER (Employee)

**Permissions**:
- ✅ View own onboarding status
- ✅ Complete assigned tasks
- ✅ Access training materials
- ✅ Upload required documents
- ✅ View document approval status
- ✅ Update personal information
- ❌ Cannot access admin features

**Profile**: `REGULAR`

---

## 📊 Sample Data

On application startup, the system automatically creates:

### Users
- **2 HR Personnel**: Admin, Jane HR
- **2 Employees**: John Doe, Sarah Smith

### Tasks
- **9 Total**: 4 for John, 5 for Sarah
- Examples: "Complete employee information form", "Review company policies"

### Trainings
- **5 Total**: 2 for John, 3 for Sarah
- Examples: "Workplace Safety Training", "Data Privacy and Security"

### Documents
- **8 Templates**: 5 Mandatory, 3 Optional
- Mandatory: Government ID, Social Security Card, etc.
- Optional: Educational Certificates, etc.

---

## 📁 Project Structure

```
employeeOnBoarding/
│
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/example/onboarding/
│   │   ├── config/                   # Configuration classes
│   │   │   ├── SecurityConfig.java   # Security configuration
│   │   │   ├── DataInitializer.java  # Sample data loader
│   │   │   └── SwaggerConfig.java    # API documentation
│   │   │
│   │   ├── controller/               # REST Controllers
│   │   │   ├── AuthController.java   # Auth endpoints
│   │   │   ├── AdminController.java  # Admin endpoints
│   │   │   └── UserController.java   # User endpoints
│   │   │
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── LoginRequest.java
│   │   │   ├── SignupRequest.java
│   │   │   └── ...
│   │   │
│   │   ├── entity/                   # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Onboarding.java
│   │   │   ├── Task.java
│   │   │   ├── Training.java
│   │   │   └── Document.java
│   │   │
│   │   ├── repository/               # Data Access Layer
│   │   │   ├── UserRepository.java
│   │   │   ├── OnboardingRepository.java
│   │   │   └── ...
│   │   │
│   │   ├── security/                 # Security components
│   │   │   ├── JwtUtil.java          # JWT utility
│   │   │   ├── JwtFilter.java        # JWT filter
│   │   │   └── OAuth2AuthenticationSuccessHandler.java
│   │   │
│   │   ├── service/                  # Business Logic
│   │   │   ├── AuthService.java
│   │   │   ├── OnboardingService.java
│   │   │   └── ...
│   │   │
│   │   └── util/                     # Utility classes
│   │       ├── EmployeeIdService.java
│   │       └── OnboardingProgressService.java
│   │
│   ├── src/main/resources/
│   │   └── application.properties    # App configuration
│   │
│   └── pom.xml                       # Maven dependencies
│
├── frontend/employee-onboarding-ui/  # React Frontend
│   ├── src/
│   │   ├── admin/                    # Admin components
│   │   │   └── AdminDashboardSimple.jsx
│   │   │
│   │   ├── auth/                     # Authentication
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── authService.js
│   │   │   ├── GoogleSignInButton.jsx
│   │   │   └── OAuth2Redirect.jsx
│   │   │
│   │   ├── components/               # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── ActivitiesSimple.jsx
│   │   │   └── AboutUs.jsx
│   │   │
│   │   ├── user/                     # User components
│   │   │   └── UserDashboardSimple.jsx
│   │   │
│   │   ├── services/                 # API services
│   │   │   ├── taskService.js
│   │   │   ├── trainingService.js
│   │   │   ├── documentService.js
│   │   │   └── onboardingService.js
│   │   │
│   │   ├── context/                  # React Context
│   │   │   └── ToastContext.jsx
│   │   │
│   │   ├── styles/                   # CSS files
│   │   │   └── app.css
│   │   │
│   │   ├── App.jsx                   # Root component
│   │   ├── main.jsx                  # Entry point
│   │   └── constants.js              # API endpoints
│   │
│   └── package.json                  # npm dependencies
│
├── uploads/                          # Uploaded documents (local storage)
│
├── README.md                         # This file
├── SAMPLE_DATA_INITIALIZATION.md     # Sample data guide
└── LOGIN_TO_DASHBOARD_GUIDE.md       # Login flow guide
```

---

## 📡 API Documentation

### Swagger UI

Access interactive API documentation at:
**http://localhost:8080/swagger-ui.html**

### Key Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login with credentials
- `GET /oauth2/authorization/google` - Google Sign-In

#### Admin
- `GET /api/admin/onboarding/users` - Get all onboarding users
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/{id}/assign-hr` - Assign HR to user
- `POST /api/admin/task` - Create task
- `POST /api/admin/training` - Create training
- `POST /api/admin/document` - Create document template
- `GET /api/admin/documents/{userId}` - Get user documents
- `PUT /api/admin/documents/{id}/review` - Approve/reject document

#### User
- `GET /api/user/onboarding` - Get my onboarding
- `GET /api/user/task` - Get my tasks
- `PUT /api/user/task/{id}` - Complete task
- `GET /api/user/training` - Get my trainings
- `POST /api/user/training/{id}/visit` - Mark training complete
- `GET /api/user/documents` - Get document templates
- `POST /api/user/documents/upload` - Upload document

---

## 🧪 Testing

### Running Backend Tests

```bash
cd backend
mvn test
```

### Running Frontend Tests

```bash
cd frontend/employee-onboarding-ui
npm test
```

### Manual Testing

1. **Test Authentication**:
   - Login with admin credentials
   - Login with user credentials
   - Try Google Sign-In (if configured)

2. **Test Admin Features**:
   - View employee list
   - Assign tasks
   - Create trainings
   - Review documents

3. **Test User Features**:
   - Complete tasks
   - Start trainings
   - Upload documents
   - Check progress

---

## 🐛 Troubleshooting

### Backend Issues

**Issue**: Port 8080 already in use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

**Issue**: Database connection error
- Check H2 console: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:onboardingdb`

**Issue**: JWT token expired
- Token validity is 24 hours
- Login again to get new token

### Frontend Issues

**Issue**: Port 5173 already in use
```bash
# Kill process and restart
npm run dev -- --port 3000
```

**Issue**: CORS errors
- Check backend CORS configuration
- Ensure backend is running on port 8080

**Issue**: Google Sign-In not working
- Verify OAuth2 credentials in `application.properties`
- Check authorized redirect URIs in Google Console

### Common Issues

**Issue**: Blank screen after login
- Clear browser cache and localStorage
- Check browser console for errors

**Issue**: Documents not uploading
- Check file size (5KB - 20MB)
- Only PDF files supported
- Check `uploads/` directory permissions

---

## 📈 Future Enhancements

- [ ] Email notifications for task assignments
- [ ] Real-time notifications with WebSocket
- [ ] Dashboard analytics and charts
- [ ] Export onboarding reports (PDF/Excel)
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Integration with HRMS systems
- [ ] Video training support
- [ ] Calendar integration for onboarding schedule

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

- **OnboardIO Team** - Initial work

---

## 🙏 Acknowledgments

- Spring Boot team for excellent framework
- React team for amazing UI library
- TailwindCSS for utility-first CSS
- All contributors and testers

---

**Made with ❤️ by OnboardIO Team**

**Version**: 1.0.0  
**Last Updated**: January 21, 2026
