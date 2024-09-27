import React from 'react';
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
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

// Sample data for the chart
const data = [
  {
    name: 'User 1',
    BasicSalary: 4000,
    Bonus: 1000,
    OT_Hours: 200,
    OT_Rate: 25,
  },
  {
    name: 'User 2',
    BasicSalary: 4000,
    Bonus: 100,
    OT_Hours: 800,
    OT_Rate: 25,
  },
  {
    name: 'User 3',
    BasicSalary: 9000,
    Bonus: 1000,
    OT_Hours: 200,
    OT_Rate: 25,
  },
  {
    name: 'User 4',
    BasicSalary: 4000,
    Bonus: 1000,
    OT_Hours: 20,
    OT_Rate: 25,
  },
];

const StackedChart = () => {
  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">User Salary and OT Analysis</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
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
