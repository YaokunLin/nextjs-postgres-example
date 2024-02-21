// pages/api/boats/index.js
import pool from '../../../utils/db';

export default async function handler(req, res) {
    const client = await pool.connect();
  
    try {
      switch (req.method) {
        case 'GET':
          if (req.query.email) {
            await handleGetUserByEmail(req, res, client);
          } else {
            await handleGetUsers(req, res, client);
          }
          break;
        case 'POST':
          await handleAddUser(req, res, client);
          break;
        case 'DELETE':
          await handleDeleteUser(req, res, client);
          break;
        default:
          res.status(405).end(); // Method Not Allowed
      }
    } finally {
      client.release();
    }
  }
  
  async function handleGetUsers(req, res, client) {
    const result = await client.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  }
  
  async function handleGetUserByEmail(req, res, client) {
    const email = req.query.email;
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  }
  
  async function handleAddUser(req, res, client) {
    const { email, is_admin } = req.body;
    await client.query('INSERT INTO users (email, is_admin) VALUES ($1, $2)', [email, is_admin]);
    res.status(201).json({ message: 'User added successfully' });
  }
  
  async function handleDeleteUser(req, res, client) {
    const { email } = req.body;
    const adminCountResult = await client.query('SELECT COUNT(*) FROM users WHERE is_admin = true');
    const adminCount = parseInt(adminCountResult.rows[0].count);
  
    if (adminCount <= 1) {
      return res.status(403).json({ message: 'Cannot delete the last admin' });
    }
  
    await client.query('DELETE FROM users WHERE email = $1', [email]);
    res.status(200).json({ message: 'User deleted successfully' });
  }
