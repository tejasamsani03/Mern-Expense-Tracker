import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Expense } from '../../types';
// Fix: Import 'parse' from date-fns for reliable date parsing.
import { format, parse, parseISO } from 'date-fns';

interface ExpenseChartsProps {
    expenses: Expense[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ expenses }) => {
    const categoryData = expenses.reduce((acc, expense) => {
        const existingCategory = acc.find(item => item.name === expense.category);
        if (existingCategory) {
            existingCategory.value += expense.amount;
        } else {
            acc.push({ name: expense.category, value: expense.amount });
        }
        return acc;
    }, [] as { name: string; value: number }[]);

    const monthlyData = expenses.reduce((acc, expense) => {
        const month = format(parseISO(expense.date), 'MMM yyyy');
        const existingMonth = acc.find(item => item.name === month);
        if (existingMonth) {
            existingMonth.amount += expense.amount;
        } else {
            acc.push({ name: month, amount: expense.amount });
        }
        return acc;
    }, [] as { name: string; amount: number }[]).sort((a,b) => parse(a.name, 'MMM yyyy', new Date()).getTime() - parse(b.name, 'MMM yyyy', new Date()).getTime());

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-center">Category Breakdown</h3>
                {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                // Fix: Ensure 'percent' is a number before multiplication to prevent TS error.
                                label={({ name, percent }) => `${name} ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : <p className="text-center text-slate-500">No data for pie chart.</p>}
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-center">Monthly Spending</h3>
                {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="amount" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : <p className="text-center text-slate-500">No data for bar chart.</p>}
            </div>
        </div>
    );
};

export default ExpenseCharts;