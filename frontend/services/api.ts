
// Use environment variables to switch between local and production backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
        const user = JSON.parse(userString);
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
        };
    }
    return { 'Content-Type': 'application/json' };
};

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
}

export const register = (userData: any) => 
    fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    }).then(handleResponse);

export const login = (credentials: any) =>
    fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    }).then(handleResponse);


export const getExpenses = (filters: { startDate?: string; endDate?: string; category?: string }) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.category) params.append('category', filters.category);
    
    return fetch(`${API_URL}/expenses?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const addExpense = (expenseData: any) =>
    fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(expenseData),
    }).then(handleResponse);

export const updateExpense = (id: string, expenseData: any) =>
    fetch(`${API_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(expenseData),
    }).then(handleResponse);

export const deleteExpense = (id: string) =>
    fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    }).then(handleResponse);

export const getUserProfile = () =>
    fetch(`${API_URL}/user/profile`, {
        method: 'GET',
        headers: getAuthHeaders(),
    }).then(handleResponse);

export const updateUserProfile = (userData: any) =>
    fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
    }).then(handleResponse);
