
import React from 'react';

interface NavbarProps {
    userName: string;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userName, onLogout }) => {
    return (
        <nav className="bg-slate-200 dark:bg-slate-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">ExpenseTracker</h1>
                    </div>
                    <div className="flex items-center">
                        <span className="text-slate-700 dark:text-slate-300 mr-4">Welcome, {userName}</span>
                        <button
                            onClick={onLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
