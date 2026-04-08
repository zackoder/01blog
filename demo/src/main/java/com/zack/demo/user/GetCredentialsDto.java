package com.zack.demo.user;

public record GetCredentialsDto(
        long id,
        String nickname,
        String avatar,
        String role) {
}
