package com.zack.demo.auth;

import com.zack.demo.config.JwtService;
import com.zack.demo.config.SecurityConfig;
import com.zack.demo.user.BanUserEntity;
import com.zack.demo.user.BanedUserRepo;
import com.zack.demo.user.User;
import com.zack.demo.user.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.NotFoundException;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BanedUserRepo banedUserRepo;

    @Autowired
    private SecurityConfig securityConfig;

    public LoginController(UserRepository userRepository, JwtService jwtService, BanedUserRepo banedUserRepo) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.banedUserRepo = banedUserRepo;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginRequestDto loginRequest) {

        User user = userRepository.findByEmail(loginRequest.email())
                .or(() -> userRepository.findByNickname(loginRequest.email()))
                .orElseThrow(() -> new NotFoundException("user not found"));

        BanUserEntity banned = banedUserRepo.findByUserId(user.getId());

        Date now = new Date();
        if (banned != null) {
            if (now.before(banned.getExpiresAt())) {
                System.out.println();
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "you have been banned", "duration",
                                (now.getTime() - banned.getExpiresAt().getTime())));
            }
        }

        if (!securityConfig.passwordEncoder().matches(loginRequest.password(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Incorrect password"));
        }

        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(Map.of("token", token));
    }
}
