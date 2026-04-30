import api from '../api/axiosConfig';
import { API_ENDPOINTS } from '../constants';

/**
 * Task Service
 * Handles all task-related API calls
 */
export const taskService = {
  /**
   * Get tasks for current user
   */
  getMyTasks: () => {
    return api.get(API_ENDPOINTS.USER_TASKS);
  },

  /**
   * Mark a task as complete
   * @param {number} taskId
   */
  completeTask: (taskId) => {
    return api.put(`${API_ENDPOINTS.USER_TASKS}/${taskId}/complete`);
  },

  /**
   * Get all tasks (Admin only)
   */
  getAllTasks: () => {
    return api.get(API_ENDPOINTS.ADMIN_TASKS);
  },

  /**
   * Assign a task to a user (Admin only)
   * @param {number} userId
   * @param {string} title
   */
  assignTask: (userId, title) => {
    return api.post(`${API_ENDPOINTS.ADMIN_TASKS}/assign`, null, {
      params: { userId, title },
    });
  },

  /**
   * Delete a task (Admin only)
   * @param {number} taskId
   */
  deleteTask: (taskId) => {
    return api.delete(`${API_ENDPOINTS.ADMIN_TASKS}/${taskId}`);
  },
};
