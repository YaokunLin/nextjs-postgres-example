// app/src/app/page.js
'use client'

import React, { useState, useEffect } from 'react';
import {UserList} from '../components/UserList'
import {identifyUser} from '../app/apiService'
import UploadPuzzle from '@/components/UploadPuzzle';
import PuzzlePage from './puzzle';

export default function Home() {
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('Anonymous');

    const identify = async () => {
        try {
            const data = await identifyUser(email);
            if (data.status === 'found') {
                setUserType(data.userType);
            } else {
                // Handle anonymous user
                setUserType('Anonymous');
            }
        } catch (error) {
            console.error('Error identifying user:', error);
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        identify();
    };

    return (
        <main>
            {userType === 'Anonymous' && (
                <div>
                    <div>Welcome to Puzzle Team Fun</div>
                    <form 
                        onSubmit={handleSubmit}
                        style={{marginLeft:"50px", marginTop:"50px"}}    
                    >
                        <input 
                            type="email" 
                            value={email} 
                            onChange={handleEmailChange} 
                            placeholder="Enter your email" 
                            style={{color: 'black'}}
                        />
                        <button 
                            type="submit"
                            style={{marginLeft:"15px"}}>
                            ENTER ROOM
                        </button>
                    </form>
                </div>
            )}
            {userType === 'Regular' && (
                <div>
                    <div>Welcome Regular User</div>
                </div>
            )}
            {userType === 'Administrator' && (
                <div>
                    <div>Welcome Administrator</div>
                    <PuzzlePage/>
                    <UserList/>
                </div>
                
            )}
        </main>
    );
}
