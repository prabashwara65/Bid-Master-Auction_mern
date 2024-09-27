import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

// Card component to display individual user details
const DetailCard = ({ title, value }) => {
  return (
    <div className="card text-center" style={{ width: '170px', margin: '5px', height: '100px' }}>
      <div className="card-body d-flex justify-content-center align-items-center" style={{ flexDirection: 'column' }}>
        <h5 className="card-title" style={{ display: 'inline' }}>{title}</h5>
        <span className="card-text" style={{ display: 'inline', marginLeft: '5px' }}>{value}</span>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  // Sample user data
  const users = [
    { name: 'Alice', basicSalary: 50000, bonus: 5000, otHours: 10, otRate: 25 },
    // Add more users if needed
  ];

  return (
    <div className="d-flex justify-content-center flex-wrap" style={{ margin: '10px 0', gap: '10px'}}>
      {users.map((user, index) => (
        <React.Fragment key={index}>
          <DetailCard title="Name:" value={user.name} />
          <DetailCard title="B-Salary:" value={`$${user.basicSalary}`} />
          <DetailCard title="Bonus:" value={`$${user.bonus}`} />
          <DetailCard title="OT Hours:" value={`${user.otHours} hrs`} />
          <DetailCard title="OT Rate:" value={`$${user.otRate}/hr`} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default App;
