import React from 'react';
import Nav from '../Nav2/Nav2';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
  // Data for each chart
  const facebookData = [
    { name: 'Budget', value: 500 },
    { name: 'Clicks', value: 1200 },
    { name: 'CTR', value: 25 }, // Multiply by 10 for better visualization in the chart
  ];

  const noOfAdsData = [
    { name: 'Active', value: 5 },
    { name: 'Paused', value: 3 },
    { name: 'Completed', value: 2 },
  ];

  const adProgressData = [
    { name: 'Ongoing', value: 3 },
    { name: 'Upcoming', value: 2 },
    { name: 'Successful', value: 4 },
  ];

  const dayByDayData = [
    { day: 'Day 1', impressions: 1000 },
    { day: 'Day 2', impressions: 1500 },
    { day: 'Day 3', impressions: 2000 },
    { day: 'Day 4', impressions: 1800 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="dashboard-container">
      <Nav />
      <div className="container">
        <section className="portfolio-section">
          <h2 className="my-4">Your Advertisement Progress</h2>
          <div className="row">
            {/* Facebook Campaign Data - Pie Chart */}
            <div className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <h3>Facebook</h3>
                  <PieChart width={200} height={200}>
                    <Pie
                      data={facebookData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {facebookData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </div>
            </div>

            {/* No of Advertisements - Doughnut Chart */}
            <div className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body text-center">
                  <h3>No of Advertisements</h3>
                  <PieChart width={200} height={200}>
                    <Pie
                      data={noOfAdsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#82ca9d"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {noOfAdsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </div>
            </div>

            {/* Advertisement Progress - Horizontal Bar Chart */}
            <div className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h3>Advertisement Progress</h3>
                  <BarChart
                    width={300}
                    height={200}
                    data={adProgressData}
                    layout="vertical"
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </div>
              </div>
            </div>

            {/* Advertisement Day By Day Progress - Area Chart */}
            <div className="col-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <h3>Advertisement Day By Day Progress</h3>
                  <AreaChart
                    width={600}
                    height={200}
                    data={dayByDayData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="impressions" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
