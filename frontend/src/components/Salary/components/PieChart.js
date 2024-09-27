// PieChart.js
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const PieChart = ({ employeeName, data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Basic Salary', 'Bonus', 'OT Pay', 'OT Rate'],
        datasets: [
          {
            label: `Salary Breakdown for ${employeeName}`,
            data: [
              data.basicSalary,
              data.bonus,
              data.otHours * data.otRate, // Total OT Pay
              data.otRate,
            ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `Salary Breakdown for ${employeeName}`,
          },
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, [data, employeeName]);

  return <canvas ref={chartRef} />;
};

export default PieChart;
