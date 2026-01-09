package com.zack.demo.Reprts;

public record ReportUserDtoRes(
        long id,
        long reportedAt,
        String reporterNickname,
        String reportedNickname,
        String content) {

}
