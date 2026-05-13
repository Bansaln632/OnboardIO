import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { useToast } from '../context/ToastContext';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, READ
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAllNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      showError('Failed to load notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      showSuccess('Marked as read');
      // Dispatch event to update notification bell
      window.dispatchEvent(new CustomEvent('notificationUpdated'));
    } catch (err) {
      showError('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showSuccess('All notifications marked as read');
      // Dispatch event to update notification bell
      window.dispatchEvent(new CustomEvent('notificationUpdated'));
    } catch (err) {
      showError('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notification?')) return;

    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      showSuccess('Notification deleted');
      // Dispatch event to update notification bell
      window.dispatchEvent(new CustomEvent('notificationUpdated'));
    } catch (err) {
      showError('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      TASK_COMPLETED: { icon: '✅', color: 'from-green-500 to-emerald-500' },
      TRAINING_COMPLETED: { icon: '🎓', color: 'from-blue-500 to-cyan-500' },
      DOCUMENT_UPLOADED: { icon: '📄', color: 'from-yellow-500 to-orange-500' },
      DOCUMENT_APPROVED: { icon: '✓', color: 'from-green-500 to-emerald-500' },
      DOCUMENT_REJECTED: { icon: '❌', color: 'from-red-500 to-pink-500' },
      TASK_ASSIGNED: { icon: '📋', color: 'from-purple-500 to-pink-500' },
      TRAINING_ASSIGNED: { icon: '📚', color: 'from-indigo-500 to-purple-500' },
      HR_ASSIGNED: { icon: '👥', color: 'from-teal-500 to-cyan-500' },
      ONBOARDING_COMPLETED: { icon: '🎉', color: 'from-yellow-500 to-orange-500' },
      INFO: { icon: 'ℹ️', color: 'from-gray-500 to-gray-600' },
    };
    return icons[type] || { icon: '📢', color: 'from-blue-500 to-cyan-500' };
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'READ') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="spinner w-16 h-16 border-4 mx-auto"></div>
          <p className="text-xl text-gray-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl shadow-strong">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500"></div>
          <div className="relative p-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">🔔</span>
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold">Notifications</h1>
                  <p className="text-lg opacity-90 mt-1">
                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="btn btn-secondary text-sm"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card bg-white">
          <div className="flex gap-3">
            {['ALL', 'UNREAD', 'READ'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filter === f
                    ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'ALL' && `All (${notifications.length})`}
                {f === 'UNREAD' && `Unread (${unreadCount})`}
                {f === 'READ' && `Read (${notifications.length - unreadCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="card bg-white text-center py-16">
            <span className="text-6xl mb-4 block">📭</span>
            <p className="text-xl text-gray-600 font-medium">No notifications found</p>
            <p className="text-gray-500 mt-2">
              {filter === 'UNREAD' && 'You have no unread notifications'}
              {filter === 'READ' && 'You have no read notifications'}
              {filter === 'ALL' && 'You have no notifications yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => {
              const { icon, color } = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`card bg-white card-hover animate-fade-in ${
                    !notification.isRead ? 'border-l-4 border-primary-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}
                    >
                      <span className="text-3xl">{icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-base ${
                          !notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-500">{notification.timeAgo}</span>
                        {!notification.isRead && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
