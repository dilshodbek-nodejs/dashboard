import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);

  const handleMenuClick = () => {
    setMenuActive((prev) => !prev);
  };

  const handleNavClick = () => {
    setMenuActive(false);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setMenuActive(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
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
        <Link to="/login" className="btn" style={{marginLeft: '2rem'}} onClick={handleNavClick}>Kirish</Link>
      </nav>
    </header>
  );
};

export default Header; 