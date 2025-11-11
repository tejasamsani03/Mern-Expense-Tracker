
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../axios";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", mobile: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const { mobile, password } = formData;
        const data = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ mobile, password }),
        });
        alert(data.message || `Login successful! Welcome back.`);
        // You would typically handle the user data/token here
        navigate('/dashboard');
      } else {
        const data = await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        alert(data.message);
        setIsLogin(true); // Switch to login form after successful registration
      }
    } catch (err: any) {
      // The custom apiFetch utility throws an error with a `message` property.
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-slate-900 dark:text-white">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Or{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              {isLogin ? 'create a new account' : 'sign in to your existing account'}
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full p-2 border rounded mb-3 appearance-none border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          )}
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            required
            className="w-full p-2 border rounded mb-3 appearance-none border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-2 border rounded mb-3 appearance-none border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg disabled:bg-indigo-400"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
