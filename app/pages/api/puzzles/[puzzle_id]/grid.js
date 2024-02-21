// pages/api/puzzles/[puzzle_id]/grid.js
import pool from '../../../../utils/db';

export default async function handler(req, res) {
    const client = await pool.connect();
    const { puzzle_id } = req.query;
    if (req.method === 'GET') {
        console.log("Hitting GET grid end point")
        try {
            const grid = await getPuzzleGrid(puzzle_id, client);
            const clues = await getPuzzleClues(puzzle_id, client);
            res.status(200).json({ grid, clues });
            //res.status(200).json({ grid });
            res.status(200).json({ clues });
        } catch (error) {
            res.status(500).json({ error});
        } finally {
            client.release();
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function getPuzzleGrid(puzzle_id, client) {
    const result = await client.query('SELECT structure FROM grids WHERE puzzle_id = $1', [puzzle_id]);
    return result.rows[0].structure; 
}

async function getPuzzleClues(puzzle_id, client) {
    const result = await client.query('SELECT * FROM clues WHERE puzzle_id = $1', [puzzle_id]);
    return result.rows.map(row => row.direction); 
}
