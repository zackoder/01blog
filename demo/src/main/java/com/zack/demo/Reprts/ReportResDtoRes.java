package com.zack.demo.Reprts;

import com.beust.jcommander.internal.Nullable;

public record ReportResDtoRes(
        long id,
        @Nullable Long postId,
        long reportedAt,
        String reporterNickname,
        String reportedNickname,
        String content) {
}
