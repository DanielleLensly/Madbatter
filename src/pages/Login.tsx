import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import styles from './Login.module.scss';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { signInWithGoogle, isAuthenticated, isAdmin, loading } = useAuth();
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirect if already logged in and verified
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setError('');
      await signInWithGoogle();
      // Redirect happens automatically via Supabase Auth
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Failed to sign in with Google. Please try again.');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>The Mad Batter</h1>
          <h2 className={styles.subtitle}>Admin Access</h2>

          {isAuthenticated && !isAdmin && !loading && (
            <div className={styles.error}>
              Access Denied: Your email is not authorized to access the admin panel.
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.googleButtonContainer}>
            <Button
              onClick={handleGoogleLogin}
              fullWidth
              size="large"
              disabled={isLoggingIn || loading}
              className={styles.googleBtn}
            >
              {isLoggingIn ? 'Connecting...' : 'Sign in with Google'}
            </Button>
          </div>

          <p className={styles.note}>
            Note: Access is restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
