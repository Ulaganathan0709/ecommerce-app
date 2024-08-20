import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="header">
        <h1>Online Shopping</h1>
        <p>Buying has become even easier</p>
        <Link to="/products" className="shop-now-btn">Shop Now</Link>
      </div>
    </div>
  );
};

export default Home;
