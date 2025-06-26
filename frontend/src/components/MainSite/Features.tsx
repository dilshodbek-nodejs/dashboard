import React from 'react';

const Features: React.FC = () => (
  <section className="features up-and-down" id="features">
    <div className="box-container">
      <h3 className="title">why childrens love us</h3>
      <div className="box">
        <img src="/images/left-icon1.png" alt="" />
        <div className="info">
          <h3>funny conversations</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, dolor!</p>
        </div>
      </div>
      <div className="box">
        <img src="/images/left-icon2.png" alt="" />
        <div className="info">
          <h3>Many activities</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, dolor!</p>
        </div>
      </div>
      <div className="box">
        <img src="/images/left-icon3.png" alt="" />
        <div className="info">
          <h3>fun non-stop</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, dolor!</p>
        </div>
      </div>
    </div>
    <img className="stick" src="/images/stick.png" alt="" />
    <div className="box-container">
      <h3 className="title">why parents choose us</h3>
      <div className="box">
        <img src="/images/right-icon1.png" alt="" />
        <div className="info">
          <h3>Continuous monitoring</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, dolor!</p>
        </div>
      </div>
      <div className="box">
        <img src="/images/right-icon2.png" alt="" />
        <div className="info">
          <h3>Professionalism teachers</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, dolor!</p>
        </div>
      </div>
      <div className="box">
        <img src="/images/right-icon3.png" alt="" />
        <div className="info">
          <h3>Developed programs</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, dolor!</p>
        </div>
      </div>
    </div>
  </section>
);

export default Features; 