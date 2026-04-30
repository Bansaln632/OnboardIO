import api from '../api/axiosConfig';
import { API_ENDPOINTS } from '../constants';

/**
 * Training Service
 * Handles all training-related API calls
 */
export const trainingService = {
  /**
   * Get trainings for current user
   */
  getMyTrainings: () => {
    return api.get(API_ENDPOINTS.USER_TRAININGS);
  },

  /**
   * Mark a training as complete
   * @param {number} trainingId
   */
  completeTraining: (trainingId) => {
    return api.put(`${API_ENDPOINTS.USER_TRAININGS}/${trainingId}/complete`);
  },

  /**
   * Start a training (mark as visited)
   * @param {number} trainingId
   */
  startTraining: (trainingId) => {
    return api.post(`${API_ENDPOINTS.USER_TRAININGS}/${trainingId}/visit`);
  },

  /**
   * Get all trainings (Admin only)
   */
  getAllTrainings: () => {
    return api.get(API_ENDPOINTS.ADMIN_TRAININGS);
  },

  /**
   * Assign a training to a user (Admin only)
   * @param {number} userId
   * @param {string} trainingName
   * @param {string} content - Training URL/link
   */
  assignTraining: (userId, trainingName, content) => {
    return api.post(`${API_ENDPOINTS.ADMIN_TRAININGS}/assign`, null, {
      params: { userId, trainingName, content },
    });
  },

  /**
   * Delete a training (Admin only)
   * @param {number} trainingId
   */
  deleteTraining: (trainingId) => {
    return api.delete(`${API_ENDPOINTS.ADMIN_TRAININGS}/${trainingId}`);
  },
};
