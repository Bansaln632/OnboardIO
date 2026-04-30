import api from '../api/axiosConfig';
import { API_ENDPOINTS } from '../constants';

/**
 * User Service
 * Handles user-related API calls
 */
export const userService = {
  /**
   * Get all users (Admin only)
   */
  getAllUsers: () => {
    return api.get(API_ENDPOINTS.ADMIN_USERS);
  },

  /**
   * Get current user profile
   */
  getProfile: () => {
    return api.get('/api/user/profile');
  },

  /**
   * Update user profile
   * @param {Object} data
   */
  updateProfile: (data) => {
    return api.put('/api/user/profile', data);
  },
};
