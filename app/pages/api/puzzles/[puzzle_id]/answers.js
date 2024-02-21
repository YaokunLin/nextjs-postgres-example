// pages/api/puzzles/[puzzle_id]/answers.js
import pool from '../../../../utils/db';

export default async function handler(req, res) {
    const client = await pool.connect();

    if (req.method === 'POST') {
        const { puzzle_id } = req.query;
        const { user_id, clue_id, answer_text } = req.body;

        try {
            const result = await submitAnswer(puzzle_id, user_id, clue_id, answer_text, client);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } 
    else if(req.method === 'GET'){
        const { puzzle_id } = req.query;

        try {
            const answers = await getPuzzleAnswers(puzzle_id);
            res.status(200).json(answers);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }

    }
    
    else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function submitAnswer(puzzle_id, user_id, clue_id, answer_text, client) {
    

    try {
        // Begin transaction
        await client.query('BEGIN');

        // Check if the answer is correct
        const res = await client.query('SELECT correct_answer FROM clues WHERE clue_id = $1', [clue_id]);
        const isCorrect = res.rows[0].correct_answer === answer_text;

        // Insert the answer
        await client.query('INSERT INTO answers (clue_id, user_id, answer_text, is_correct) VALUES ($1, $2, $3, $4)', 
                           [clue_id, user_id, answer_text, isCorrect]);

        // Commit transaction
        await client.query('COMMIT');

        return { success: true, isCorrect };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

