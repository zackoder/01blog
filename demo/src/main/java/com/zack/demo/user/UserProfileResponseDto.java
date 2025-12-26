package com.zack.demo.user;

public record UserProfileResponseDto(
        String nickname,
        String firstName,
        String lastName,
        String bio,
        boolean isFollower,
        boolean isOwner
    ) {

}
