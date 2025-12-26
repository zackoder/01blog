package com.zack.demo.user;

public record SignupRequestDto(
        String nickname,
        String firstName,
        String lastName,
        String email,
        String password,
        String bio
) {
}
