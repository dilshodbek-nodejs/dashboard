import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [user, setUser] = useState<{ avatar?: string; username?: string } | null>(null);

  const handleMenuClick = () => {
    setMenuActive((prev) => !prev);
  };

  const handleNavClick = () => {
    setMenuActive(false);
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      fetch('/api/profile/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setUser({
            avatar: data.avatar || '/logo.png',
            username: data.username || 'Profile',
          });
        })
        .catch(() => {
          setUser({ avatar: '/logo.png', username: 'Profile' });
        });
    } else {
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setMenuActive(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasToken = !!getCookie('token');

  return (
    <header className={hasToken ? '' : 'navbar-tall'}>
      <a href="#" className="logo">
        <img src="/logo.png" alt="logo" />
      </a>
      <div
        id="menu-bars"
        className={`hamburger-menu${menuActive ? ' active' : ''}`}
        onClick={handleMenuClick}
        style={{ 
          cursor: 'pointer',
          width: '30px',
          height: '30px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          padding: '0'
        }}
      >
        <span style={{
          width: '100%',
          height: '3px',
          background: '#333',
          borderRadius: '2px',
          transition: 'all 0.3s ease',
          transform: menuActive ? 'rotate(45deg) translate(5px, 5px)' : 'rotate(0deg)'
        }}></span>
        <span style={{
          width: '100%',
          height: '3px',
          background: '#333',
          borderRadius: '2px',
          transition: 'all 0.3s ease',
          opacity: menuActive ? '0' : '1'
        }}></span>
        <span style={{
          width: '100%',
          height: '3px',
          background: '#333',
          borderRadius: '2px',
          transition: 'all 0.3s ease',
          transform: menuActive ? 'rotate(-45deg) translate(7px, -6px)' : 'rotate(0deg)'
        }}></span>
      </div>
      <nav className={`navbar${menuActive ? ' active' : ''}`}>
        <a href="#home" onClick={handleNavClick}>Bosh sahifa</a>
        <a href="#features" onClick={handleNavClick}>Nega biz?</a>
        <a href="#about" onClick={handleNavClick}>O'yinlar</a>
        <a href="#services" onClick={handleNavClick}>Fanlar</a>
        <a href="/quiz" onClick={handleNavClick}>Testlar</a>
        <Link to="/blog" onClick={handleNavClick}>Tarbiya uchun</Link>
        <a href="#contact" onClick={handleNavClick}>Aloqa</a>
        <Link to="/ranks">Reyting</Link>
        { !getCookie('token') && (
          <Link to="/login" className="btn" style={{marginLeft: '2rem'}} onClick={handleNavClick}>Kirish</Link>
        )}
      </nav>
      {user && (
        <Link to="/me" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '2rem', textDecoration: 'none' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: '2px solid #f53b57', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={user.avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          </div>
          <span style={{ fontSize: 14, color: '#f53b57', marginTop: 4, fontWeight: 600 }}>Profile</span>
        </Link>
      )}
    </header>
  );
};

export default Header; 