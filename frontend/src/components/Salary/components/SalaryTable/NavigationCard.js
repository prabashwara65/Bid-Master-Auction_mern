import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const NavigationCard = () => {
  return (
    <div className="card text-center mx-auto bg-dark text-white" style={{ width: '17rem', height: '220px' }}>
      <div className="card-body d-flex flex-column justify-content-center align-items-center">
        <a href="/addsalary" className="btn btn-outline-light mb-2" style={{ width: '100%' }}>Salary Table</a>
        <a href="/updatesalary" className="btn btn-outline-secondary mb-2" style={{ width: '100%' }}>Cash Form</a>
        <a href="/viewreport" className="btn btn-outline-info" style={{ width: '100%' }}>Cash Table</a>
      </div>
    </div>
  );
};

export default NavigationCard;
