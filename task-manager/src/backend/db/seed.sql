
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
user_id UUID PRIMARY KEY,
email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY, 
    title VARCHAR(25) NOT NULL, 
    description VARCHAR(255), 
    priority INT CHECK (priority BETWEEN 1 AND 5) DEFAULT 3, 
    status VARCHAR(25) CHECK (status IN ('to do', 'in progress', 'done')) DEFAULT 'to do', 
    due DATE, 
    created_at TIMESTAMP DEFAULT NOW(), 
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE
    );
INSERT INTO users (user_id, email) VALUES ('11111111-1111-1111-1111-111111111111', 'testUser1@example.com');
INSERT INTO users (user_id, email) VALUES ('22222222-2222-2222-2222-222222222222', 'testUser2@example.com');
INSERT INTO tasks (title, description, priority, due, user_id) VALUES ('Buy groceries','Pick up food for dinner','1', '2025-04-20', '11111111-1111-1111-1111-111111111111');
INSERT INTO tasks (title, description, priority, due, user_id) VALUES ('Tidy','Clean bedroom, clothes chest','3', '2025-04-20', '22222222-2222-2222-2222-222222222222');
INSERT INTO tasks (title, description, priority, due, user_id) VALUES ('Water plants','Make sure all house/garden plants are watered as weather heats up','4', '2025-04-20', '11111111-1111-1111-1111-111111111111');
INSERT INTO tasks (title, description, priority, due, user_id) VALUES ('Portfolio','Complete portfolio project (this one right here!)','5', '2025-04-20', '22222222-2222-2222-2222-222222222222');
