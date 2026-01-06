CREATE TABLE IF NOT EXISTS followers (   
    id SERIAL PRIMARY KEY,
    follower_id INT NOT NULL,
    followed_id INT NOT NULL,
    CONSTRAINT fk_follower
        FOREIGN KEY(follower_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_followed
        FOREIGN KEY(followed_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT unique_follow
        UNIQUE(follower_id, followed_id)
);