import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    sessionStorage.getItem('adminAuthenticated') === 'true'
  );
  const [username, setUsername] = useState<string | null>(
    sessionStorage.getItem('adminUsername')
  );

  const login = (user: string) => {
    sessionStorage.setItem('adminAuthenticated', 'true');
    sessionStorage.setItem('adminUsername', user);
    setIsAuthenticated(true);
    setUsername(user);
  };

  const logout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
