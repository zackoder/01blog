package com.zack.demo.Reprts;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import io.lettuce.core.dynamic.annotation.Param;

@Repository
public interface ReportRepo extends JpaRepository<Report, Long> {
    @Query(value = """
            SELECT
                r.id,
                CAST(COALESCE(r.reported_post_id, -1) AS BIGINT) AS postId,
                r.created_at,
                u1.nickname AS reporterNickname,
                u2.nickname AS reportedNickname,
                r.content
            FROM
                reports r
            LEFT JOIN
                users u1
            ON
                u1.id = r.reporter_id
            LEFT JOIN
                users u2
            ON
                u2.id = r.reported_user_id
            WHERE r.type = :type
            ORDER BY r.created_at DESC
            LIMIT 10 OFFSET :offset;

                        """, nativeQuery = true)
    List<ReportResDtoRes> getReports(@Param("type") String type, @Param("offset") long offset);
}
