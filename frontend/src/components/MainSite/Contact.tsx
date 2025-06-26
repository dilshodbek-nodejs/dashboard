import React from 'react';

const Contact: React.FC = () => (
  <section className="contact background" id="contact">
    <div className="row">
      <div className="contact-info">
        <div className="box">
          <h3 className="title">contact details</h3>
          <p> <i className="fas fa-map-marker-alt"></i> mumbai, india - 400104. </p>
          <p> <i className="fas fa-envelope"></i> example@gmail.com </p>
          <p> <i className="fas fa-phone"></i> +123-456-7890 </p>
        </div>
        <div className="box">
          <h3 className="title">follow us</h3>
          <a href="#" className="fab fa-facebook-f"></a>
          <a href="#" className="fab fa-twitter"></a>
          <a href="#" className="fab fa-instagram"></a>
          <a href="#" className="fab fa-linkedin"></a>
        </div>
        <div className="box">
          <h3 className="title">newsletter</h3>
          <form action="">
            <input type="email" placeholder="enter your email" />
            <input type="submit" className="btn" value="send" />
          </form>
        </div>
      </div>
      <form action="" className="contact-form">
        <h3>contact us</h3>
        <input type="text" placeholder="name" className="box" />
        <input type="email" placeholder="email" className="box" />
        <input type="number" placeholder="number" className="box" />
        <textarea placeholder="message" className="box message" name="" id="" cols={30} rows={10}></textarea>
        <input type="submit" className="btn" value="send message" />
      </form>
    </div>
    <div className="image">
      <img src="/images/contact-img.png" alt="" />
    </div>
  </section>
);

export default Contact; 