import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationCard from './components/NavigationCard'; // Adjust path if needed
import SalaryDetails from './components/SalaryDetails'; // Adjust path if needed
import StackedChart from './components/StackedChart';

const Dashboard = () => {
  // Sample user data for UserDetails
  const user = {
    name: 'Alice',
    basicSalary: 50000,
    bonus: 5000,
    otHours: 10,
    otRate: 25,
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left column: NavigationCard and UserDetails */}
        <div className="col-md-3">
          {/* NavigationCard */}
          <NavigationCard />

          {/* User Details */}
          
        </div>
        
        {/* Right column: Main dashboard content */}
        <div className="col-md-9">
          <div className="card my-2 h-15 ">
            {/* <h1>Main Dashboard Content</h1> */}
            <SalaryDetails user={user} />
            {/* Add your other components or content here */}
          </div>
        </div>


        <div className="col-md-8">
          <div className="card my-2 h-15 ">
            {/* <h1>Main Dashboard Content</h1> */}
            <StackedChart />
            {/* Add your other components or content here */}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card my-2 h-15 ">
            {/* <h1>Main Dashboard Content</h1> */}
            <StackedChart />
            {/* Add your other components or content here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
