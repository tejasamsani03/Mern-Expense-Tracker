
import React, { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({ mobile: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        // Use VITE_API_URL for the backend endpoint
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData
      );
      alert(res.data.message);
    } catch (err: any) {
      if (err.response) setError(err.response.data.message);
      else setError("Server error or invalid response.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-slate-900 dark:text-white">
          Sign in to your account
        </h2>
        <input
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Username (4444)"
          className="w-full p-2 border rounded mb-3 appearance-none border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password (1234)"
          className="w-full p-2 border rounded mb-3 appearance-none border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
