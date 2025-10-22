
import React, { useState, useEffect, useCallback } from 'react';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../services/api';
import { Expense } from '../types';
import ExpenseCharts from './charts/ExpenseCharts';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health"];

const ExpenseRow: React.FC<{ expense: Expense; onEdit: (expense: Expense) => void; onDelete: (id: string) => void; }> = ({ expense, onEdit, onDelete }) => (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
        <td className="py-3 px-6">{format(parseISO(expense.date), 'MMM dd, yyyy')}</td>
        <td className="py-3 px-6">${expense.amount.toFixed(2)}</td>
        <td className="py-3 px-6">{expense.category}</td>
        <td className="py-3 px-6">{expense.description}</td>
        <td className="py-3 px-6">
            <button onClick={() => onEdit(expense)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline mr-4">Edit</button>
            <button onClick={() => onDelete(expense._id)} className="font-medium text-red-600 dark:text-red-400 hover:underline">Delete</button>
        </td>
    </tr>
);

const SummaryCard: React.FC<{ title: string, amount: number }> = ({ title, amount }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
        <h4 className="text-lg font-medium text-slate-500 dark:text-slate-400">{title}</h4>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">${amount.toFixed(2)}</p>
    </div>
);

const ExpenseFormModal: React.FC<{ expense: Partial<Expense> | null; onClose: () => void; onSave: (expense: any) => void; }> = ({ expense, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        date: expense?.date ? format(parseISO(expense.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        amount: expense?.amount || '',
        category: expense?.category || CATEGORIES[0],
        description: expense?.description || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, amount: parseFloat(formData.amount as string) });
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">{expense?._id ? 'Edit Expense' : 'Add New Expense'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required placeholder="0.00" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                        <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="e.g., Groceries" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getExpenses({});
            setExpenses(data);
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleSaveExpense = async (expenseData: any) => {
        try {
            if (editingExpense?._id) {
                await updateExpense(editingExpense._id, expenseData);
            } else {
                await addExpense(expenseData);
            }
            fetchExpenses();
            setIsModalOpen(false);
            setEditingExpense(null);
        } catch (error) {
            console.error("Failed to save expense:", error);
        }
    };
    
    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if(window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await deleteExpense(id);
                fetchExpenses();
            } catch (error) {
                console.error("Failed to delete expense:", error);
            }
        }
    };
    
    const today = new Date();
    const totalToday = expenses.filter(e => format(parseISO(e.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')).reduce((sum, e) => sum + e.amount, 0);
    const weeklyStart = startOfWeek(today);
    const weeklyEnd = endOfWeek(today);
    const totalWeek = expenses.filter(e => parseISO(e.date) >= weeklyStart && parseISO(e.date) <= weeklyEnd).reduce((sum, e) => sum + e.amount, 0);
    const monthlyStart = startOfMonth(today);
    const monthlyEnd = endOfMonth(today);
    const totalMonth = expenses.filter(e => parseISO(e.date) >= monthlyStart && parseISO(e.date) <= monthlyEnd).reduce((sum, e) => sum + e.amount, 0);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <SummaryCard title="Today's Spending" amount={totalToday} />
                <SummaryCard title="This Week's Spending" amount={totalWeek} />
                <SummaryCard title="This Month's Spending" amount={totalMonth} />
            </div>

            <ExpenseCharts expenses={expenses} />
            
            <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">All Expenses</h2>
                    <button onClick={() => { setEditingExpense(null); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                        Add Expense
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th scope="col" className="py-3 px-6">Date</th>
                                <th scope="col" className="py-3 px-6">Amount</th>
                                <th scope="col" className="py-3 px-6">Category</th>
                                <th scope="col" className="py-3 px-6">Description</th>
                                <th scope="col" className="py-3 px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-4">Loading expenses...</td></tr>
                            ) : expenses.length > 0 ? (
                                expenses.map(expense => <ExpenseRow key={expense._id} expense={expense} onEdit={handleEdit} onDelete={handleDelete} />)
                            ) : (
                                <tr><td colSpan={5} className="text-center py-4">No expenses found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isModalOpen && (
                <ExpenseFormModal 
                    expense={editingExpense}
                    onClose={() => { setIsModalOpen(false); setEditingExpense(null); }}
                    onSave={handleSaveExpense}
                />
            )}
        </main>
    );
};

export default Dashboard;
