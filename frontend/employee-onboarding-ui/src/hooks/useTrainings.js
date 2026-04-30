import { useState, useCallback, useEffect } from 'react';
import { trainingService } from '../services/trainingService';
import { useToast } from '../context/ToastContext';
import { handleApiError } from '../utils/helpers';
import { SUCCESS_MESSAGES } from '../constants';

/**
 * Custom hook for managing trainings
 * @param {boolean} isAdmin - Whether the user is an admin
 * @returns {Object} Training data and operations
 */
export const useTrainings = (isAdmin = false) => {
  const { showSuccess, showError } = useToast();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch trainings
   */
  const fetchTrainings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = isAdmin
        ? await trainingService.getAllTrainings()
        : await trainingService.getMyTrainings();
      setTrainings(response.data || []);
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, showError]);

  /**
   * Complete a training
   * @param {number} trainingId
   */
  const completeTraining = useCallback(async (trainingId) => {
    try {
      await trainingService.completeTraining(trainingId);
      showSuccess(SUCCESS_MESSAGES.TRAINING_COMPLETED);
      await fetchTrainings();
    } catch (err) {
      const message = handleApiError(err);
      showError(message);
    }
  }, [fetchTrainings, showSuccess, showError]);

  /**
   * Start a training (mark as visited)
   * @param {number} trainingId
   */
  const startTraining = useCallback(async (trainingId) => {
    try {
      await trainingService.startTraining(trainingId);
      showSuccess('Training started!');
      await fetchTrainings();
    } catch (err) {
      const message = handleApiError(err);
      showError(message);
    }
  }, [fetchTrainings, showSuccess, showError]);

  /**
   * Assign a training to a user (Admin only)
   * @param {number} userId
   * @param {string} trainingName
   * @param {string} content
   */
  const assignTraining = useCallback(async (userId, trainingName, content) => {
    try {
      await trainingService.assignTraining(userId, trainingName, content);
      showSuccess(SUCCESS_MESSAGES.TRAINING_ASSIGNED);
      await fetchTrainings();
    } catch (err) {
      const message = handleApiError(err);
      showError(message);
    }
  }, [fetchTrainings, showSuccess, showError]);

  /**
   * Delete a training (Admin only)
   * @param {number} trainingId
   */
  const deleteTraining = useCallback(async (trainingId) => {
    try {
      await trainingService.deleteTraining(trainingId);
      showSuccess(SUCCESS_MESSAGES.TRAINING_DELETED);
      await fetchTrainings();
    } catch (err) {
      const message = handleApiError(err);
      showError(message);
    }
  }, [fetchTrainings, showSuccess, showError]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  return {
    trainings,
    loading,
    error,
    fetchTrainings,
    completeTraining,
    startTraining,
    assignTraining,
    deleteTraining,
  };
};
