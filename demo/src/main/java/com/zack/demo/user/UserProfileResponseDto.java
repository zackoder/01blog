package com.zack.demo.user;

public record UserProfileResponseDto(
        String nickname,
        String firstName,
        String lastName,
        String bio,
        String avatar,
        boolean isFollower,
        boolean isOwner) {

}
