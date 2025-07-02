import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './main-site.css';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowError(false);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        setError("Foydalanuvchi nomi yoki parol noto'g'ri!");
        setShowError(true);
        return;
      }
      const data = await res.json();
      // Store token in cookie for 7 days
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `token=${data.token}; expires=${expires}; path=/`;
      navigate('/me');
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

  return (
    <div className="login-bg-photo">
      <div className="login-main-card login-main-card-solid">
        <img src="/logo.png" alt="logo" className="login-logo" />
        <h2 className="login-heading">Kirish</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label">Ism</label>
            <input type="text" className="login-input" placeholder="Ism" required value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="login-form-group login-password-group">
            <label className="login-label">Parol</label>
            <input type={showPassword ? 'text' : 'password'} className="login-input" placeholder="Parol" required value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(v => !v)} className={`login-show-password-btn${showPassword ? ' active' : ''}`} aria-label="Show password">
              <span style={{fontSize: '2.1rem', lineHeight: 1}}>{showPassword ? '\ud83d\ude48' : '\ud83d\udc41\ufe0f'}</span>
            </button>
          </div>
          <button type="submit" className="login-btn login-btn-main">Kirish</button>
          <div className="login-register-link">
            <span>Yangi foydalanuvchimisiz? </span>
            <Link to="/register" className="login-register-cta">Ro'yxatdan o'tish</Link>
          </div>
        </form>
        {showError && (
          <div className="login-error-popup">
            {error}
            <button onClick={() => setShowError(false)} className="login-error-close">Yopish</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 