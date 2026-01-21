package com.zack.demo.auth;

import com.zack.demo.config.JwtService;
import com.zack.demo.user.BanUserEntity;
import com.zack.demo.user.BanedUserRepo;
import com.zack.demo.user.User;
import com.zack.demo.user.UserRepository;
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

    public LoginController(UserRepository userRepository, JwtService jwtService, BanedUserRepo banedUserRepo) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.banedUserRepo = banedUserRepo;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginRequestDto loginRequest) {
        Map<String, Object> response = new HashMap<>();

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .or(() -> userRepository.findByNickname(loginRequest.getEmail()))
                .orElseThrow(() -> new NotFoundException("user not found"));

        BanUserEntity banned = banedUserRepo.findByUserId(user.getId());

        if (banned != null) {
            if (new Date().before(banned.getExpiresAt())) {
                return ResponseEntity.badRequest().body(Map.of("error", "you have been banned"));
            }
        }

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            response.put("error", "Incorrect password");
            return ResponseEntity.badRequest().body(response);
        }

        String token = jwtService.generateToken(user);

        response.put("token", token);

        return ResponseEntity.ok(response);
    }
}
