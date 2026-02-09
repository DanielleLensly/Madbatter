import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { User } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import styles from './Login.module.scss';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState<'login' | 'recover'>('login');
  const [step, setStep] = useState<'credentials' | 'security'>('credentials');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    securityAnswer: ''
  });

  const [error, setError] = useState('');
  const [recoveryUser, setRecoveryUser] = useState<User | null>(null);

  // Get users from localStorage
  const getUsers = (): User[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!stored) {
      // Create default admin user if none exists
      const defaultUser: User = {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        securityQuestion: 'What is your favorite color?',
        securityAnswer: 'blue',
        createdDate: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([defaultUser]));
      return [defaultUser];
    }
    return JSON.parse(stored);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = getUsers();
    const user = users.find(u => u.username === formData.username);

    if (!user) {
      setError('Username not found');
      return;
    }

    if (user.password !== formData.password) {
      setError('Incorrect password');
      return;
    }

    // Successful login
    login(user.username);
    navigate('/admin');
  };

  const handleRecoveryStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = getUsers();
    const user = users.find(u => u.username === formData.username);

    if (!user) {
      setError('Username not found');
      return;
    }

    setRecoveryUser(user);
    setStep('security');
  };

  const handleRecoveryStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!recoveryUser) return;

    // Case-insensitive comparison
    const userAnswer = formData.securityAnswer.toLowerCase().trim();
    const correctAnswer = recoveryUser.securityAnswer.toLowerCase().trim();

    if (userAnswer !== correctAnswer) {
      setError('Incorrect answer to security question');
      return;
    }

    // Show password
    alert(`Your password is: ${recoveryUser.password}\n\nPlease write it down and click OK to return to login.`);

    // Reset to login mode
    setMode('login');
    setStep('credentials');
    setFormData({ username: '', password: '', securityAnswer: '' });
    setRecoveryUser(null);
  };

  const resetForm = () => {
    setMode('login');
    setStep('credentials');
    setFormData({ username: '', password: '', securityAnswer: '' });
    setRecoveryUser(null);
    setError('');
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>The Mad Batter</h1>
          <h2 className={styles.subtitle}>
            {mode === 'login' ? 'Admin Login' : 'Password Recovery'}
          </h2>

          {error && <div className={styles.error}>{error}</div>}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button type="submit" fullWidth size="large">
                Login
              </Button>

              <button
                type="button"
                className={styles.linkButton}
                onClick={() => setMode('recover')}
              >
                Forgot your password?
              </button>
            </form>
          ) : (
            <>
              {step === 'credentials' ? (
                <form onSubmit={handleRecoveryStep1} className={styles.form}>
                  <p className={styles.instruction}>
                    Enter your username to recover your password
                  </p>

                  <div className={styles.formGroup}>
                    <label>Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <Button type="submit" fullWidth size="large">
                    Continue
                  </Button>

                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={resetForm}
                  >
                    Back to login
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRecoveryStep2} className={styles.form}>
                  <p className={styles.instruction}>
                    Answer your security question to recover your password
                  </p>

                  <div className={styles.securityQuestion}>
                    <strong>Security Question:</strong>
                    <p>{recoveryUser?.securityQuestion}</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Your Answer</label>
                    <input
                      type="text"
                      value={formData.securityAnswer}
                      onChange={e => setFormData({ ...formData, securityAnswer: e.target.value })}
                      placeholder="Enter your answer"
                      required
                    />
                  </div>

                  <Button type="submit" fullWidth size="large">
                    Recover Password
                  </Button>

                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={resetForm}
                  >
                    Back to login
                  </button>
                </form>
              )}
            </>
          )}


        </div>
      </div>
    </div>
  );
};

export default Login;
