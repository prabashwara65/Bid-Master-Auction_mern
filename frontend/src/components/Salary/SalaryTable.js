import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import Nav from '../Nav'; // Assuming Nav component is already present
import { Link } from 'react-router-dom';

const URL = "http://localhost:8070/employee"; // Employee API URL

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function SalaryTable() {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await fetchHandler();
      setEmployees(data.employees);
      const salariesData = await Promise.all(
        data.employees.map(async (employee) => {
          try {
            const response = await axios.get(`http://localhost:8070/salaries/get/${employee._id}`);
            return { employeeId: employee._id, salary: response.data.salary };
          } catch (error) {
            console.error(`Error fetching salary for employee ${employee._id}:`, error);
            return { employeeId: employee._id, salary: null };
          }
        })
      );
      const salaryMap = {};
      salariesData.forEach((item) => {
        salaryMap[item.employeeId] = item.salary;
      });
      setSalaries(salaryMap);
    };

    fetchEmployees();
  }, []);

  const handleDeleteSalary = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:8070/salaries/${employeeId}`);
      setSalaries((prevSalaries) => ({
        ...prevSalaries,
        [employeeId]: null,
      }));
    } catch (error) {
      console.error(`Error deleting salary for employee ${employeeId}:`, error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenerateReport = (employee, salary) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Salary Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Full Name: ${employee.fullName}`, 14, 40);
    doc.text(`Email: ${employee.email}`, 14, 50);
    doc.text(`Job Title: ${employee.jobTitle}`, 14, 60);
    if (salary) {
      doc.text(`Basic Salary: Rs. ${salary.BasicSalary.toFixed(2)}`, 14, 90);
      doc.text(`Bonus: Rs. ${salary.Bonus.toFixed(2)}`, 14, 100);
      doc.text(`OT Hours: ${salary.OTHours}`, 14, 110);
      doc.text(`OT Rate: Rs. ${salary.OTRate.toFixed(2)}`, 14, 120);
      doc.text(`Total Salary: Rs. ${salary.TotalSalary.toFixed(2)}`, 14, 130);
    } else {
      doc.text(`Total Salary: N/A`, 14, 90);
    }
    doc.save(`${employee.fullName}_Salary_Report.pdf`);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Nav /> {/* Assuming a Nav component exists */}
      <div className="container mt-5">
        <h1>Employee Salaries</h1>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="row">
          {filteredEmployees.map((employee) => (
            <div className="col-md-6" key={employee._id}>
              {/* Card with Avatar, Salary Information, and Actions */}
              <div className="card mb-3 shadow-sm">
                <div className="row g-0">
                  {/* Avatar on the left side */}
                  <div className="col-md-3 d-flex align-items-center justify-content-center">
                    {/* Using robohash for random avatars */}
                    <img
                      src={`https://robohash.org/${employee.email}.png?size=100x100`}
                      className="img-fluid rounded-circle"
                      alt="Profile Icon"
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body d-flex flex-column justify-content-center">
                      <h5 className="card-title mb-1 text-start">{employee.fullName}</h5>
                      <p className="card-text mb-1 text-start"><strong>Email:</strong> {employee.email}</p>
                      <p className="card-text mb-1 text-start"><strong>Job Title:</strong> {employee.jobTitle}</p>
                      <p className="card-text mb-1 text-start">
                        <strong>Total Salary:</strong> {salaries[employee._id] ? `Rs. ${salaries[employee._id].TotalSalary.toFixed(2)}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12 d-flex justify-content-end align-items-center p-3">
                    <div className="btn-group">
                      <Link
                        to={`/addsalary/${employee._id}`}
                        className={`btn btn-outline-primary btn-sm me-2 ${salaries[employee._id] ? 'disabled' : ''}`}
                      >
                        <i className="fas fa-plus-circle"></i> Add Salary
                      </Link>
                      <Link to={`/updatesalary/${employee._id}`} className="btn btn-outline-secondary btn-sm me-2">
                        <i className="fas fa-edit"></i> Update
                      </Link>
                      {salaries[employee._id] && (
                        <>
                          <button onClick={() => handleDeleteSalary(employee._id)} className="btn btn-outline-danger btn-sm me-2">
                            <i className="fas fa-trash"></i>
                          </button>
                          <button onClick={() => handleGenerateReport(employee, salaries[employee._id])} className="btn btn-outline-info btn-sm">
                            <i className="fas fa-download"></i> Download Report
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SalaryTable;
