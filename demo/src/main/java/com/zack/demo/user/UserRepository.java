package com.zack.demo.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import io.lettuce.core.dynamic.annotation.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByNickname(String nickname);

    Optional<User> findById(long nickname);

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    @Query(value = """
            SELECT EXISTS (
                SELECT 1 FROM followers
                WHERE follower_id = :followerId
                AND followed_id = :followedId
            )
            """, nativeQuery = true)
    boolean isFollowing(
            @Param("followerId") Long followerId,
            @Param("followedId") Long followedId);
}