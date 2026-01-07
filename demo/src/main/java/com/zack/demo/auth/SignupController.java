package com.zack.demo.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SignupController {

    @Autowired
    private SignupService signupService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestPart("signupDto") SignupRequestDto signupRequestDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) throws IOException {
        Map<String, Object> response = new HashMap<>();

        String result = signupService.registerUser(signupRequestDto, profileImage);
        response.put("message", result);

        boolean success = result.equals("User registered successfully!");
        response.put("success", success);

        return ResponseEntity.ok(response);
    }
}
