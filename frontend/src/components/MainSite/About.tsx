import React from 'react';

const About: React.FC = () => (
  <section className="about background" id="about">
    <div className="image">
      <img src="/images/about-img.png" alt="" />
    </div>
    <div className="content">
      <h3>Biz haqimizda</h3>
      <p>Bizning markazimizda har bir bola o‘zini erkin va baxtli his qiladi. Biz bolalarning ijodiy va intellektual rivojlanishi uchun barcha sharoitlarni yaratamiz.</p>
      <p>Jamoamiz tajribali o‘qituvchilar va tarbiyachilardan iborat bo‘lib, har bir bolaga individual yondashuvni kafolatlaydi. Farzandingiz biz bilan yangi bilim va ko‘nikmalarga ega bo‘ladi!</p>
      <a href="#" className="btn">Batafsil</a>
    </div>
  </section>
);

export default About; 