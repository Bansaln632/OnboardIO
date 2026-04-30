# ⚛️ OnboardIO Frontend - Technical Documentation

> React frontend application for the OnboardIO employee onboarding platform

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Key Libraries & Concepts](#key-libraries--concepts)
- [State Management](#state-management)
- [Routing](#routing)
- [Authentication Flow](#authentication-flow)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Components](#components)
- [Running the Application](#running-the-application)

---

## 🎯 Overview

The OnboardIO frontend is a modern **React 19.2.0** single-page application (SPA) that provides:
- Responsive, intuitive user interface
- Role-based dashboards (Admin/User)
- Real-time progress tracking
- Document upload with validation
- Task and training management
- Google Sign-In integration

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI library |
| **Vite** | 7.2.4 | Build tool & dev server |
| **React Router DOM** | 7.12.0 | Client-side routing |
| **Axios** | 1.13.2 | HTTP client for API calls |
| **Tailwind CSS** | 4.1.18 | Utility-first CSS framework |
| **PostCSS** | 9.0.1 | CSS processor |
| **JavaScript** | ES6+ | Programming language |
| **npm** | 10.8.2+ | Package manager |

---

## 🏗️ Architecture

### Component Hierarchy

```
App.jsx (Root)
├── Navbar (Always visible)
│   ├── Logo
│   ├── Navigation Links (Dashboard, Activities, About)
│   └── User Menu (Profile, Logout)
│
├── Routes (React Router)
│   ├── / (Home)
│   │   ├── Login Tab
│   │   └── Signup Tab
│   │
│   ├── /oauth2/redirect (OAuth2 callback)
│   │
│   ├── /admin (Protected - ROLE_ADMIN)
│   │   └── AdminDashboardSimple
│   │       ├── Employee Onboardings List
│   │       └── HR Assignment UI
│   │
│   ├── /user (Protected - ROLE_USER)
│   │   └── UserDashboardSimple
│   │       ├── Onboarding Status
│   │       ├── Progress Bar
│   │       └── Assigned HR Info
│   │
│   ├── /activities (Protected - Any role)
│   │   └── ActivitiesSimple
│   │       ├── Tasks Section
│   │       ├── Trainings Section
│   │       ├── Documents Section
│   │       ├── HR Assignment (Admin only)
│   │       └── Document Review (Admin only)
│   │
│   └── /about (Public)
│       └── AboutUs
│
└── ToastContext (Global notifications)
```

### Data Flow

```
┌──────────────────────────────────────────────────────────┐
│                      User Action                         │
│         (Click button, submit form, etc.)                │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                  Component Event Handler                 │
│         (onClick, onSubmit, onChange, etc.)              │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                   Service Layer Call                     │
│    (taskService.js, trainingService.js, etc.)           │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Axios HTTP Request                          │
│     (GET, POST, PUT, DELETE with JWT token)             │
│     Authorization: Bearer <token>                        │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
        Backend API (http://localhost:8080)
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                  Response Handler                        │
│         (.then() for success, .catch() for errors)       │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                State Update (useState)                   │
│         setData(response.data)                           │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                  React Re-render                         │
│            (UI updates with new data)                    │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
frontend/employee-onboarding-ui/
├── public/
│   └── vite.svg                     # Favicon
│
├── src/
│   │
│   ├── admin/                       # Admin Components
│   │   └── AdminDashboardSimple.jsx # Admin dashboard
│   │
│   ├── api/                         # API Configuration
│   │   └── axiosConfig.js           # Axios instance with interceptors
│   │
│   ├── auth/                        # Authentication
│   │   ├── Login.jsx                # Login form
│   │   ├── Signup.jsx               # Signup form
│   │   ├── GoogleSignInButton.jsx   # Google Sign-In button
│   │   ├── OAuth2Redirect.jsx       # OAuth2 callback handler
│   │   └── authService.js           # Auth helper functions
│   │
│   ├── components/                  # Reusable Components
│   │   ├── Navbar.jsx               # Top navigation bar
│   │   └── ProtectedRoute.jsx       # Route guard component
│   │
│   ├── context/                     # React Context
│   │   └── ToastContext.jsx         # Toast notification provider
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useTasks.js              # Task management hook
│   │   └── useTrainings.js          # Training management hook
│   │
│   ├── pages/                       # Page Components
│   │   ├── ActivitiesSimple.jsx     # Activities page
│   │   └── AboutUs.jsx              # About page
│   │
│   ├── services/                    # API Service Layer
│   │   ├── taskService.js           # Task API calls
│   │   ├── trainingService.js       # Training API calls
│   │   ├── documentService.js       # Document API calls
│   │   ├── onboardingService.js     # Onboarding API calls
│   │   └── userService.js           # User API calls
│   │
│   ├── styles/                      # Global Styles
│   │   └── app.css                  # Main CSS file (Tailwind)
│   │
│   ├── user/                        # User Components
│   │   └── UserDashboardSimple.jsx  # User dashboard
│   │
│   ├── utils/                       # Utility Functions
│   │   └── (various helpers)
│   │
│   ├── App.jsx                      # Root component
│   ├── main.jsx                     # Entry point
│   ├── constants.js                 # API endpoints constants
│   ├── Home.jsx                     # Home/Landing page
│   └── index.css                    # Global CSS imports
│
├── .env.example                     # Environment variables template
├── .env.local                       # Local environment variables
├── .gitignore                       # Git ignore rules
├── index.html                       # HTML template
├── package.json                     # npm dependencies
├── postcss.config.js                # PostCSS configuration
├── vite.config.js                   # Vite configuration
└── README.md                        # This file
```

---

## 🔑 Key Libraries & Concepts

### 1. React 19.2.0

**Key Features Used**:
- **Functional Components**: All components use function syntax
- **Hooks**: useState, useEffect, useContext, useNavigate, useLocation
- **JSX**: JavaScript XML for component rendering
- **Props**: Component data passing
- **Conditional Rendering**: Dynamic UI based on state

**Example**:
```jsx
import { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  return <div>{data.map(item => <div key={item.id}>{item.name}</div>)}</div>;
}
```

### 2. Vite 7.2.4

**Why Vite?**
- ⚡ Lightning-fast dev server startup
- 🔥 Hot Module Replacement (HMR)
- 📦 Optimized production builds
- 🎯 ES modules support
- 🔧 Simple configuration

**Configuration** (`vite.config.js`):
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});
```

**Commands**:
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build

### 3. React Router DOM 7.12.0

**Routing Strategy**: Client-side routing (SPA)

**Key Concepts**:
- **Routes**: Define URL to component mapping
- **Navigate**: Programmatic navigation
- **ProtectedRoute**: Custom route guard
- **useLocation**: Access current route
- **useNavigate**: Trigger navigation

**Example**:
```jsx
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute role="ROLE_ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

**Route Protection**:
```jsx
// ProtectedRoute.jsx
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = getRoleFromToken();
  
  if (!token) return <Navigate to="/" />;
  if (role && userRole !== role) return <Navigate to="/" />;
  
  return children;
}
```

### 4. Axios 1.13.2

**Purpose**: HTTP client for API communication

**Why Axios over Fetch?**
- ✅ Automatic JSON transformation
- ✅ Request/response interceptors
- ✅ Better error handling
- ✅ Request cancellation
- ✅ Progress tracking

**Configuration** (`axiosConfig.js`):
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Usage**:
```javascript
import api from './api/axiosConfig';

// GET request
const response = await api.get('/api/user/tasks');

// POST request
const response = await api.post('/api/admin/task', taskData);

// PUT request
const response = await api.put(`/api/user/task/${id}`, updates);

// DELETE request
const response = await api.delete(`/api/admin/task/${id}`);
```

### 5. Tailwind CSS 4.1.18

**Why Tailwind?**
- 🎨 Utility-first approach
- 📱 Built-in responsive design
- 🎯 No CSS file bloat
- ⚡ Fast development
- 🔧 Highly customizable

**Configuration** (`app.css`):
```css
@import "tailwindcss";

/* Custom utilities */
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}

.btn-primary {
  @apply bg-primary-500 text-white hover:bg-primary-600;
}

.form-input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg;
}
```

**Usage**:
```jsx
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  Click Me
</button>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

---

## 🔄 State Management

### React Hooks (useState, useEffect)

**Local Component State**:
```jsx
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await taskService.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {tasks.map(task => <TaskItem key={task.id} task={task} />)}
    </>
  );
}
```

### Context API (ToastContext)

**Global Toast Notifications**:
```jsx
// ToastContext.jsx
const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  
  const showSuccess = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type: 'success' }]);
    setTimeout(() => removeToast(id), 3000);
  };
  
  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

