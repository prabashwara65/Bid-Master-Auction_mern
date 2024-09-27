import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationCard from "../Salary/components/SalaryTable/NavigationCard"; // Adjust path if needed
import SalaryDetails from "../Salary/components/SalaryTable/SalaryDetails"; // Adjust path if needed
import IncomesCash from './components/IncomeCash'
import OutgoingCash from './components/OutgoingCash'

const Dashboard = () => {
  // Sample user data for UserDetails
  const user = {
    name: "Alice",
    basicSalary: 50000,
    bonus: 5000,
    otHours: 10,
    otRate: 25,
  };

  return (
    <div className="container-fluid p-5 ">
      <div className="row">
        {/* Left column: NavigationCard and UserDetails */}
        <div className="col-md-3">
          {/* NavigationCard */}
          <NavigationCard />
        </div>

        {/* Right column: SalaryDetails content */}
        <div className="col-md-9">
          <div className="card mb-2" >
            <SalaryDetails user={user} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-2" >
            <IncomesCash />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-2" >
            <OutgoingCash />
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Dashboard;
