CREATE TABLE
    posts (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        content VARCHAR(100),
        image_path VARCHAR(255),
        visibility BOOLEAN DEFAULT true,
        created_at int,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );