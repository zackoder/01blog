package com.zack.demo.reactions;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReactionRepo extends JpaRepository<Reactions, Long> {
    Optional<Reactions> findByPostIdAndUserId(long postId, long userId);

    @Query(value = """
            SELECT
                COALESCE(SUM(CASE WHEN r.reaction_type = 'like' THEN 1 ELSE 0 END), 0) AS likes,
                COALESCE(SUM(CASE WHEN r.reaction_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes,
                MAX(CASE WHEN r.user_id = ? THEN r.reaction_type ELSE '' END) AS reacted
            FROM
                reactions r
            WHERE
                r.post_id = ?
                """, nativeQuery = true)
    ReactionDtoResp countReaction(long userId, long postId);
}