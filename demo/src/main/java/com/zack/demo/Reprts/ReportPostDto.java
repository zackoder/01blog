package com.zack.demo.Reprts;

public record ReportPostDto(
        long id,
        long postId,
        long reportedAt,
        String reporterNickname,
        String content) {

}
