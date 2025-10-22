
import React from 'react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

function App() {
  const { user, login, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }
  
  return (
      <div className="min-h-screen">
          {user ? (
              <>
                  <Navbar userName={user.name} onLogout={logout} />
                  <Dashboard />
              </>
          ) : (
              <AuthForm onAuthSuccess={login} />
          )}
      </div>
  );
}

export default App;
