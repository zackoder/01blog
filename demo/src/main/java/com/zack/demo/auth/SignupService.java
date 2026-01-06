package com.zack.demo.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zack.demo.user.User;
import com.zack.demo.user.UserRepository;

@Service
public class SignupService {

    @Autowired
    private UserRepository userRepository;

    public String registerUser(SignupRequestDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            return "Email already exists!";
        }

        if (userRepository.existsByNickname(dto.getNickname())) {
            return "Nickname already taken!";
        }

        User user = new User();
        user.setNickname(dto.getNickname());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setBio(dto.getBio());

        User savedUser = userRepository.save(user);

        if (savedUser.getId() == 1) {
            savedUser.setRole("admin");
        }
        userRepository.save(savedUser);
        return "User registered successfully!";
    }
}
