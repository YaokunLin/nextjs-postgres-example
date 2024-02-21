import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '../app/apiService';

export const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const refreshUsers = async () => {
        try {
            setLoading(true);
            const fetchedUsers = await fetchUsers();
            setUsers(fetchedUsers);
            setError(''); // Resetting error state on successful fetch
        } catch (err) {
            setError('Failed to load users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    const handleDelete = async (userId) => {
        try {
            setLoading(true);
            await deleteUser(userId);
            setSuccessMessage('User deleted successfully');
            refreshUsers();
        } catch (err) {
            setError('Failed to delete user');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div 
        style={{
            border: "solid", 
            margin:"20px",
            borderRadius:"5px",
            padding:"10px"
            }}>
            <h2>User List</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <ul>
                {users.map(user => (
                    <li key={user.id} style={{marginBottom:"15px"}}>
                        {user.email} - {user.is_admin ? 'Admin' : 'User'}
                        {/* <button
                            style={{border:'solid', marginLeft:'10px', padding:'3px'}} 
                        onClick={() => handleDelete(user.id)}>
                            Delete
                        </button> */}
                    </li>
                ))}
            </ul>
        </div>
    );
};
