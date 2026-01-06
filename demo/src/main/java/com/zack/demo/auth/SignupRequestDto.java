package com.zack.demo.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SignupRequestDto(
        @NotBlank String nickname,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email String email,
        @NotBlank String password,
        @NotBlank String confPassword,
        String bio) {
}