// Usage in components
function MyComponent() {
  const { showSuccess, showError } = useToast();
  
  const handleSubmit = async () => {
    try {
      await api.post('/endpoint', data);
      showSuccess('Success!');
    } catch (err) {
      showError('Failed!');
    }
  };
}
```

### localStorage (Token Management)

**JWT Token Storage**:
```javascript
// Store token
localStorage.setItem('token', jwtToken);

// Retrieve token
const token = localStorage.getItem('token');

// Remove token (logout)
localStorage.removeItem('token');

// Decode token to get user info
const payload = JSON.parse(atob(token.split('.')[1]));
const email = payload.sub;
const role = payload.role;
```

---

## 🧭 Routing

### Route Structure

```jsx
// App.jsx
<Routes>
  {/* Public routes */}
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<AboutUs />} />
  <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
  
  {/* Protected routes - Admin */}
  <Route 
    path="/admin" 
    element={
      <ProtectedRoute role="ROLE_ADMIN">
        <AdminDashboardSimple />
      </ProtectedRoute>
    } 
  />
  
  {/* Protected routes - User */}
  <Route 
    path="/user" 
    element={
      <ProtectedRoute role="ROLE_USER">
        <UserDashboardSimple />
      </ProtectedRoute>
    } 
  />
  
  {/* Protected routes - Any authenticated user */}
  <Route 
    path="/activities" 
    element={
      <ProtectedRoute>
        <ActivitiesSimple />
      </ProtectedRoute>
    } 
  />
  
  {/* Catch-all redirect */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
```

### Navigation

**Programmatic Navigation**:
```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const goToAdmin = () => navigate('/admin');
  const goBack = () => navigate(-1);
  const goWithReplace = () => navigate('/user', { replace: true });
}
```

**Link Navigation**:
```jsx
import { Link } from 'react-router-dom';

