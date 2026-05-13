import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>💜 Maternal Health Tracker</h1>
        </div>
        <h2 style={styles.subtitle}>Create Account</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '⏳ Creating account...' : '✓ Register'}
          </button>
        </form>

        <p style={styles.text}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '50px 40px',
    borderRadius: '15px',
    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
    width: '100%',
    maxWidth: '420px',
    animation: 'slideInUp 0.6s ease',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    marginBottom: '5px',
    fontSize: '32px',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    color: 'rgba(102, 126, 234, 0.8)',
    marginBottom: '30px',
    fontSize: '24px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '25px',
    animation: 'slideInUp 0.6s ease',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: 'rgba(102, 126, 234, 0.8)',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '8px',
    fontSize: '15px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(5px)',
  },
  'input:focus': {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    background: 'white',
  },
  button: {
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  error: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
    color: 'white',
    padding: '14px',
    borderRadius: '8px',
    marginBottom: '25px',
    fontSize: '14px',
    fontWeight: '500',
    animation: 'slideInDown 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
  },
  text: {
    textAlign: 'center',
    marginTop: '25px',
    color: '#6b7280',
    fontSize: '14px',
  },
  link: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};
