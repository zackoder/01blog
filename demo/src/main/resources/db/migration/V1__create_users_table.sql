CREATE TABLE
    IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nickname VARCHAR(50) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        bio TEXT,
        image_path VARCHAR(255),
        role VARCHAR(20) DEFAULT 'USER'
    );