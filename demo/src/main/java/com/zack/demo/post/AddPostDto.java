package com.zack.demo.post;

public record AddPostDto(
        Integer id,
        String content,
        Integer user_id
    ) {
}
