package com.zack.demo.reactions;

public record ReactionDto(
        String target,
        long targetId,
        String reactionType,
        long createdAt) {
}
