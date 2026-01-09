CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    reporter_id INT NOT NULL,
    reported_post_id INT DEFAULT NULL,
    reported_user_id INT DEFAULT NULL,
    content VARCHAR(255),
    created_at INT,
    
    CONSTRAINT check_report_target
        CHECK (reported_post_id IS NOT NULL OR reported_user_id IS NOT NULL),
        
    CONSTRAINT fk_reporter
        FOREIGN KEY(reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reported_post
        FOREIGN KEY(reported_post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_reported_user
        FOREIGN KEY(reported_user_id) REFERENCES users(id) ON DELETE CASCADE
);