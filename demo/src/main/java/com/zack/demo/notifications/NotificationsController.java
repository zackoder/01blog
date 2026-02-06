package com.zack.demo.notifications;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zack.demo.config.JwtService;
import com.zack.demo.user.User;
import com.zack.demo.user.UserService;

@RestController
@RequestMapping("/api")
public class NotificationsController {

    @Autowired
    private NotificationsRepo notificationsRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(@RequestHeader("authorization") String jwt) {
        String nickname = jwtService.extractUsername(jwt.substring(7));
        User user = userService.checkUser(nickname);
        List<NotificationDto> notifications = notificationsRepo.getNotifications(user.getId());
        return ResponseEntity.ok().body(notifications);
    }
}
