# 📊 SAMPLE DATA INITIALIZATION - COMPLETE

## ✅ Overview

The `DataInitializer` class has been enhanced to create comprehensive sample data for testing and demonstration purposes.

---

## 🎯 What's Included

### 1. **HR Personnel (2)**

| Name | Email | Password | Employee ID | Role | Profile |
|------|-------|----------|-------------|------|---------|
| Admin | admin@test.com | admin123 | HR-001 | ROLE_ADMIN | HR |
| Jane HR | hr.jane@test.com | hr123 | HR-002 | ROLE_ADMIN | HR |

### 2. **Regular Users (2)**

| Name | Email | Password | Employee ID | Assigned HR | Role | Profile |
|------|-------|----------|-------------|-------------|------|---------|
| John Doe | user@test.com | user123 | EMP-001 | Admin | ROLE_USER | REGULAR |
| Sarah Smith | sarah.smith@test.com | user123 | EMP-002 | Jane HR | ROLE_USER | REGULAR |

### 3. **Tasks Assigned**

#### Tasks for John Doe (4 tasks):
- ✅ Complete employee information form
- ✅ Review company policies and procedures
- ✅ Set up workstation and email account
- ✅ Meet with team members

#### Tasks for Sarah Smith (5 tasks):
- ✅ Read employee handbook
- ✅ Complete IT security training
- ✅ Schedule orientation meeting
- ✅ Submit emergency contact information
- ✅ Review benefits package

**All tasks are initially marked as NOT COMPLETED**

### 4. **Trainings Assigned**

#### Trainings for John Doe (2 trainings):
1. **Workplace Safety Training**
   - Link: https://www.osha.gov/training
   - Status: Not started, Not completed

2. **Data Privacy and Security**
   - Link: https://www.privacyshield.gov/
   - Status: Not started, Not completed

#### Trainings for Sarah Smith (3 trainings):
1. **Code of Conduct Training**
   - Link: https://www.ethics.org/
   - Status: Not started, Not completed

2. **Diversity and Inclusion**
   - Link: https://www.diversity.com/training
   - Status: Not started, Not completed

3. **Customer Service Excellence**
   - Link: https://www.customerservice.org/
   - Status: Not started, Not completed

### 5. **Documents to Upload (8 documents)**

