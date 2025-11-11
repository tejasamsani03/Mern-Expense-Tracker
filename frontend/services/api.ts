
import apiFetch from '../axios';

export const register = (userData: any) => 
    apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });

export const login = (credentials: any) =>
    apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });


export const getExpenses = (filters: { startDate?: string; endDate?: string; category?: string }) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.category) params.append('category', filters.category);

    const queryString = params.toString();
    return apiFetch(`/expenses${queryString ? `?${queryString}` : ''}`);
};

export const addExpense = (expenseData: any) =>
    apiFetch('/expenses', {
        method: 'POST',
        body: JSON.stringify(expenseData),
    });

export const updateExpense = (id: string, expenseData: any) =>
    apiFetch(`/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(expenseData),
    });

export const deleteExpense = (id: string) =>
    apiFetch(`/expenses/${id}`, {
        method: 'DELETE',
    });

export const getUserProfile = () =>
    apiFetch('/user/profile');

export const updateUserProfile = (userData: any) =>
    apiFetch('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
