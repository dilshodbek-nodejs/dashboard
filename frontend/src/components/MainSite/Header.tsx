import React, { useState } from 'react';

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
        <a href="#features" onClick={handleNavClick}>Tarbiya uchun</a>
        <a href="#about" onClick={handleNavClick}>O'yinlar</a>
        <a href="#services" onClick={handleNavClick}>Fanlar</a>
        <a href="/quiz" onClick={handleNavClick}>Testlar</a>
        <a href="#pricing" onClick={handleNavClick}>Galereya</a>
        <a href="#contact" onClick={handleNavClick}>Aloqa</a>
      </nav>
    </header>
  );
};

export default Header; 