import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const PieChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchEmployeeSalaries = async () => {
      try {
        const employeeResponse = await axios.get("http://localhost:8070/employee");
        const employees = employeeResponse.data.employees;

        // Fetch salary data for all employees
        const salaryData = await Promise.all(
          employees.map(async (employee) => {
            try {
              const salaryResponse = await axios.get(
                `http://localhost:8070/salaries/get/${employee._id}`
              );
              const salary = salaryResponse.data.salary || {};
              return {
                BasicSalary: salary.BasicSalary || 0,
                Bonus: salary.Bonus || 0,
                OT_Hours: salary.OTHours || 0,
                OT_Rate: salary.OTRate || 0,
              };
            } catch (error) {
              console.error(`Error fetching salary for employee ${employee._id}:`, error);
              return {
                BasicSalary: 0,
                Bonus: 0,
                OT_Hours: 0,
                OT_Rate: 0,
              };
            }
          })
        );

        // Aggregate salary data
        const aggregatedData = salaryData.reduce(
          (acc, curr) => {
            acc.BasicSalary += curr.BasicSalary;
            acc.Bonus += curr.Bonus;
            acc.OT_Hours += curr.OT_Hours;
            acc.OT_Rate += curr.OT_Rate;
            return acc;
          },
          { BasicSalary: 0, Bonus: 0, OT_Hours: 0, OT_Rate: 0 }
        );

        setData(aggregatedData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployeeSalaries();
  }, []);

  useEffect(() => {
    if (data) {
      const ctx = chartRef.current.getContext('2d');
      const chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Basic Salary', 'Bonus', 'OT Pay', 'OT Rate'],
          datasets: [
            {
              label: 'Salary Breakdown',
              data: [
                data.BasicSalary,
                data.Bonus,
                data.OT_Hours * data.OT_Rate, 
                data.OT_Rate,
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
              text: 'Salary Breakdown',
            },
          },
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, [data]);

  return (
    <div>
      {data ? (
        <canvas ref={chartRef} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PieChart;
