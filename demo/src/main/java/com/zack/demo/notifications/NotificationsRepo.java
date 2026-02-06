package com.zack.demo.notifications;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationsRepo extends JpaRepository<Notifications, Long> {
    @Query(value = """
            Select
                n.id,
                u.nickname,
                n.post_id,
                n.created_at
            from
                notifications n
            JOIN
                followers f
            ON
                f.follower_id = :follower_id
            AND
                f.followed_id = n.user_id
            JOIN
                users u
            ON
                u.id = n.user_id
            order by created_at desc;
            """, nativeQuery = true)
    List<NotificationDto> getNotifications(@Param("follower_id") Long userId);
}
