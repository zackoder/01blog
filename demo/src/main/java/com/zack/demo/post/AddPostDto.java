package com.zack.demo.post;

public record AddPostDto(
        Long id,
        String content,
        Integer user_id) {
}
