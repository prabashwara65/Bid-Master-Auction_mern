import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

// Card component to display user information
const BlankCard = ({ user }) => {
  return (
    <div className="card" style={{ width: '150px', margin: '5px' }}>
      <div className="card-body">
        <h5 className="card-title">{user.name}</h5>
        <p className="card-text">Basic Salary: ${user.basicSalary}</p>
        <p className="card-text">Bonus: ${user.bonus}</p>
        <p className="card-text">OT Hours: {user.otHours} hrs</p>
        <p className="card-text">OT Rate: ${user.otRate}/hr</p>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  // Sample user data
  const users = [
    { name: 'Alice', basicSalary: 50000, bonus: 5000, otHours: 10, otRate: 25 },
    { name: 'Bob', basicSalary: 55000, bonus: 6000, otHours: 5, otRate: 30 },
    { name: 'Charlie', basicSalary: 60000, bonus: 7000, otHours: 15, otRate: 20 },
    { name: 'David', basicSalary: 58000, bonus: 3000, otHours: 8, otRate: 28 },
    { name: 'Eva', basicSalary: 62000, bonus: 8000, otHours: 12, otRate: 22 },
  ];

  return (
    <div className="d-flex flex-wrap justify-content-center" style={{ margin: '20px 0' }}>
      {users.map((user, index) => (
        <BlankCard key={index} user={user} />
      ))}
    </div>
  );
};

export default App;
