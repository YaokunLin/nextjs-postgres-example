// pages/api/puzzles/index.js
import pool from '../../../utils/db';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    let client;
    try {
        client = await pool.connect();
        if (req.method === 'POST') {
            console.log("Hitting the puzzles POST endpoint");

            // Parse the multipart form data
            const form = new IncomingForm();

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Error parsing form data' });
                    return;
                }

                try {
                    // Access the first file in the array
                    const file = files.file[0];
                    const fileData = fs.readFileSync(file.filepath, 'utf-8');
                    const { title, grid, clues } = parsePuzzleFile(fileData);

                    const newPuzzle = await createPuzzle(title, grid, clues, client);
                    res.status(200).json({ success: true, puzzle_id: newPuzzle.puzzle_id });
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Server error' });
                }
            });
        } else {
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        res.status(500).json({ error: 'Database connection error' });
    } finally {
        if (client) {
            client.release();
        }
    }
}

async function createPuzzle(title, grid, clues, client) {
    try {
        await client.query('BEGIN');

        // Insert the puzzle
        const puzzleRes = await client.query('INSERT INTO puzzles (title) VALUES ($1) RETURNING puzzle_id', [title]);
        const puzzle_id = puzzleRes.rows[0].puzzle_id;

        // Insert the grid (make sure grid is properly formatted as a JSON array)
        await client.query('INSERT INTO grids (puzzle_id, structure) VALUES ($1, $2)', [puzzle_id, grid]);

        // Insert the clues (make sure clues are properly formatted for your database)
        for (const clue of clues) {
            await client.query('INSERT INTO clues (puzzle_id, direction, row_col_idx, clue_text, clue_len, correct_answer) VALUES ($1, $2, $3, $4, $5, $6)',
                               [puzzle_id, clue.direction, clue.row_col_idx, clue.clue_text, clue.clue_len, clue.correct_answer]);
        }

        await client.query('COMMIT');

        return { success: true, puzzle_id };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    
}


function parsePuzzleFile(fileData) {
    const lines = fileData.split('\n');
    let title = '';
    let grid = [];
    let clues = [];
    let solutions = [];
    let currentDirection = '';
    let section = ''; 

    lines.forEach(line => {
        if (line.startsWith('Title:')) {
            title = line.substring(7).trim();
        } else if (line.trim() === '# Grid') {
            section = 'grid';
        } else if (line.trim() === '# Clues') {
            section = 'clues';
        } else if (line.trim() === '# Solutions') {
            section = 'solutions';
        } else if (line.trim() !== '') {
            switch (section) {
                case 'grid':
                    grid.push(line.trim());
                    break;
                case 'clues':
                    if (line.includes('Across:')) {
                        currentDirection = 'Across';
                    } else if (line.includes('Down:')) {
                        currentDirection = 'Down';
                    } else {
                        const clueMatch = line.match(/(\d+)\. (.+)/);
                        if (clueMatch) {
                            clues.push({
                                number: parseInt(clueMatch[1], 10),
                                text: clueMatch[2],
                                direction: currentDirection
                            });
                        }
                    }
                    break;
                case 'solutions':
                    const solutionMatch = line.match(/(\d+[AD]): (\w+)/);
                    if (solutionMatch) {
                        solutions.push({
                            position: solutionMatch[1],
                            answer: solutionMatch[2]
                        });
                    }
                    break;
            }
        }
    });

    return { title, grid: JSON.stringify(grid), clues, solutions };
}
