import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components for the line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CashLineChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch data for income, expenses, and petty cash
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8070/cash');
        const data = response.data.cash;

        // Process the data for the chart
        const incomeData = [];
        const expensesData = [];
        const pettyCashData = [];
        const dates = [];

        data.forEach((item) => {
          const formattedDate = new Date(item.date).toISOString().split('T')[0];
          if (!dates.includes(formattedDate)) {
            dates.push(formattedDate);
          }

          if (item.cashType === 'Income') {
            incomeData.push({ date: formattedDate, amount: item.amount });
          } else if (item.cashType === 'Expense') {
            expensesData.push({ date: formattedDate, amount: item.amount });
          } else if (item.cashType === 'Peti Cash') {
            pettyCashData.push({ date: formattedDate, amount: item.amount });
          }
        });

        const incomeAmounts = dates.map((date) => {
          const entry = incomeData.find((item) => item.date === date);
          return entry ? entry.amount : 0;
        });

        const expensesAmounts = dates.map((date) => {
          const entry = expensesData.find((item) => item.date === date);
          return entry ? entry.amount : 0;
        });

        const pettyCashAmounts = dates.map((date) => {
          const entry = pettyCashData.find((item) => item.date === date);
          return entry ? entry.amount : 0;
        });

        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'Income',
              data: incomeAmounts,
              borderColor: 'green',
              backgroundColor: 'rgba(0, 255, 0, 0.2)',
              tension: 0.4,
            },
            {
              label: 'Expenses',
              data: expensesAmounts,
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              tension: 0.4,
            },
            {
              label: 'Peti Cash',
              data: pettyCashAmounts,
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
              tension: 0.4,
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cash data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="" >
          <div>
            {loading ? (
              <p>Loading chart...</p>
            ) : (
              <div style={{  height: '350px', width: '40%' }}>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Income, Expenses, and Petty Cash Over Time',
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Date',
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Amount (Rs)',
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashLineChart;