#### Mandatory Documents (5):
- ✅ Government ID (Passport/Driver's License)
- ✅ Social Security Card
- ✅ Employment Contract (Signed)
- ✅ Direct Deposit Authorization Form
- ✅ Emergency Contact Form

#### Optional Documents (3):
- ✅ Educational Certificates
- ✅ Professional Certifications
- ✅ Previous Employment Letters

**These documents are global - all users need to upload them**

---

## 🔄 Onboarding Status

After initialization:

| User | Status | Progress | Assigned HR | Tasks | Trainings |
|------|--------|----------|-------------|-------|-----------|
| John Doe | NOT_STARTED | 0% | Admin | 4 | 2 |
| Sarah Smith | NOT_STARTED | 0% | Jane HR | 5 | 3 |

**Progress is automatically calculated based on:**
- Number of tasks completed
- Number of trainings completed
- Number of mandatory documents uploaded and approved

---

## 🚀 How to Use

### Starting the Application

1. **Start Backend:**
   ```bash
   cd H:\employee.onboarding\employeeOnBoarding\backend
   mvn spring-boot:run
   ```

2. **Watch the Console:**
   You'll see the initialization output:
   ```
   ========================================
   🚀 Starting DataInitializer...
   ========================================

   📋 Creating HR Personnel...
   ✅ Created HR Admin: admin@test.com (ID: HR-001)
   ✅ Created HR: hr.jane@test.com (ID: HR-002)

   👥 Creating Regular Users...
   ✅ Created User: John Doe (user@test.com)
      Assigned HR: Admin
   ✅ Created User: Sarah Smith (sarah.smith@test.com)
      Assigned HR: Jane HR

   📝 Creating Onboarding Records...
   ✅ Created Onboarding for: John Doe
   ✅ Created Onboarding for: Sarah Smith

   ✅ Creating Sample Tasks...
   ✅ Created 4 tasks for: John Doe
   ✅ Created 5 tasks for: Sarah Smith

   🎓 Creating Sample Trainings...
   ✅ Created 2 trainings for: John Doe
   ✅ Created 3 trainings for: Sarah Smith

   📄 Creating Sample Documents to Upload...
   ✅ Created 5 mandatory documents
   ✅ Created 3 optional documents

   🔄 Recalculating Onboarding Progress...
   ✅ John Doe - Status: NOT_STARTED, Progress: 0%
   ✅ Sarah Smith - Status: NOT_STARTED, Progress: 0%

   ========================================
   ✅ DataInitializer Complete!
   ========================================
   📊 Summary:
      • HR Personnel: 2
      • Regular Users: 2
      • Tasks: 9
      • Trainings: 5
      • Documents: 8
   ========================================

   🔐 Login Credentials:
      Admin HR:
         Email: admin@test.com
         Password: admin123
      HR Jane:
         Email: hr.jane@test.com
         Password: hr123
      User John:
         Email: user@test.com
         Password: user123
      User Sarah:
         Email: sarah.smith@test.com
         Password: user123
   ========================================
   ```

3. **Start Frontend:**
   ```bash
   cd H:\employee.onboarding\employeeOnBoarding\frontend\employee-onboarding-ui
   npm run dev
   ```

---

## 🧪 Testing Scenarios

### Scenario 1: Admin View

**Login as:** admin@test.com / admin123

**What you'll see:**
1. **Admin Dashboard:**
   - Employee Onboardings section
   - John Doe - Status: NOT_STARTED, Progress: 0%
   - Sarah Smith - Status: NOT_STARTED, Progress: 0%

2. **Activities > Tasks & Trainings:**
   - Can assign new tasks to users
   - Can create new trainings for users
   - See all assigned tasks and trainings

3. **Activities > HR Assignment:**
   - Can assign/unassign HR to employees
   - View assignment history

4. **Activities > Document Templates:**
   - See 8 document templates
   - 5 marked as MANDATORY
   - 3 marked as OPTIONAL

5. **Activities > Document Review:**
   - Review documents uploaded by users
   - Approve/Reject documents

### Scenario 2: User View (John Doe)

**Login as:** user@test.com / user123

**What you'll see:**
1. **User Dashboard:**
   - Welcome, John Doe!
   - Employee ID: EMP-001
   - Status: NOT_STARTED
   - Progress: 0%
   - Assigned HR: Admin

2. **Activities > My Tasks (4 tasks):**
   - Complete employee information form [Mark as Complete]
   - Review company policies and procedures [Mark as Complete]
   - Set up workstation and email account [Mark as Complete]
   - Meet with team members [Mark as Complete]

3. **Activities > My Trainings (2 trainings):**
   - Workplace Safety Training [Start Training →]
   - Data Privacy and Security [Start Training →]

4. **Activities > Upload Documents (8 documents):**
   - Government ID (Passport/Driver's License) [MANDATORY] [Upload]
   - Social Security Card [MANDATORY] [Upload]
   - Employment Contract (Signed) [MANDATORY] [Upload]
   - Direct Deposit Authorization Form [MANDATORY] [Upload]
   - Emergency Contact Form [MANDATORY] [Upload]
   - Educational Certificates [OPTIONAL] [Upload]
   - Professional Certifications [OPTIONAL] [Upload]
   - Previous Employment Letters [OPTIONAL] [Upload]

### Scenario 3: User View (Sarah Smith)

**Login as:** sarah.smith@test.com / user123

**What you'll see:**
1. **User Dashboard:**
   - Welcome, Sarah Smith!
   - Employee ID: EMP-002
   - Status: NOT_STARTED
   - Progress: 0%
   - Assigned HR: Jane HR

2. **Activities > My Tasks (5 tasks):**
   - Read employee handbook [Mark as Complete]
   - Complete IT security training [Mark as Complete]
   - Schedule orientation meeting [Mark as Complete]
   - Submit emergency contact information [Mark as Complete]
   - Review benefits package [Mark as Complete]

3. **Activities > My Trainings (3 trainings):**
   - Code of Conduct Training [Start Training →]
   - Diversity and Inclusion [Start Training →]
   - Customer Service Excellence [Start Training →]

4. **Activities > Upload Documents (8 documents):**
   - Same 8 documents as John Doe

### Scenario 4: HR Jane View

**Login as:** hr.jane@test.com / hr123

**What you'll see:**
1. **Admin Dashboard:**
   - Employee Onboardings section
   - Sarah Smith (assigned to Jane HR) visible
   - Can manage Sarah's onboarding

2. **Activities:**
   - Same admin features as Admin HR

---

## 📈 Testing Progress Calculation

### Test 1: Complete Tasks

1. Login as **user@test.com**
2. Go to **Activities > My Tasks**
3. Mark 2 tasks as complete
4. Check Dashboard
5. **Expected:** Progress increases

**Calculation:**
- Total activities: 4 tasks + 2 trainings + 5 mandatory docs = 11
- Completed: 2 tasks
- Progress: 2/11 ≈ 18%

### Test 2: Complete Training

1. Login as **user@test.com**
2. Go to **Activities > My Trainings**
3. Click "Start Training" on a training
4. Training link opens in new tab
5. Return to previous tab
6. Check Dashboard
7. **Expected:** Training marked as completed, progress increases

**Calculation:**
- Total activities: 11
- Completed: 2 tasks + 1 training = 3
- Progress: 3/11 ≈ 27%

### Test 3: Upload & Approve Documents

1. Login as **user@test.com**
2. Go to **Activities > Upload Documents**
3. Upload a mandatory document (PDF, 5KB-20MB)
4. Logout
5. Login as **admin@test.com**
6. Go to **Activities > Document Review**
7. Select John Doe
8. Approve the uploaded document
9. Logout
10. Login as **user@test.com**
11. Check Dashboard
12. **Expected:** Progress increases

**Calculation:**
- Total activities: 11
- Completed: 2 tasks + 1 training + 1 doc = 4
- Progress: 4/11 ≈ 36%

### Test 4: Complete Everything

1. Complete all 4 tasks
2. Complete all 2 trainings
3. Upload all 5 mandatory documents
4. Admin approves all documents
5. **Expected:** Progress: 100%, Status: COMPLETED

---

## 🔧 Customization

### Adding More Sample Data

Edit `DataInitializer.java` and add:

**More Users:**
```java
User user3 = new User();
user3.setUsername("Mike Johnson");
user3.setEmail("mike.johnson@test.com");
user3.setPassword(encoder.encode("user123"));
user3.setRole(Role.ROLE_USER);
user3.setProfile(Profile.REGULAR);
user3.setContactNo("+1-555-1003");
user3.setEmployeeId("EMP-003");
user3.setAssignedHr(admin);
userRepository.save(user3);
```

**More Tasks:**
```java
Task task = new Task();
task.setTitle("New Task Title");
task.setEmployee(user1);
task.setCompleted(false);
taskRepository.save(task);
```

**More Trainings:**
```java
Training training = new Training();
training.setName("New Training");
training.setContent("https://example.com/training");
training.setEmployee(user1);
training.setCompleted(false);
training.setStarted(false);
trainingRepository.save(training);
```

**More Documents:**
```java
Document doc = new Document();
doc.setName("New Document Name");
doc.setDocumentType(Document.DocumentType.MANDATORY);
documentRepository.save(doc);
```

---

## 🗄️ Database Verification

### H2 Console

1. Open: http://localhost:8080/h2-console
2. **JDBC URL:** `jdbc:h2:mem:onboardingdb`
3. **Username:** `sa`
4. **Password:** (blank)
5. Click "Connect"

### Verify Sample Data

**Check Users:**
```sql
SELECT * FROM USERS ORDER BY EMPLOYEE_ID;
```
**Expected:** 4 users (2 HR, 2 regular users)

**Check Onboardings:**
```sql
SELECT o.*, u.username, u.employee_id 
FROM ONBOARDING o 
JOIN USERS u ON o.employee_id = u.id;
```
**Expected:** 2 onboarding records

**Check Tasks:**
```sql
SELECT t.*, u.username 
FROM TASK t 
JOIN USERS u ON t.employee_id = u.id;
```
**Expected:** 9 tasks (4 for John, 5 for Sarah)

**Check Trainings:**
```sql
SELECT t.*, u.username 
FROM TRAINING t 
JOIN USERS u ON t.employee_id = u.id;
```
**Expected:** 5 trainings (2 for John, 3 for Sarah)

**Check Documents:**
```sql
SELECT * FROM DOCUMENT;
```
**Expected:** 8 documents (5 mandatory, 3 optional)

---

## 🎯 Benefits of Sample Data

### For Development:
- ✅ Instant test environment
- ✅ No manual data entry needed
- ✅ Consistent test scenarios
- ✅ Easy to reset (restart app)

### For Testing:
- ✅ Multiple user types
- ✅ Different task/training counts
- ✅ HR assignment scenarios
- ✅ Progress calculation testing

### For Demo:
- ✅ Professional-looking data
- ✅ Real-world scenarios
- ✅ Complete workflows
- ✅ Impressive presentation

---

## 🔄 Resetting Data

**To reset all sample data:**
1. Stop the application
2. Restart the application
3. DataInitializer runs again
4. **Note:** H2 in-memory database resets on restart

**For persistent data:**
- Change to file-based H2 or PostgreSQL
- DataInitializer will NOT create duplicates (checks for existing data)

---

## 📋 Summary

### Sample Data Created:

| Category | Count | Details |
|----------|-------|---------|
| **HR Personnel** | 2 | Admin, Jane HR |
| **Regular Users** | 2 | John Doe, Sarah Smith |
| **Onboarding Records** | 2 | One per user |
| **Tasks** | 9 | 4 for John, 5 for Sarah |
| **Trainings** | 5 | 2 for John, 3 for Sarah |
| **Document Templates** | 8 | 5 mandatory, 3 optional |

### Login Credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin HR | admin@test.com | admin123 |
| HR | hr.jane@test.com | hr123 |
| User | user@test.com | user123 |
| User | sarah.smith@test.com | user123 |

---

## ✅ Status: COMPLETE

**DataInitializer is ready to use!**

**Next Steps:**
1. Start backend server
2. Watch initialization logs
3. Start frontend
4. Login and test!

---

**Created:** January 21, 2026  
**Version:** 1.0  
**Status:** Production Ready ✅
