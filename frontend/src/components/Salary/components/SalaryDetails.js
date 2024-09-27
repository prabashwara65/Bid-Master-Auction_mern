import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

// Card component to display individual user details
const DetailCard = ({ title, value }) => {
  return (
    <div className="card text-center" style={{ width: '150px', margin: '5px' }}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{value}</p>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  // Sample user data
  const users = [
    { name: 'Alice', basicSalary: 50000, bonus: 5000, otHours: 10, otRate: 25 },
  ];

  return (
    <div className="d-flex flex-wrap justify-content-center" style={{ margin: '20px 0' }}>
      {users.map((user, index) => (
        <React.Fragment key={index}>
          <DetailCard title="Name" value={user.name} />
          <DetailCard title="Basic Salary" value={`$${user.basicSalary}`} />
          <DetailCard title="Bonus" value={`$${user.bonus}`} />
          <DetailCard title="OT Hours" value={`${user.otHours} hrs`} />
          <DetailCard title="OT Rate" value={`$${user.otRate}/hr`} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default App;
