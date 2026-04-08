package com.zack.demo.comments;

import lombok.Data;

@Data
public class CommentsReqDto {
    private long postId;
    private String comment;
}
