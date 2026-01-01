package com.zack.demo.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddPostDto(
                Long id,

                @NotBlank(message = "Content cannot be blank") @Size(min = 10, max = 500, message = "Content must be between 10 and 500 characters")
                String content,

                Integer user_id) {
}
