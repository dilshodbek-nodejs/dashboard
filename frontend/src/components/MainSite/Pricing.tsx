import React from 'react';

const Pricing: React.FC = () => (
  <section className="pricing up-and-down" id="pricing">
    <h1 className="heading">our pricing plans</h1>
    <div className="box-container">
      <div className="box" style={{ background: 'url(/images/card-bg1.png) no-repeat' }}>
        <h3>weekly</h3>
        <div className="price"><span>$</span>20</div>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem magnam rem harum, nostrum facilis labore excepturi dignissimos? Voluptatibus facere beatae quam quasi! Vero fugit molestias officiis quam, corrupti earum aliquid?</p>
        <a href="#" className="btn">select plan</a>
      </div>
      <div className="box" style={{ background: 'url(/images/card-bg2.png) no-repeat' }}>
        <span className="choise">best <br /> choise</span>
        <h3>monthly</h3>
        <div className="price"><span>$</span>50</div>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem magnam rem harum, nostrum facilis labore excepturi dignissimos? Voluptatibus facere beatae quam quasi! Vero fugit molestias officiis quam, corrupti earum aliquid?</p>
        <a href="#" className="btn">select plan</a>
      </div>
      <div className="box" style={{ background: 'url(/images/card-bg3.png) no-repeat' }}>
        <h3>yearly</h3>
        <div className="price"><span>$</span>250</div>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem magnam rem harum, nostrum facilis labore excepturi dignissimos? Voluptatibus facere beatae quam quasi! Vero fugit molestias officiis quam, corrupti earum aliquid?</p>
        <a href="#" className="btn">select plan</a>
      </div>
    </div>
  </section>
);

export default Pricing; 