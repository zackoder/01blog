CREATE TABLE
    IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        post_id INT,
        created_at BIGINT,
        CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        CONSTRAINT fk_notif_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
    );