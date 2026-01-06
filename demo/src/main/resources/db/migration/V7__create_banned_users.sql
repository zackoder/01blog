CREATE TABLE IF NOT EXISTS bans (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    reason TEXT,
    banned_at BIGINT,
    expires_at BIGINT,
    counter int DEFAULT 0
);