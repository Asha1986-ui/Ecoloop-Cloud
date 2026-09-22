package com.ecoloop.service;

import com.ecoloop.dto.NotificationResponse;
import com.ecoloop.entity.User;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getUserNotifications(String userEmail);
    void markAsRead(Long notificationId, String userEmail);
    void sendNotification(User user, String title, String message, String type);
}
