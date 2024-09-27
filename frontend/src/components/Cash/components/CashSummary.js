import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf"; // jsPDF for generating PDFs
import "bootstrap/dist/css/bootstrap.min.css";

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

        doc.text("Monthly Cash Summary Report", 10, 10);
        doc.text(`Date: ${today}`, 10, 20);
        doc.text(`Total Income: Rs.${totalIncome.toFixed(2)}`, 10, 30);
        doc.text(`Total Expenses: Rs.${totalExpenses.toFixed(2)}`, 10, 40);
        doc.text(`Total Peti Cash: Rs.${totalPetiCash.toFixed(2)}`, 10, 50);
        doc.text(`Net Balance: Rs.${netBalance.toFixed(2)}`, 10, 60);

        doc.save(`cash-summary-report-${today}.pdf`);
    };

    return (
        <div className="container mt-2 border ">
            <h2 className="text-center">Cash Summary</h2>
            <div className="border p-3">
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
                <button className="btn btn-secondary w-100 mt-3" onClick={generatePDFReport}>
                    Download Monthly Report
                </button>
            </div>
        </div>
    );
}

export default CashSummary;
