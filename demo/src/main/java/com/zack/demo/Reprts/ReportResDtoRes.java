package com.zack.demo.Reprts;

public record ReportResDtoRes(
                long id,
                long postId,
                long reportedAt,
                String reporterNickname,
                String reportedNickname,
                String content) {
}
