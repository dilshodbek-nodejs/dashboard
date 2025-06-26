import React from 'react';
import Header from './Header';
import Home from './Home';
import Features from './Features';
import About from './About';
import Services from './Services';
import Teachers from './Teachers';
import Blogs from './Blogs';
import Pricing from './Pricing';
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
    <Teachers />
    <Blogs />
    <Pricing />
    <Contact />
    <Footer />
  </>
);

export default MainSiteApp; 