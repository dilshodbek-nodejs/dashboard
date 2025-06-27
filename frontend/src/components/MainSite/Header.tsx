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
        className={`fas fa-bars${menuActive ? ' fa-times' : ''}`}
        onClick={handleMenuClick}
        style={{ cursor: 'pointer' }}
      ></div>
      <nav className={`navbar${menuActive ? ' active' : ''}`}>
        <a href="#home" onClick={handleNavClick}>Bosh sahifa</a>
        <a href="#features" onClick={handleNavClick}>Nega biz?</a>
        <a href="#about" onClick={handleNavClick}>O'yinlar</a>
        <a href="#services" onClick={handleNavClick}>Fanlar</a>
        <a href="/quiz" onClick={handleNavClick}>Testlar</a>
        <Link to="/blog" onClick={handleNavClick}>Tarbiya uchun</Link>
        <a href="#contact" onClick={handleNavClick}>Aloqa</a>
      </nav>
    </header>
  );
};

export default Header; 