<Link to="/about">About Us</Link>
```

---

## 🔐 Authentication Flow

### 1. Traditional Login

```jsx
// Login.jsx
const handleLogin = async () => {
  try {
    const response = await login({ email, password });
    // Token automatically stored by authService
    const role = getRoleFromToken();
    navigate(role === 'ROLE_ADMIN' ? '/admin' : '/user');
  } catch (error) {
    setError('Invalid credentials');
  }
};
```

### 2. Google Sign-In

```jsx
// GoogleSignInButton.jsx
const handleGoogleSignIn = () => {
  // Redirect to backend OAuth2 endpoint
  window.location.href = 'http://localhost:8080/oauth2/authorization/google';
};

// OAuth2Redirect.jsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  
  if (token) {
    localStorage.setItem('token', token);
    const role = getRoleFromToken();
    navigate(role === 'ROLE_ADMIN' ? '/admin' : '/user');
  }
}, []);
```

### 3. Token Management

```javascript
// authService.js

// Login
export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  localStorage.setItem('token', response.data);
  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
};

// Get user role from token
export const getRoleFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.role;
};

// Check if authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
```

---

## 🌐 API Integration

### Service Layer Pattern

**Structure**:
```
services/
├── taskService.js
├── trainingService.js
├── documentService.js
├── onboardingService.js
└── userService.js
```

**Example** (`taskService.js`):
```javascript
import api from '../api/axiosConfig';

export const taskService = {
  // Get all tasks for current user
  getTasks: () => api.get('/api/user/task'),
  
  // Mark task as complete
  completeTask: (id) => api.put(`/api/user/task/${id}`),
  
  // Admin: Create task for user
  createTask: (taskData) => api.post('/api/admin/task', taskData),
  
  // Admin: Delete task
  deleteTask: (id) => api.delete(`/api/admin/task/${id}`)
};
```

**Usage in Components**:
```jsx
import { taskService } from '../services/taskService';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = async () => {
    try {
      const response = await taskService.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };
  
  const handleComplete = async (id) => {
    try {
      await taskService.completeTask(id);
      loadTasks(); // Refresh list
    } catch (error) {
      console.error('Failed to complete task', error);
    }
  };
}
```

---

## 🎨 Styling

### Tailwind Utility Classes

**Common Patterns**:
```jsx
// Button
<button className="btn btn-primary">Submit</button>

// Form input
<input className="form-input" type="text" />

// Card
<div className="bg-white rounded-lg shadow-md p-6">
  Card content
</div>

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Item key={item.id} />)}
</div>

// Flex layout
<div className="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>
```

### Responsive Design

```jsx
// Mobile-first approach
<div className="
  w-full           // Default: full width
  md:w-1/2         // Medium screens: half width
  lg:w-1/3         // Large screens: third width
  px-4             // Default: 1rem padding
  md:px-6          // Medium: 1.5rem padding
  lg:px-8          // Large: 2rem padding
">
  Responsive content
</div>
```

---

## 🚀 Running the Application

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Access application
# Open http://localhost:5173
```

### Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy dist/ folder to hosting
```

### Environment Variables

Create `.env.local`:
```
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=OnboardIO
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 📦 Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.12.0",
    "axios": "^1.13.2",
    "tailwindcss": "^4.1.18"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^7.2.4",
    "postcss": "^9.0.1"
  }
}
```

---

## 🎯 Key Features Implementation

### 1. Protected Routes

Prevent unauthorized access to admin/user pages.

### 2. Axios Interceptors

Automatically add JWT token to requests.

### 3. Toast Notifications

Global notification system using Context API.

### 4. Form Validation

Client-side validation before API calls.

### 5. Error Handling

Catch API errors and show user-friendly messages.

---

## 📞 Support

For frontend-specific issues:
- Check browser console for errors
- Verify API endpoints in `constants.js`
- Check network tab for API responses

---

**Frontend Version**: 1.0.0  
**Last Updated**: January 21, 2026

