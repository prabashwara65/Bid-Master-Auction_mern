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

// Sample data for the chart
const data = [
  {
    name: 'User 1',
    BasicSalary: 4000,
    Bonus: 1000,
    OT_Hours: 200,
    OT_Rate: 25,
  },
];

const StackedChart = () => {
  return (
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
  );
};

export default StackedChart;
