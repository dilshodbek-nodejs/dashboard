import React from 'react';

const Features: React.FC = () => (
  <section className="features up-and-down" id="features">
    <div className="box-container">
      <h3 className="title">Nega bolalar bizni yaxshi ko‘radi</h3>
      <div className="box">
        <img src="/images/left-icon1.png" alt="" />
        <div className="info">
          <h3>Qiziqarli suhbatlar</h3>
          <p>Bolalarimiz har kuni yangi do‘stlar bilan qiziqarli suhbatlar qurishadi.</p>
        </div>
      </div>
      <div className="box">
        <img src="/images/left-icon2.png" alt="" />
        <div className="info">
          <h3>Ko‘plab faoliyatlar</h3>
          <p>Har bir bola uchun mos va foydali mashg‘ulotlar muntazam tashkil etiladi.</p>
        </div>
      </div>
      <div className="box">
        <img src="/images/left-icon3.png" alt="" />
        <div className="info">
          <h3>To‘xtovsiz o‘yin-kulgi</h3>
          <p>O‘yin va dam olish uchun zamonaviy va xavfsiz muhit yaratilgan.</p>
        </div>
      </div>
    </div>
    <img className="stick" src="/images/stick.png" alt="" />
    <div className="box-container">
      <h3 className="title">Nega ota-onalar bizni tanlaydi</h3>
      <div className="box">
        <img src="/images/right-icon1.png" alt="" />
        <div className="info">
          <h3>Doimiy nazorat</h3>
          <p>Har bir bola doimiy pedagogik va tibbiy nazorat ostida bo‘ladi.</p>
        </div>
      </div>
      <div className="box">
        <img src="/images/right-icon2.png" alt="" />
        <div className="info">
          <h3>Professional o‘qituvchilar</h3>
          <p>O‘z ishining ustasi bo‘lgan, mehribon va tajribali o‘qituvchilar jamoasi.</p>
        </div>
      </div>
      <div className="box">
        <img src="/images/right-icon3.png" alt="" />
        <div className="info">
          <h3>Rivojlangan dasturlar</h3>
          <p>Bolalar uchun zamonaviy va innovatsion o‘quv dasturlari joriy etilgan.</p>
        </div>
      </div>
    </div>
  </section>
);

export default Features; 