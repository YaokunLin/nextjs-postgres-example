

export async function fetchUsers() {
    const response = await fetch(`api/users`, { next: { revalidate: 1 } });
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return await response.json();
}


export async function deleteUser(email) {
    const response = await fetch(`/api/users/${email}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
    }
    return await response.json();
}

export async function identifyUser(email) {
    const response = await fetch('/api/identify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    return await response.json();
}
