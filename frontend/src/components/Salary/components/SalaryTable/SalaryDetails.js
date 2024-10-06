import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 

// Card component to display individual user details
const DetailCard = ({ title, value }) => {
  return (
    <div className="card text-start border border-dark" style={{ width: '170px', margin: '5px', height: '100px' }}>
      <div className="card-body d-flex justify-content-start align-items-left" style={{ flexDirection: 'column' }}>
        <h5 className="card-title" style={{ margin: '0' }}>{title}</h5>
        <span className="card-text">{value}</span>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  const [employees, setEmployees] = useState([]); 
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(''); 
  const [employeeDetails, setEmployeeDetails] = useState({}); 

  // Fetch employee list from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8070/employee");
        setEmployees(response.data.employees); 
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch details for the selected employee
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (selectedEmployeeId) {
        try {
          const response = await axios.get(`http://localhost:8070/salaries/get/${selectedEmployeeId}`);
          setEmployeeDetails(response.data.salary); 
        } catch (error) {
          console.error('Error fetching employee details:', error);
        }
      } else {
        // Reset details if no employee is selected
        setEmployeeDetails({}); 
      }
    };
    fetchEmployeeDetails();
  }, [selectedEmployeeId]);

  return (
    <div className="d-flex flex-column align-items-center" style={{ margin: '10px 0' }}>
      <div>
        <select onChange={(e) => setSelectedEmployeeId(e.target.value)} className="form-select mb-3">
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>{employee.fullName}</option> 
          ))}
        </select>
      </div>

      {/* Flex row for detail cards */}
      <div className="d-flex flex-row" style={{ gap: '10px' }}>
        <DetailCard title="B-Salary:" value={`Rs:${employeeDetails.BasicSalary ? employeeDetails.BasicSalary.toFixed(2) : 'N/A'}`} />
        <DetailCard title="Bonus:" value={`Rs:${employeeDetails.Bonus ? employeeDetails.Bonus.toFixed(2) : 'N/A'}`} />
        <DetailCard title="OT Hours:" value={`${employeeDetails.OTHours || 'N/A'} hrs`} />
        <DetailCard title="OT Rate:" value={`Rs:${employeeDetails.OTRate ? employeeDetails.OTRate.toFixed(2) : 'N/A'}/hr`} />
        <DetailCard title="TotSalary:" value={`Rs:${employeeDetails.TotalSalary ? employeeDetails.TotalSalary.toFixed(2) : 'N/A'}`} />
      </div>
    </div>
  );
};

export default App;
