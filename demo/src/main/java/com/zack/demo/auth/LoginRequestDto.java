package com.zack.demo.auth;

public record LoginRequestDto(
        String email,
        String password) {
}