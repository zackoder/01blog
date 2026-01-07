package com.zack.demo.post;

public record GetPostDto(
                long id,
                String avatar,
                String content,
                String image_path,
                long user_id,
                boolean visibility,
                long created_at,
                String nickname,
                long likes,
                long dislikes,
                boolean postOwner,
                String reacted) {
}
