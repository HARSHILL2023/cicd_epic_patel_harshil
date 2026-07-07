import api from '../api/axios';

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};
