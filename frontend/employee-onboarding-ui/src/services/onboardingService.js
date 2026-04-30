import api from '../api/axiosConfig';
import { API_ENDPOINTS } from '../constants';

/**
 * Onboarding Service
 * Handles all onboarding-related API calls
 */
export const onboardingService = {
  /**
   * Get current user's onboarding status
   */
  getMyOnboarding: () => {
    return api.get(API_ENDPOINTS.USER_ONBOARDING);
  },

  /**
   * Get all onboardings (Admin only)
   */
  getAllOnboardings: () => {
    return api.get(API_ENDPOINTS.ADMIN_ONBOARDING);
  },

  /**
   * Get HR users list (Admin only)
   */
  getHRUsers: () => {
    return api.get(`${API_ENDPOINTS.ADMIN_ONBOARDING}/users`);
  },

  /**
   * Assign HR to an employee (Admin only)
   * @param {number} onboardingId
   * @param {number} hrId
   * @param {string} performedBy
   */
  assignHR: (onboardingId, hrId, performedBy = 'admin_ui') => {
    return api.put(`${API_ENDPOINTS.ADMIN_ONBOARDING}/${onboardingId}/assign-hr`, null, {
      params: { hrId, performedBy },
    });
  },

  /**
   * Unassign HR from an employee (Admin only)
   * @param {number} onboardingId
   * @param {string} performedBy
   */
  unassignHR: (onboardingId, performedBy = 'admin_ui') => {
    return api.put(`${API_ENDPOINTS.ADMIN_ONBOARDING}/${onboardingId}/unassign-hr`, null, {
      params: { performedBy },
    });
  },

  /**
   * Get HR assignment history (Admin only)
   * @param {number} onboardingId
   */
  getAssignmentHistory: (onboardingId) => {
    return api.get(`${API_ENDPOINTS.ADMIN_ONBOARDING}/${onboardingId}/history`);
  },
};
