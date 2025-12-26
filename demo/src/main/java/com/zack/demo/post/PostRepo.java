package com.zack.demo.post;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepo extends JpaRepository<Post, Long> {
    Optional<Post> findById(Long id);

    boolean existsByIdAndUserNickname(Long id, String nickname);

    boolean existsById(Long id);

    @Query(value = """
            SELECT
                p.id,
                p.content,
                p.image_path,
                p.user_id,
                p.visibility,
                p.created_at,
                u.nickname,
                SUM(CASE WHEN r.reaction_type = 'like' THEN 1 ELSE 0 END) AS likes,
                SUM(CASE WHEN r.reaction_type = 'dislike' THEN 1 ELSE 0 END) AS dislikes,
                CASE WHEN p.user_id = ?1 THEN true ELSE false END AS post_owner,
                MAX(CASE WHEN r.user_id = ?2 THEN r.reaction_type ELSE '' END) AS reacted

            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN reactions r ON p.id = r.post_id

            GROUP BY
                p.id, p.content, p.image_path, p.user_id, p.visibility, p.created_at, u.nickname

            ORDER BY p.id DESC
            LIMIT ?3 OFFSET ?4;

                        """, nativeQuery = true)
    List<GetPostDto> findPostsByOffsetAndLimit(long id, long id1, long limit, long offset);

    @Query(value = """
            SELECT
                p.id,
                p.content,
                p.image_path,
                p.user_id,
                p.visibility,
                p.created_at,
                u.nickname,
                SUM(CASE WHEN r.reaction_type = 'like' THEN 1 ELSE 0 END) AS likes,
                SUM(CASE WHEN r.reaction_type = 'dislike' THEN 1 ELSE 0 END) AS dislikes,
                CASE WHEN p.user_id = ?1 THEN true ELSE false END AS post_owner,
                MAX(CASE WHEN r.user_id = ?2 THEN r.reaction_type ELSE '' END) AS reacted

            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN reactions r ON p.id = r.post_id
            WHERE
                p.user_id = ?3
            GROUP BY
                p.id, p.content, p.image_path, p.user_id, p.visibility, p.created_at, u.nickname

            ORDER BY p.id DESC
            LIMIT ?4 OFFSET ?5;

                        """, nativeQuery = true)
    List<GetPostDto> findUserPostsByOffsetAndLimit(long id1, long id2, long id3, long limit4, long offset5);

}
