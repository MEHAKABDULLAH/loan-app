import React from 'react';
import '../index.css'; // Make sure styles are defined here
import LoanCalculator from './LoanCalculator';

const Home = () => {
  return (
    <div>
    <div className="home-container" style={{ padding: "40px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "10px", color: "#1890ff" }}>Saylani App</h1>
      <p style={{ fontSize: "1.2rem", color: "#555" }}>
        Your trusted companion our smart services and solutions
      </p>
      </div>
      {/* Spacer to push LoanCalculator down */}
      <div style={{ marginTop: "70px" }}>
        <LoanCalculator />
      </div> </div>
    
  );
};

export default Home;
