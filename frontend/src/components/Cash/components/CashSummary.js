import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf"; // jsPDF for generating PDFs
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import PDFPrint from './PDFPrint'

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

  // Generate PDF Report for the summary section
  const generatePDFReport = () => {
    const doc = new jsPDF();
    const today = new Date().toISOString().split("T")[0];

    // Add title and summary data to the PDF
    doc.setFontSize(18);
    doc.text("Monthly Cash Summary Report", 10, 10);
    doc.setFontSize(12);
    doc.text(`Date: ${today}`, 10, 20);
    doc.text(`Total Income: Rs.${totalIncome.toFixed(2)}`, 10, 30);
    doc.text(`Total Expenses: Rs.${totalExpenses.toFixed(2)}`, 10, 40);
    doc.text(`Total Peti Cash: Rs.${totalPetiCash.toFixed(2)}`, 10, 50);
    doc.text(`Net Balance: Rs.${netBalance.toFixed(2)}`, 10, 60);

    // Add a line for separating content
    doc.line(10, 65, 200, 65); // Draw a line

    // Add detailed cash data
    doc.setFontSize(14);
    doc.text("Detailed Cash Transactions:", 10, 70);

    doc.setFontSize(12);
    const startY = 80; // Starting Y position for the table
    let currentY = startY;

    // Adding column headers
    doc.text("Date", 10, currentY);
    doc.text("Description", 50, currentY);
    doc.text("Amount", 150, currentY);
    currentY += 10; // Move to the next row

    cash.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString(); // Format date
      doc.text(date, 10, currentY);
      doc.text(item.description, 50, currentY);
      doc.text(`Rs.${parseFloat(item.amount).toFixed(2)}`, 150, currentY);
      currentY += 10; // Move to the next row
    });

    doc.save(`cash-summary-report-${today}.pdf`);
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
          onClick={generatePDFReport}
        >
          Download Monthly Report
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
