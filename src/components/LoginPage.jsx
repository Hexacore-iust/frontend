import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../assets/styles/LoginForm.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Sending login ', {
        email: email.trim(),
        password: password
      });

      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response ', data);

      if (response.ok) {
        setSuccess('Login successful! Redirecting...');
        
        // Save user info to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect after success
        setTimeout(() => {
          window.location.href = '/dashboard'; // Change to your desired redirect page
        }, 1500);
      } else {
        // Handle error response
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-info">
          <div className="login-title">
            <h1>ورود</h1>
            <div className="login-underline"></div>
          </div>

          {error && (
            <div className="error-message" style={{
              color: '#ef4444',
              backgroundColor: '#fee2e2',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message" style={{
              color: '#22c55e',
              backgroundColor: '#dcfce7',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <input
                type="email"
                placeholder="ایمیل"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                required
              />
            </div>

            <div className="login-input-group" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '56%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <div className="login-forgot-password">
              <a href="/login"
              style={{ textDecoration : 'underline',
                        fontWeight : '350',
                        fontSize : 'Small'
                       }}>رمز عبور خود را فراموش کرده‌اید؟</a>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>

            <div className="signup-login-link">
              <a href="/signup" style={{ textDecoration : 'underline' }}>ثبت نام نکرده‌اید؟</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;