// pages/api/puzzles/[puzzle_id]/clues.js
import pool from '../../../../utils/db';

export default async function handler(req, res) {
    const { puzzle_id } = req.query;
    const client = await pool.connect();

    try {
        const clues = await getPuzzleClues(puzzle_id, client);
        res.status(200).json(clues);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

async function getPuzzleClues(puzzle_id, client) {
    try {
        const result = await client.query('SELECT * FROM clues WHERE puzzle_id = $1', [puzzle_id]);
        return result.rows;
    } finally {
        client.release();
    }
}

