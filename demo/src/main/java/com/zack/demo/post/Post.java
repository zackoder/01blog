package com.zack.demo.post;

import com.zack.demo.user.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;

@Entity
@Table(name = "posts")
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private String imagePath;
    private boolean visibility;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private long created_at;

    public boolean getVisibility() {
        return this.visibility;
    }
}
