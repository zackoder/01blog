package com.zack.demo.Reprts;

public record ReportDto(
        String target,
        long targetId,
        String content,
        long createdAt) {
}
