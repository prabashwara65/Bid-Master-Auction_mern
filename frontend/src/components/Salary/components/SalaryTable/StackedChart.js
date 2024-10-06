import React, { useState, useEffect } from 'react';
// eslint-disable-next-line
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 

// Employee API URL
const URL = "http://localhost:8070/employee"; 

const StackedChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(URL);
        const employees = response.data.employees;

        // Take the last 8 members without sorting
        // Get the last 8 members
        const lastEmployees = employees.slice(-8); 

        // Fetch salary data for the last 8 employees
        const salaryData = await Promise.all(
          lastEmployees.map(async (employee) => {
            try {
              const salaryResponse = await axios.get(`http://localhost:8070/salaries/get/${employee._id}`);
              const salary = salaryResponse.data.salary || {};
              return {
                name: employee.fullName,
                BasicSalary: salary.BasicSalary || 0, // Set to 0 if not available
                Bonus: salary.Bonus || 0, // Set to 0 if not available
                OT_Hours: salary.OTHours || 0, // Set to 0 if not available
                OT_Rate: salary.OTRate || 0, // Set to 0 if not available
              };
            } catch (error) {
              console.error(`Error fetching salary for employee ${employee._id}:`, error);
              return {
                name: employee.fullName,
                BasicSalary: 0,
                Bonus: 0,
                OT_Hours: 0,
                OT_Rate: 0,
              };
            }
          })
        );

        setData(salaryData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="container mt-1">
      <h3 className="text-center mb-4">User Salary and OT Analysis</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={220}> 
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="BasicSalary" stackId="a" fill="#8884d8" />
            <Bar dataKey="Bonus" stackId="a" fill="#82ca9d" />
            <Bar dataKey="OT_Hours" stackId="a" fill="#ffc658" />
            <Bar dataKey="OT_Rate" stackId="a" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StackedChart;
