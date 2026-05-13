import api from '../api/axiosConfig';

export const notificationService = {
  // Get all notifications
  getAllNotifications: () => api.get('/api/notifications'),

  // Get recent 3 notifications for navbar
  getRecentNotifications: () => api.get('/api/notifications/recent'),

  // Get unread count
  getUnreadCount: () => api.get('/api/notifications/unread-count'),

  // Mark notification as read
  markAsRead: (id) => api.put(`/api/notifications/${id}/read`),

  // Mark all as read
  markAllAsRead: () => api.put('/api/notifications/mark-all-read'),

  // Delete notification
  deleteNotification: (id) => api.delete(`/api/notifications/${id}`),
};
