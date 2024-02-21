import db from '../../../utils/db';

export default async function handler(req, res) {
    const email = req.query.id; // 'id' here is actually the email from the URL


    if (req.method === 'DELETE') {
        // Add your delete logic here
        return handleDeleteUser(req, res, db, email);
    } else {
        // Handle other methods or return an error
        res.status(405).json({ message: 'Method not allowedd' });
    }
}

async function handleDeleteUser(req, res, db) {
    const { email } = req.body;
    
    // Assuming you have a way to get the email of the requesting user
    // For example, from a session or a token
    const requestingUserEmail = req.user.email; // This needs to be set based on your auth strategy

    // First, check if the requesting user is an admin
    const adminCheckResult = await db.query('SELECT is_admin FROM users WHERE email = $1', [requestingUserEmail]);
    if (adminCheckResult.rows.length === 0 || !adminCheckResult.rows[0].is_admin) {
        return res.status(403).json({ message: 'Only admins can delete users' });
    }

    // Check to ensure not deleting the last admin
    const adminCountResult = await db.query('SELECT COUNT(*) FROM users WHERE is_admin = true');
    const adminCount = parseInt(adminCountResult.rows[0].count);
    if (adminCount <= 1) {
        return res.status(403).json({ message: 'Cannot delete the last admin' });
    }

    // Proceed with deletion
    await db.query('DELETE FROM users WHERE email = $1', [email]);
    res.status(200).json({ message: 'User deleted successfully' });
}

