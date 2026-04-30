import { useState, useCallback, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useToast } from '../context/ToastContext';
import { handleApiError } from '../utils/helpers';
import { SUCCESS_MESSAGES } from '../constants';

/**
 * Custom hook for managing tasks
 * @param {boolean} isAdmin - Whether the user is an admin
 * @returns {Object} Task data and operations
 */
export const useTasks = (isAdmin = false) => {
  const { showSuccess, showError } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch tasks
   */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = isAdmin
        ? await taskService.getAllTasks()
        : await taskService.getMyTasks();
      setTasks(response.data || []);
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, showError]);

  /**
   * Complete a task
   * @param {number} taskId
   */
  const completeTask = useCallback(async (taskId) => {
    try {
      await taskService.completeTask(taskId);
      showSuccess(SUCCESS_MESSAGES.TASK_COMPLETED);
      await fetchTasks();
    } catch (err) {
      const message = handleApiError(err);
      showError(message);
    }
  }, [fetchTasks, showSuccess, showError]);

  /**
   * Assign a task to a user (Admin only)
   * @param {number} userId
   * @param {string} title
   */
  const assignTask = useCallback(async (userId, title) => {
    try {
      await taskService.assignTask(userId, title);
      showSuccess(SUCCESS_MESSAGES.TASK_ASSIGNED);
      await fetchTasks();
    } catch (err) {
      const message = handleApiError(err);
      showError(message);
    }
  }, [fetchTasks, showSuccess, showError]);

  /**
   * Delete a task (Admin only)
   * @param {number} taskId
   */
  const deleteTask = useCallback(async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      showSuccess(SUCCESS_MESSAGES.TASK_DELETED);
      await fetchTasks();
    } catch (err) {
      const message = handleApiError(err);
      showError(message);
    }
  }, [fetchTasks, showSuccess, showError]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    completeTask,
    assignTask,
    deleteTask,
  };
};
