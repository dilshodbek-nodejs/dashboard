import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';

const Contact: React.FC = () => (
  <section className="contact background" id="contact">
    <div className="row">
      <div className="contact-info">
        <div className="box">
          <h3 className="title">Bizni kuzatib boring</h3>
          <div className="social-icons-container">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-link inline-block mr-6 hover:text-blue-600 transition-colors text-gray-700">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-link inline-block mr-6 hover:text-blue-400 transition-colors text-gray-700">
              <Twitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link inline-block mr-6 hover:text-pink-600 transition-colors text-gray-700">
              <Instagram size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" className="social-icon-link inline-block hover:text-blue-700 transition-colors text-gray-700">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
        <div className="box">
          <h3 className="title">Yangiliklar byulleteni</h3>
          <form action="">
            <input type="email" placeholder="Emailingizni kiriting" />
            <input type="submit" className="btn" value="Yuborish" />
          </form>
        </div>
      </div>
      <form action="" className="contact-form">
        <h3>Biz bilan bog'laning</h3>
        <input type="text" placeholder="Ism" className="box" />
        <input type="email" placeholder="Email" className="box" />
        <input type="number" placeholder="Telefon raqami" className="box" />
        <textarea placeholder="Xabar" className="box message" name="" id="" cols={30} rows={10}></textarea>
        <input type="submit" className="btn" value="Xabar yuborish" />
      </form>
    </div>
    <div className="image">
      <img src="/images/contact-img.png" alt="" />
    </div>
  </section>
);

export default Contact; 