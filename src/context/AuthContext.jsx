import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Demo accounts for testing
export const DEMO_ACCOUNTS = [
  {
    id: 'p123',
    name: 'Abdou Patient',
    email: 'patient@doctori.dz',
    password: 'patient123',
    role: 'patient',
    description: 'Compte patient pour tester les réservations et la messagerie',
  },
  {
    id: 1,
    name: 'Dr. MOHAMMED BENAHMED Aicha',
    email: 'doctor@doctori.dz',
    password: 'doctor123',
    role: 'doctor',
    description: 'Compte médecin pour gérer le dashboard et les patients',
  },
  {
    id: 'admin1',
    name: 'Admin Doctori',
    email: 'admin@doctori.dz',
    password: 'admin123',
    role: 'admin',
    description: 'Compte administrateur pour gérer toute la plateforme',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved session
    const savedUser = localStorage.getItem('doctori_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role = 'patient') => {
    const savedUsers = JSON.parse(localStorage.getItem('doctori_registered_users') || '[]');
    const allUsers = [...DEMO_ACCOUNTS, ...savedUsers];

    const foundUser = allUsers.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (foundUser) {
      const loggedUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      setUser(loggedUser);
      localStorage.setItem('doctori_user', JSON.stringify(loggedUser));
      return loggedUser.role;
    }

    alert("Identifiants incorrects. Veuillez vérifier votre adresse email et votre mot de passe.");
    return null;
  };

  const register = (data) => {
    // Save to registered users list
    const newUser = {
      id: (data.role === 'doctor' ? 'd' : 'p') + Math.floor(Math.random() * 10000),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'patient',
    };
    
    const savedUsers = JSON.parse(localStorage.getItem('doctori_registered_users') || '[]');
    savedUsers.push(newUser);
    localStorage.setItem('doctori_registered_users', JSON.stringify(savedUsers));

    // Auto-login after registration
    const loggedUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    setUser(loggedUser);
    localStorage.setItem('doctori_user', JSON.stringify(loggedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('doctori_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
