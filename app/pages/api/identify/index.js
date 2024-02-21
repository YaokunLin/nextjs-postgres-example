import pool from '../../../utils/db';

export default async function handler(req, res) {
    const client = await pool.connect();
    console.log("Hitting the identify end point")

    if (req.method === 'POST') {
        const { email } = req.body;

        try {
            // Query the database to find the user by email
            const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

            // Check if the user exists and return the appropriate status
            if (user) {
                res.status(200).json({ status: 'found', userType: user.is_admin ? 'Administrator' : 'Regular' });
            } else {
                res.status(200).json({ status: 'not found', userType: 'Anonymous' });
            }
        } catch (error) {
            console.error('Database query failed:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            client.release();
        }
    } else {
        // Handle non-POST requests
        res.status(405).json({ message: 'Method not allowedd' });
    }
}
