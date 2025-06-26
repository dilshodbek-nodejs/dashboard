import React from 'react';

const Services: React.FC = () => (
  <section className="services up-and-down" id="services">
    <h1 className="heading"> what we teach your childrens </h1>
    <div className="box-container">
      <div className="box">
        <img src="/images/s1.jpg" alt="" />
        <div className="info">
          <h3>words and letters teaching</h3>
        </div>
      </div>
      <div className="box">
        <img src="/images/s2.jpg" alt="" />
        <div className="info">
          <h3>clay and crafting</h3>
        </div>
      </div>
      <div className="box">
        <img src="/images/s3.jpg" alt="" />
        <div className="info">
          <h3>drawing classes</h3>
        </div>
      </div>
      <div className="box">
        <img src="/images/s4.jpg" alt="" />
        <div className="info">
          <h3>english classes</h3>
        </div>
      </div>
      <div className="box">
        <img src="/images/s5.jpg" alt="" />
        <div className="info">
          <h3>playground for childrens</h3>
        </div>
      </div>
      <div className="box">
        <img src="/images/s6.jpg" alt="" />
        <div className="info">
          <h3>sports events</h3>
        </div>
      </div>
    </div>
  </section>
);

export default Services; 