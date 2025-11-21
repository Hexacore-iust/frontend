import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../assets/styles/SignupForm.css';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address (e.g., user@example.com)');
      return;
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, and numbers');
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password,
          password2: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Signup successful! Redirecting to login...');
        // Reset form
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRememberMe(false);
        
        // Optionally redirect after success
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        // Handle error response from Django
        if (data.message) {
          setError(data.message);
        } else if (data.username || data.email || data.password) {
          // Django validation errors (e.g., "username already exists")
          setError(Object.values(data).flat().join(', '));
        } else {
          setError('Signup failed. Please try again.');
        }
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-content">
          <div className="signup-title">
            <h1>ثبت نام</h1>
            <div className="signup-underline"></div>
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

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-input-group">
              <input
                type="text"
                placeholder="نام کاربری"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="signup-input"
                required
              />
            </div>

            <div className="signup-input-group">
              <input
                type="email"
                placeholder="ایمیل"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="signup-input"
                required
              />
            </div>

            <div className="signup-input-group" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="signup-input"
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

            <div className="signup-input-group" style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="تایید رمز عبور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="signup-input"
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
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
                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <div className="signup-remember">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">مرا به خاطر بسپار</label>
            </div>

            <button 
              type="submit" 
              className="signup-button"
              disabled={loading}
            >
              {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
            </button>

            <div className="signup-login-link">
              <a href="/login" style={{ textDecoration : 'underline' }}>حساب کاربری دارید؟</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;