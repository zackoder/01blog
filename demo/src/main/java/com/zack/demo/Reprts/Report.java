package com.zack.demo.Reprts;

import com.zack.demo.post.Post;
import com.zack.demo.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "reports")
@Data
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @ManyToOne
    @JoinColumn(name = "reported_user_id", nullable = true)
    private User reportedUser;

    @ManyToOne
    @JoinColumn(name = "reported_post_id", nullable = true)
    private Post reportedPost;

    @Column(name = "created_at")
    private long createdAt;
    private String content;
}
