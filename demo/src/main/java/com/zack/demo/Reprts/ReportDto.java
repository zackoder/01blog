package com.zack.demo.Reprts;

import jakarta.validation.constraints.NotBlank;

public record ReportDto(
                @NotBlank String content,
                String reported,
                long reportedPostId) {
}
