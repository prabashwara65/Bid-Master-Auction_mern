import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationCard from "./components/SalaryTable/NavigationCard"; // Adjust path if needed
import SalaryDetails from "./components/SalaryTable/SalaryDetails"; // Adjust path if needed
import StackedChart from "./components/SalaryTable/StackedChart";
import PieChart from "./components/SalaryTable/PieChart";
import EmpTable from "./components/SalaryTable/EmpTable";
import CategorizeEmployees from "./components/SalaryTable/CategorizeEmp";

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

        <div className="col-md-9">
          <div className="card my-2"style={{  height: '350px' }} >
            <StackedChart />
          </div>
        </div>

        <div className="col-md-3">
          <div className="card my-2" style={{ width: '320px' , height: '350px'}}>
            <PieChart data={user} />
          </div>
        </div>

        <div className="col-md-3">
          <div className="card my-2 ">
            <CategorizeEmployees /> 
            </div>
        </div>

        <div className="col-md-9">
          <div className="card my-2 ">
            <EmpTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
