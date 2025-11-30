import React, { useState, useEffect, useRef } from 'react';
import '../assets/styles/OTPForm.css';

const toPersianNumber = (num) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

const OTPVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // ← 6 digits now
  const [timeLeft, setTimeLeft] = useState(299); // 5 minutes = 299 seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inputRefs = useRef([]);

  // Extract email from URL query param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      window.location.href = '/login';
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${toPersianNumber(mins)}:${toPersianNumber(secs.toString().padStart(2, '0'))}`;
  };

  const handleInputChange = (index, value) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) { // ← auto-focus next up to index 5 (6th input)
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.some((digit) => digit === '')) {
      setError('لطفاً همهٔ ارقام را وارد کنید');
      return;
    }

    const otpCode = otp.join('');
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/otp/verify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: otpCode,
          purpose: 'verification',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('کد تأیید صحیح است. در حال هدایت به صفحه بازیابی رمز عبور...');
        setTimeout(() => {
          window.location.href = `/reset-password?email=${encodeURIComponent(email)}`;
        }, 1500);
      } else {
        setError(data.error || 'کد اشتباه است. لطفاً دوباره تلاش کنید.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('خطای شبکه. لطفاً اتصال اینترنت خود را بررسی کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return; // Prevent spam

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/otp/resend/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          purpose: 'verification',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTimeLeft(299);
        setSuccess('کد جدید با موفقیت ارسال شد!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'خطا در ارسال مجدد کد.');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('خطای شبکه. لطفاً دوباره تلاش کنید.');
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="otp-content">
          <h1 className="otp-title">بازیابی رمز عبور</h1>
          <p className="otp-instructions">
            کد ۶ رقمی ارسال‌شده به ایمیل <strong>{email}</strong> را وارد کنید.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                  style={{
                    borderColor: error ? '#ef4444' : '#ff9d2c',
                  }}
                  disabled={isSubmitting}
                />
              ))}
            </div>

            <div className="otp-timer">
              {timeLeft > 0 ? (
                <>
                  <span>{formatTime(timeLeft)}</span>
                  <div
                    className="resend-text-disabled"
                    style={{
                      fontSize: '14px',
                      cursor: 'not-allowed',
                      marginTop: '8px',
                    }}
                  >
                    <span style={{ color: '#ffffff' }}>ایمیل را دریافت نکردم.</span>{' '}
                    <span style={{ color: '#cecdcdff', textDecoration: 'underline' }}>
                      ارسال مجدد
                    </span>
                  </div>
                </>
              ) : (
                <div
                  className="resend-text"
                  style={{
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginTop: '8px',
                  }}
                  onClick={handleResend}
                >
                  <span style={{ color: '#ffffff' }}>ایمیل را دریافت نکردم.</span>{' '}
                  <span style={{ color: '#ff9800', textDecoration: 'underline' }}>
                    ارسال مجدد
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div
                className="error-message"
                style={{
                  color: '#ef4444',
                  backgroundColor: '#fee2e2',
                  padding: '8px',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  textAlign: 'center',
                  fontSize: '14px',
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="success-message"
                style={{
                  color: '#22c55e',
                  backgroundColor: '#dcfce7',
                  padding: '8px',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  textAlign: 'center',
                  fontSize: '14px',
                }}
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              className="otp-button"
              disabled={isSubmitting || otp.some((d) => d === '')}
              style={{
                width: '10%',
                padding: '12px',
                backgroundColor: '#066a49',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                marginTop: '20px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'در حال تأیید...' : 'تایید کد'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;