import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const URL = "http://localhost:8070/cash";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function CashSummary() {
  const [cash, setCash] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalPetiCash, setTotalPetiCash] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const navigate = useNavigate(); // Initialize navigate

  // Function to calculate totals and update the state
  const calculateTotals = (cashData) => {
    const incomeTotal = cashData
      .filter((item) => item.cashType === "Income")
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    const expensesTotal = cashData
      .filter((item) => item.cashType === "Expense")
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    const petiCashTotal = cashData
      .filter((item) => item.cashType === "Peti Cash")
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    setTotalIncome(incomeTotal);
    setTotalExpenses(expensesTotal);
    setTotalPetiCash(petiCashTotal);
    setNetBalance(incomeTotal - (expensesTotal + petiCashTotal));
  };

  // Fetch data from the backend
  useEffect(() => {
    fetchHandler().then((data) => {
      const cashData = data.cash;
      setCash(cashData);
      calculateTotals(cashData); // Calculate totals on initial load
    });
  }, []);

  // Handle navigation to cash report
  const handleNavigateToReport = () => {
    navigate("/cashReport"); // Use navigate to change the route
  };

  // Handle Add Cash navigation
  const handleAddCash = () => {
    navigate("/cashForm"); // Use navigate to change the route
  };

  return (
    <div className="container ">
      <h2 className="text-center ">Cash Summary</h2>
      <br />
      <div className="border">
        <div className="d-flex justify-content-between text-start">
          <strong>Total Income -</strong>
          <span>{totalIncome.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between text-start">
          <strong>Total Expenses -</strong>
          <span>{totalExpenses.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between text-start">
          <strong>Total Peti Cash -</strong>
          <span>{totalPetiCash.toFixed(2)}</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between text-start">
          <strong>Net Balance -</strong>
          <span>{netBalance.toFixed(2)}</span>
        </div>
        <button
          className="btn btn-secondary w-100 mt-2"
          onClick={handleNavigateToReport} // Update the button click handler
        >
          Go to Download Report
        </button>
      </div>
      <div className="pt-1">
        <button className="btn btn-primary w-100 " onClick={handleAddCash}>
          Add Cash
        </button>
      </div>
    </div>
  );
}

export default CashSummary;
