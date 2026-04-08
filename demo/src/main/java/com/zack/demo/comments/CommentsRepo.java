package com.zack.demo.comments;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentsRepo extends JpaRepository<Comments, Long> {
    long countByPostId(long postId);

    List<Comments> findAllByPostIdOrderByCreatedAtDesc(long id);

    // List<Comments> findAllByPostIdOrderByCreatedAtAsc(long postId);
}
