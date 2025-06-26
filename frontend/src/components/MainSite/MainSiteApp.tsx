import React from 'react';
import Header from './Header';
import Home from './Home';
import Features from './Features';
import About from './About';
import Services from './Services';
import Blogs from './Blogs';
import Contact from './Contact';
import Footer from './Footer';
import './main-site.css';

const MainSiteApp: React.FC = () => (
  <>
    <Header />
    <Home />
    <Features />
    <About />
    <Services />
    <Blogs />
    <Contact />
    <Footer />
  </>
);

export default MainSiteApp; 