import React from 'react';

const Contact: React.FC = () => (
  <section className="contact background" id="contact">
    <div className="row">
      <div className="contact-info">
        <div className="box">
          <h3 className="title">Aloqa ma’lumotlari</h3>
          <p> <i className="fas fa-map-marker-alt"></i> mumbai, india - 400104. </p>
          <p> <i className="fas fa-envelope"></i> example@gmail.com </p>
          <p> <i className="fas fa-phone"></i> +123-456-7890 </p>
        </div>
        <div className="box">
          <h3 className="title">Bizni kuzatib boring</h3>
          <a href="#" className="fab fa-facebook-f"></a>
          <a href="#" className="fab fa-twitter"></a>
          <a href="#" className="fab fa-instagram"></a>
          <a href="#" className="fab fa-linkedin"></a>
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
        <h3>Biz bilan bog‘laning</h3>
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