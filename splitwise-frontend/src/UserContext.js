import React, { createContext, useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { getToken } from './auth';
import { userDetailAction } from './action/user';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = getToken();
                if (token) {
                    const userData = await dispatch(userDetailAction());
                    setUser(userData);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);