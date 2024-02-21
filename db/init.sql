-- Create the 'users' table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    is_admin BOOLEAN NOT NULL DEFAULT false
);

-- Insert dummy data for enrolled users
INSERT INTO users (email, is_admin) VALUES 
    ('patrick@email.com', true),
    ('john@email.com', false);

--Relationships:
--A Puzzle has one Grid.
--A Puzzle has many Clues.
--A Clue has one Correct Answer.
--A User can have many Answers.
--An Answer can be related to many Users (through UserAnswers).

-- Create the 'puzzles' table
CREATE TABLE IF NOT EXISTS puzzles (
    puzzle_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'grids' table
CREATE TABLE IF NOT EXISTS grids (
    grid_id SERIAL PRIMARY KEY,
    puzzle_id INTEGER REFERENCES puzzles(puzzle_id),
    structure JSON NOT NULL
);

-- Create the 'clues' table
CREATE TABLE IF NOT EXISTS clues (
    clue_id SERIAL PRIMARY KEY,
    puzzle_id INTEGER REFERENCES puzzles(puzzle_id),
    direction VARCHAR(10) CHECK (direction IN ('Across', 'Down')),
    row_col_idx INTEGER,
    clue_text TEXT,
    clue_len INTEGER,
    correct_answer TEXT
);

-- Create the 'answers' table
CREATE TABLE IF NOT EXISTS answers (
    answer_id SERIAL PRIMARY KEY,
    clue_id INTEGER REFERENCES clues(clue_id),
    user_id INTEGER REFERENCES users(id),
    answer_text VARCHAR(255),
    is_correct BOOLEAN,
    answered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


