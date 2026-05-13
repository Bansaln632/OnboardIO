package com.example.onboarding.service;

import com.example.onboarding.dto.NotificationDTO;
import com.example.onboarding.entity.Notification;
import com.example.onboarding.entity.Role;
import com.example.onboarding.entity.User;
import com.example.onboarding.repository.NotificationRepository;
import com.example.onboarding.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a notification for a user
     */
    @Transactional
    public Notification createNotification(User user, String message, Notification.NotificationType type,
                                          String relatedEntityType, Long relatedEntityId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedEntityType(relatedEntityType);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setIsRead(false);

        return notificationRepository.save(notification);
    }

    /**
     * Create a notification by user ID
     */
    @Transactional
    public Notification createNotification(Long userId, String message, Notification.NotificationType type,
                                          String relatedEntityType, Long relatedEntityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return createNotification(user, message, type, relatedEntityType, relatedEntityId);
    }

    /**
     * Get all notifications for a user
     */
    public List<NotificationDTO> getUserNotifications(User user) {
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        return notifications.stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Get recent 3 notifications for a user
     */
    public List<NotificationDTO> getRecentNotifications(User user) {
        List<Notification> notifications = notificationRepository.findTop3ByUserOrderByCreatedAtDesc(user);
        return notifications.stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Get unread notifications count
     */
    public Long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    /**
     * Mark notification as read
     */
    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    /**
     * Mark all notifications as read for a user
     */
    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unreadNotifications = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        unreadNotifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Delete a notification
     */
    @Transactional
    public void deleteNotification(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notificationRepository.delete(notification);
    }

    /**
     * Notify admins about user action
     */
    @Transactional
    public void notifyAdmins(String message, Notification.NotificationType type,
                            String relatedEntityType, Long relatedEntityId) {
        List<User> admins = userRepository.findByRole(Role.ROLE_ADMIN);
        for (User admin : admins) {
            createNotification(admin, message, type, relatedEntityType, relatedEntityId);
        }
    }
}
