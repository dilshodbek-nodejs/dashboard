import React from 'react';

const Services: React.FC = () => (
  <section className="services up-and-down" id="services">
    <h1 className="heading"> Bolalaringizga nimalarni o‘rgatamiz </h1>
    <div className="box-container">
      <div className="box">
        <img src="/images/s1.jpg" alt="" />
        <div className="info">
          <h3>So‘z va harflarni o‘rgatish</h3>
        </div>
      </div>
      <div className="box">
        <img src="/images/s2.jpg" alt="" />
        <div className="info">
          <h3>Loy va hunarmandchilik</h3>
        </div>
      </div>
      <div className="box">
        <img src="/images/s3.jpg" alt="" />
        <div className="info">
          <h3>Rasm chizish darslari</h3>
        </div>
      </div>
      <div className="box">
        <img src="/images/s4.jpg" alt="" />
        <div className="info">
          <h3>Ingliz tili darslari</h3>
        </div>
      </div>
      <div className="box">
        <img src="/images/s5.jpg" alt="" />
        <div className="info">
          <h3>Bolalar uchun o‘yingoh</h3>
        </div>
      </div>
      <div className="box">
        <img src="/images/s6.jpg" alt="" />
        <div className="info">
          <h3>Sport tadbirlari</h3>
        </div>
      </div>
    </div>
  </section>
);

export default Services; 