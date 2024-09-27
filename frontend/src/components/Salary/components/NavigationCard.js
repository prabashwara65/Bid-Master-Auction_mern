import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const NavigationCard = () => {
  return (
    <div className="card text-center mx-auto my-4" style={{ width: '18rem' , height: '245px'}}>
      <div className="card-body">
        <div className="d-flex flex-column">
          <a href="/addsalary" className="btn btn-primary mb-2">Add Salary</a>
          <a href="/updatesalary" className="btn btn-secondary mb-2">Update Salary</a>
          <a href="/viewreport" className="btn btn-info">View Report</a>
        </div>
      </div>
    </div>
  );
};

export default NavigationCard;
