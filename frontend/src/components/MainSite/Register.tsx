import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './main-site.css';

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowError(false);
    setSuccess(false);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.message && data.message.includes('User already exists')) {
          setError("Bu foydalanuvchi allaqachon mavjud!");
        } else {
          setError("Ro'yxatdan o'tishda xatolik yuz berdi");
        }
        setShowError(true);
        return;
      }
      setSuccess(true);
      // Save token as cookie and redirect
      const data = await res.json();
      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=3600`;
      }
    } catch (err) {
      setError("Serverda xatolik yuz berdi");
      setShowError(true);
    }
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        navigate('/me');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className="login-bg-photo">
      <div className="login-main-card login-main-card-solid">
        <img src="/logo.png" alt="logo" className="login-logo" />
        <h2 className="login-heading">Ro'yxatdan o'tish</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label">Foydalanuvchi nomi</label>
            <input type="text" className="login-input" placeholder="Foydalanuvchi nomi" required value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="login-form-group">
            <label className="login-label">Email</label>
            <input type="email" className="login-input" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="login-form-group login-password-group">
            <label className="login-label">Parol</label>
            <input type={showPassword ? 'text' : 'password'} className="login-input" placeholder="Parol" required value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(v => !v)} className={`login-show-password-btn${showPassword ? ' active' : ''}`} aria-label="Show password">
              <span style={{fontSize: '2.1rem', lineHeight: 1}}>{showPassword ? '\ud83d\ude48' : '\ud83d\udc41\ufe0f'}</span>
            </button>
          </div>
          <button type="submit" className="login-btn login-btn-main">Ro'yxatdan o'tish</button>
          <div className="login-register-link">
            <span>Allaqachon hisobingiz bormi? </span>
            <Link to="/login" className="login-register-cta">Kirish</Link>
          </div>
        </form>
        {showError && (
          <div className="login-error-popup">
            {error}
            <button onClick={() => setShowError(false)} className="login-error-close">Yopish</button>
          </div>
        )}
        {success && (
          <div className="login-success-popup">
            Muvaffaqiyatli ro'yxatdan o'tdingiz!
            <button onClick={() => setSuccess(false)} className="login-error-close">Yopish</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register; 