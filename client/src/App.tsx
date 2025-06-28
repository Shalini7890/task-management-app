import React, { useState } from 'react';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { User } from './types';
import { Dashboard } from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setShowLogin(true);
  }

  const handleAuthSuccess = (token: string, userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  }

  if (!isAuthenticated) {
    return showLogin ? (<Login onSuccess={handleAuthSuccess} onSwitchToRegister={() => { setShowLogin(false) }} />) :
      (<Register onSuccess={handleAuthSuccess} onSwitchToLogin={() => { setShowLogin(true) }} />)
  }

  return (


    <Dashboard user={user!} onLogout={handleLogout} />


  );
}

export default App;
