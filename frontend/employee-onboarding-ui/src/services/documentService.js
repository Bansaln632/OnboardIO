import api from '../api/axiosConfig';
import { API_ENDPOINTS } from '../constants';

/**
 * Document Service
 * Handles all document-related API calls
 */
export const documentService = {
  /**
   * Get documents for current user
   */
  getMyDocuments: () => {
    return api.get(API_ENDPOINTS.USER_DOCUMENTS);
  },

  /**
   * Upload a document
   * @param {number} documentTypeId
   * @param {File} file
   */
  uploadDocument: (documentTypeId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post(`${API_ENDPOINTS.USER_DOCUMENTS}/${documentTypeId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Replace a document
   * @param {number} userDocumentId
   * @param {File} file
   */
  replaceDocument: (userDocumentId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.put(`${API_ENDPOINTS.USER_DOCUMENTS}/${userDocumentId}/replace`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Download a document
   * @param {number} userDocumentId
   */
  downloadDocument: (userDocumentId) => {
    return api.get(`${API_ENDPOINTS.USER_DOCUMENTS}/${userDocumentId}/download`, {
      responseType: 'blob',
    });
  },

  /**
   * Get all documents (Admin only)
   */
  getAllDocuments: () => {
    return api.get(API_ENDPOINTS.ADMIN_DOCUMENTS);
  },

  /**
   * Create a new document type (Admin only)
   * @param {string} name
   * @param {string} type - MANDATORY or OPTIONAL
   */
  createDocument: (name, type) => {
    return api.post(API_ENDPOINTS.ADMIN_DOCUMENTS, null, {
      params: { name, type },
    });
  },

  /**
   * Get documents uploaded by a specific user (Admin only)
   * @param {number} userId
   */
  getUserDocuments: (userId) => {
    return api.get(`${API_ENDPOINTS.ADMIN_DOCUMENTS}/user/${userId}`);
  },

  /**
   * Approve a document (Admin only)
   * @param {number} userDocumentId
   */
  approveDocument: (userDocumentId) => {
    return api.put(`${API_ENDPOINTS.ADMIN_DOCUMENTS}/${userDocumentId}/approve`);
  },

  /**
   * Reject a document (Admin only)
   * @param {number} userDocumentId
   * @param {string} reason
   */
  rejectDocument: (userDocumentId, reason) => {
    return api.put(`${API_ENDPOINTS.ADMIN_DOCUMENTS}/${userDocumentId}/reject`, null, {
      params: { reason },
    });
  },

  /**
   * View/download a user's document (Admin only)
   * @param {number} userDocumentId
   */
  viewUserDocument: (userDocumentId) => {
    return api.get(`${API_ENDPOINTS.ADMIN_DOCUMENTS}/${userDocumentId}/view`, {
      responseType: 'blob',
    });
  },
};
