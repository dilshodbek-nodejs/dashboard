import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './main-site.css';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-bg-photo">
      <div className="login-main-card login-main-card-solid">
        <img src="/logo.png" alt="logo" className="login-logo" />
        <h2 className="login-heading">Kirish</h2>
        <form className="login-form">
          <div className="login-form-group">
            <label className="login-label">Foydalanuvchi nomi</label>
            <input type="text" className="login-input" placeholder="Foydalanuvchi nomi" required />
          </div>
          <div className="login-form-group login-password-group">
            <label className="login-label">Parol</label>
            <input type={showPassword ? 'text' : 'password'} className="login-input" placeholder="Parol" required />
            <button type="button" onClick={() => setShowPassword(v => !v)} className={`login-show-password-btn${showPassword ? ' active' : ''}`} aria-label="Show password">
              <span style={{fontSize: '2.1rem', lineHeight: 1}}>{showPassword ? '🙈' : '👁️'}</span>
            </button>
          </div>
          <button type="submit" className="login-btn login-btn-main">Kirish</button>
          <div className="login-register-link">
            <span>Yangi foydalanuvchimisiz? </span>
            <Link to="/register" className="login-register-cta">Ro'yxatdan o'tish</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 