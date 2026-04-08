package com.zack.demo.comments;

public record CommentsResDto(
                long id,
                long userId,
                long postId,
                String comment,
                String nickname,
                long creadAt,
                boolean isOwner

) {
}
