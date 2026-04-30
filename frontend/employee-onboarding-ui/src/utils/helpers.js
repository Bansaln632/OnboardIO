import { ERROR_MESSAGES, VALIDATION_PATTERNS } from '../constants';

/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - The error object from API call
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  const status = error.response.status;
  const message = error.response.data?.message || error.message;

  // Map common errors to user-friendly messages
  const errorMap = {
    400: () => {
      // Check for specific validation errors
      if (message?.toLowerCase().includes('email')) {
        return ERROR_MESSAGES.EMAIL_EXISTS;
      }
      return message || ERROR_MESSAGES.VALIDATION_ERROR;
    },
    401: () => ERROR_MESSAGES.INVALID_CREDENTIALS,
    403: () => ERROR_MESSAGES.UNAUTHORIZED,
    404: () => {
      if (message?.toLowerCase().includes('onboarding')) {
        return ERROR_MESSAGES.ONBOARDING_NOT_FOUND;
      }
      return ERROR_MESSAGES.USER_NOT_FOUND;
    },
    409: () => ERROR_MESSAGES.EMAIL_EXISTS,
    500: () => ERROR_MESSAGES.SERVER_ERROR,
    503: () => ERROR_MESSAGES.SERVER_ERROR,
  };

  return errorMap[status] ? errorMap[status]() : message || ERROR_MESSAGES.SERVER_ERROR;
};

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

/**
 * Validate password strength
 * Min 8 chars, 1 uppercase, 1 lowercase, 1 number
 * @param {string} password
 * @returns {boolean}
 */
export const validatePassword = (password) => {
  return VALIDATION_PATTERNS.PASSWORD.test(password);
};

/**
 * Validate phone number (10 digits)
 * @param {string} phone
 * @returns {boolean}
 */
export const validatePhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return VALIDATION_PATTERNS.PHONE.test(cleaned);
};

/**
 * Normalize phone number to 10 digits
 * @param {string} phone
 * @returns {string}
 */
export const normalizePhoneNumber = (phone) => {
  return phone.replace(/\D/g, '').slice(0, 10);
};

/**
 * Get password validation errors
 * @param {string} password
 * @returns {string[]} Array of error messages
 */
export const getPasswordErrors = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return errors;
};

/**
 * Format date to readable string
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date and time to readable string
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Ensure URL has proper protocol
 * @param {string} url
 * @returns {string}
 */
export const ensureUrlProtocol = (url) => {
  if (!url) return url;
  const trimmedUrl = url.trim();

  // Check if URL already has a protocol
  if (trimmedUrl.match(/^https?:\/\//i)) {
    return trimmedUrl;
  }

  // Add https:// by default
  return `https://${trimmedUrl}`;
};

/**
 * Ensure file URL is absolute
 * @param {string} fileUrl
 * @returns {string}
 */
export const ensureAbsoluteFileUrl = (fileUrl) => {
  if (!fileUrl) return fileUrl;
  const trimmedUrl = fileUrl.trim();

  // If already absolute URL, return as-is
  if (trimmedUrl.match(/^https?:\/\//i)) {
    return trimmedUrl;
  }

  // If relative URL, prepend backend base URL
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${backendUrl}${trimmedUrl.startsWith('/') ? trimmedUrl : '/' + trimmedUrl}`;
};

/**
 * Validate file size
 * @param {File} file
 * @param {number} minSize - Minimum size in bytes
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean}
 */
export const validateFileSize = (file, minSize = 5 * 1024, maxSize = 20 * 1024 * 1024) => {
  return file.size >= minSize && file.size <= maxSize;
};

/**
 * Format file size to readable string
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Truncate text to specified length
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
