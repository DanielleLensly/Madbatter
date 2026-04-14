import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.scss';

// Fuzzy redirect handler for typos
const NotFoundHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const rawPath = location.pathname.toLowerCase();
    // Remove space encoding and normal spaces
    const cleanPath = rawPath.replace(/%20/g, '').replace(/\s/g, '').replace(/\//g, '');

    console.log('Fuzzy matching path:', cleanPath);

    // Admin typos: adminn, admi n, admn, etc.
    if (
      cleanPath.includes('admin') || 
      cleanPath === 'admn' || 
      cleanPath === 'admi' || 
      cleanPath === 'amdin'
    ) {
      navigate('/admin', { replace: true });
      return;
    }

    // Login typos: loginn, log in, etc.
    if (
      cleanPath.includes('login') || 
      cleanPath === 'lgin' || 
      cleanPath === 'logn'
    ) {
      navigate('/madbatter-login', { replace: true });
      return;
    }

    // Default to home for anything else
    navigate('/', { replace: true });
  }, [location, navigate]);

  return null;
};

function App() {
  // Use /Madbatter/ basename in production (GitHub Pages), root in development
  const basename = import.meta.env.PROD ? '/Madbatter' : '/';

  return (
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/madbatter-login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          {/* Catch-all route for spelling check / fuzzy matching */}
          <Route path="*" element={<NotFoundHandler />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
