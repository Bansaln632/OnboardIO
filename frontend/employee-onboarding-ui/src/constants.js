// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',

  // Admin endpoints
  ADMIN_ONBOARDING: '/api/admin/onboarding',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_TASKS: '/api/admin/tasks',
  ADMIN_TRAININGS: '/api/admin/trainings',
  ADMIN_DOCUMENTS: '/api/admin/documents',

  // User endpoints
  USER_ONBOARDING: '/api/user/onboarding',
  USER_TASKS: '/api/user/tasks',
  USER_TRAININGS: '/api/user/trainings',
  USER_DOCUMENTS: '/api/user/documents',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
  HR: 'ROLE_HR',
};

// Document Status
export const DOCUMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

// Onboarding Status
export const ONBOARDING_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

// Document Types
export const DOCUMENT_TYPES = {
  MANDATORY: 'MANDATORY',
  OPTIONAL: 'OPTIONAL',
};

// Profile Types
export const PROFILE_TYPES = {
  REGULAR: 'REGULAR',
  HR: 'HR',
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  USER_NOT_FOUND: 'User not found',
  ONBOARDING_NOT_FOUND: 'Onboarding record not found',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to access this resource',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again',
  FILE_TOO_LARGE: 'File size must be less than 20MB',
  FILE_TOO_SMALL: 'File size must be greater than 5KB',
  INVALID_FILE_TYPE: 'Invalid file type',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  TASK_COMPLETED: 'Task marked as complete!',
  TRAINING_COMPLETED: 'Training marked as complete!',
  DOCUMENT_UPLOADED: 'Document uploaded successfully!',
  DOCUMENT_APPROVED: 'Document approved successfully!',
  DOCUMENT_REJECTED: 'Document rejected',
  HR_ASSIGNED: 'HR assigned successfully!',
  HR_UNASSIGNED: 'HR unassigned successfully!',
  TASK_ASSIGNED: 'Task assigned successfully!',
  TRAINING_ASSIGNED: 'Training assigned successfully!',
  DOCUMENT_CREATED: 'Document created successfully!',
  TASK_DELETED: 'Task deleted successfully!',
  TRAINING_DELETED: 'Training deleted successfully!',
};

// File Size Limits
export const FILE_LIMITS = {
  MIN_SIZE: 5 * 1024, // 5 KB
  MAX_SIZE: 20 * 1024 * 1024, // 20 MB
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  PHONE: /^\d{10}$/,
  EMPLOYEE_ID: /^EMP\d{3,}$/,
};

// Toast Duration
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

// App Configuration
export const APP_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'OnboardIO',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
};
