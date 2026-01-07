package com.zack.demo.auth;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.HashMap;

import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zack.demo.user.User;
import com.zack.demo.user.UserRepository;

@Service
public class SignupService {

    @Autowired
    private UserRepository userRepository;

    public String registerUser(SignupRequestDto dto, MultipartFile profileImage) throws IOException {
        if (userRepository.existsByEmail(dto.email())) {
            return "Email already exists!";
        }

        if (userRepository.existsByNickname(dto.nickname())) {
            return "Nickname already taken!";
        }

        String filePath = "";

        if (profileImage != null && !profileImage.isEmpty()) {
            filePath = uploadFile(profileImage);
            if (!filePath.startsWith("image") && !filePath.startsWith("video")) {
                return filePath;
            }
            String message = storeFile(filePath, profileImage);
            if (!message.equals("successfully")) {
                return message;
            }
        }

        User user = new User();

        if (filePath.isEmpty()) {
            filePath = "default-avatar.jpg";
        }

        user.setImagePath("/uploads/" + filePath);
        user.setNickname(dto.nickname());
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        user.setBio(dto.bio());

        User savedUser = userRepository.save(user);

        if (savedUser.getId() == 1) {
            savedUser.setRole("admin");
        }
        userRepository.save(savedUser);
        return "User registered successfully!";
    }

    public String storeFile(String fileName, MultipartFile file) throws IOException {
        Path uploadBasePath = Paths.get("uploads").toAbsolutePath().normalize();

        String[] splitted = fileName.split("/");
        Path targetDir = uploadBasePath.resolve(splitted[0]);

        Files.createDirectories(targetDir);
        Path targetPath = targetDir.resolve(splitted[1]);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return "successfully";
    }

    private String uploadFile(MultipartFile file) {
        Tika tika = new Tika();
        String fileName = "";
        try {
            byte[] bytes = file.getBytes();
            if (bytes.length > 0) {
                if (tika.detect(bytes).startsWith("image")) {
                    fileName = "images/";
                } else {
                    System.out.println("file type " + tika.detect(bytes));
                    return "invalid file type";
                }
            }
        } catch (Exception e) {
            return "couldn't read the file";
        }

        Date currentTime = new Date();
        fileName += currentTime.getTime() + "_" + file.getOriginalFilename();
        return fileName;
    }

}
