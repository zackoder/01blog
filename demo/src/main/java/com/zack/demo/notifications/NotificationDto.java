package com.zack.demo.notifications;

public record NotificationDto(
                long id,
                String nickname,
                long postId,
                long createdAt) {
}
