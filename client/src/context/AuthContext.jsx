import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [manager, setManager] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            return;
        }

        api
            .get('/auth/me')
            .then((res) => setManager(res.data.manager))
            .catch(() => localStorage.removeItem('token'))
            .finally(() => setLoading(false));
    }, []);

    const saveSession = (data) => {
        localStorage.setItem('token', data.token);
        setManager(data.manager);
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        saveSession(res.data);
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        saveSession(res.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setManager(null);
    };

    return (
        <AuthContext.Provider value={{ manager, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);