import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Carica i dati da localStorage al refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Funzione per gestire il login
  const login = (token, role, id) => {
    const userData = { token, role, id };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Salva anche su localStorage
  };

  // Funzione per gestire il logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
