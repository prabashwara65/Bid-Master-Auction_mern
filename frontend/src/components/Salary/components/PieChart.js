import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register the necessary components for Chart.js
Chart.register(...registerables);

const PieChart = ({ data }) => {
  const chartRef = useRef(null); // Create a ref for the chart instance

  useEffect(() => {
    // Get the context of the canvas element
    const ctx = chartRef.current.getContext('2d');

    // Create the chart instance
    const chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Basic Salary', 'Bonus', 'OT Pay', 'OT Rate'], // Labels for pie sections
        datasets: [
          {
            label: 'Salary Breakdown',
            data: [
              data.basicSalary,
              data.bonus,
              data.otHours * data.otRate, // Total OT Pay
              data.otRate
            ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)', // Basic Salary
              'rgba(54, 162, 235, 0.6)', // Bonus
              'rgba(255, 206, 86, 0.6)', // OT Pay
              'rgba(153, 102, 255, 0.6)', // OT Rate
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
            text: 'Salary Breakdown for ' + data.name,
          },
        },
      },
    });

    // Cleanup function to destroy the chart instance
    return () => {
      chartInstance.destroy();
    };
  }, [data]);

  return (
    <div className="card p-3 mb-4"> {/* Bootstrap card for styling */}
      <div className="card-body">
        <canvas ref={chartRef} style={{ height: '400px', width: '100%' }} />
      </div>
    </div>
  );
};

export default PieChart;
