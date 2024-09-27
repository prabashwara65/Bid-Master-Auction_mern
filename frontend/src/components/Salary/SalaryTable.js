import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

// Card component to display user information
const BlankCard = ({ title, content }) => {
  return (
    <div className="card" style={{ width: '150px', margin: '5px' }}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{content}</p>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  // Sample user data
  const user = {
    name: 'Alice',
    basicSalary: 50000,
    bonus: 5000,
    otHours: 10,
    otRate: 25,
  };

  return (
    <div className="d-flex flex-wrap justify-content-center" style={{ margin: '20px 0' }}>
      <BlankCard title="User Name" content={user.name} />
      <BlankCard title="Basic Salary" content={`$${user.basicSalary}`} />
      <BlankCard title="Bonus" content={`$${user.bonus}`} />
      <BlankCard title="OT Hours" content={`${user.otHours} hrs`} />
      <BlankCard title="OT Rate" content={`$${user.otRate}/hr`} />
    </div>
  );
};

export default App;
