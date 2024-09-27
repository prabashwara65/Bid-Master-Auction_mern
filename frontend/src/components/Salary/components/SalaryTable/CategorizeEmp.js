import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const URL = "http://localhost:8070/employee"; // Employee API URL

function EmployeeRoleCategorizer() {
  const [employees, setEmployees] = useState([]);
  const [roleCounts, setRoleCounts] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(URL);
        setEmployees(response.data.employees);
        categorizeRoles(response.data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const categorizeRoles = (employees) => {
    const counts = {};

    employees.forEach((employee) => {
      const role = employee.jobTitle;
      counts[role] = counts[role] ? counts[role] + 1 : 1;
    });

    setRoleCounts(counts);
  };

  return (
    <div className="container d-flex justify-content-center mt-4">
      <div className="text-center">
        <h1 className="mb-4">Employee Roles</h1>
        <div className="card" style={{ height: '200px', overflowY: 'auto', width: '300px' }}>
          <div className="card-body">
            {Object.entries(roleCounts).length > 0 ? (
              <ul className="list-group">
                {Object.entries(roleCounts).map(([role, count]) => (
                  <li className="list-group-item" key={role}>
                    <span className="fw-bold">{role}</span>: {count} 
                  </li>
                ))}
              </ul>
            ) : (
              <div className="alert alert-info text-center" role="alert">
                No employee data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeRoleCategorizer;
