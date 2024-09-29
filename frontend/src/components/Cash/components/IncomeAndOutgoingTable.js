import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for routing

const URL = "http://localhost:8070/cash";

const CashRow = ({ income, expense, onEditIncome, onEditExpense, onDeleteIncome, onDeleteExpense }) => {
    const formattedIncomeDate = income ? new Date(income.date).toISOString().split("T")[0] : "";
    const formattedExpenseDate = expense ? new Date(expense.date).toISOString().split("T")[0] : "";

    return (
        <tr>
            {/* Incomes */}
            <td>
                {formattedIncomeDate}
                {income && <div className="mt-1"><span className="badge bg-success">{income.cashType}</span></div>}
            </td>
            <td className="text-wrap">{income?.description || ""}</td>
            <td>{income ? income.amount.toFixed(2) : ""}</td>
            <td>
                {income && (
                    <div className="d-flex flex-column">
                        <button
                            className="btn btn-warning btn-sm mb-2"
                            onClick={() => onEditIncome(income._id)}
                        >
                            Update
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => onDeleteIncome(income._id)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </td>

            {/* Expenses */}
            <td>
                {formattedExpenseDate}
                {expense && (
                    <div className="mt-1">
                        <span className={`badge ${expense.cashType === "Expense" ? "bg-danger" : "bg-warning"}`}>
                            {expense.cashType}
                        </span>
                    </div>
                )}
            </td>
            <td className="text-wrap">{expense?.description || ""}</td>
            <td>{expense ? expense.amount.toFixed(2) : ""}</td>
            <td>
                {expense && (
                    <div className="d-flex flex-column">
                        <button
                            className="btn btn-warning btn-sm mb-2"
                            onClick={() => onEditExpense(expense._id)}
                        >
                            Update
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => onDeleteExpense(expense._id)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}

// Fetch the cash data from API
const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);
};

function IncomeAndOutgoingTable() {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(""); // State for selected month
    const navigate = useNavigate();

    // Fetch and filter the data
    useEffect(() => {
        fetchHandler().then((data) => {
            console.log("Fetched Data:", data); // Debug log
            setIncomes(data.cash.filter((item) => item.cashType === "Income"));
            setExpenses(data.cash.filter((item) => item.cashType === "Expense" || item.cashType === "Peti Cash"));
        });
    }, []);

    // Handle row edit for income
    const handleEditIncome = (id) => {
        navigate(`/updateCash/${id}`); // Navigate to the update page with the income id
    };

    // Handle row edit for expense
    const handleEditExpense = (id) => {
        navigate(`/updateCash/${id}`); // Navigate to the update page with the expense id
    };

    // Handle row deletion for income
    const handleDeleteIncome = async (id) => {
        try {
            await axios.delete(`${URL}/${id}`);
            const updatedIncomes = incomes.filter((income) => income._id !== id);
            setIncomes(updatedIncomes);
        } catch (error) {
            console.error("Failed to delete income:", error);
        }
    };

    // Handle row deletion for expense
    const handleDeleteExpense = async (id) => {
        try {
            await axios.delete(`${URL}/${id}`);
            const updatedExpenses = expenses.filter((expense) => expense._id !== id);
            setExpenses(updatedExpenses);
        } catch (error) {
            console.error("Failed to delete expense:", error);
        }
    };

    // Filter data based on selected month
    const filterByMonth = (data) => {
        if (!selectedMonth) return data;
        return data.filter((item) => {
            const itemMonth = new Date(item.date).getMonth() + 1; // Get month from date
            return itemMonth === parseInt(selectedMonth);
        });
    };

    const filteredIncomes = filterByMonth(incomes);
    const filteredExpenses = filterByMonth(expenses);

    const operatingIncomes = filteredIncomes.filter(income => 
        ["Sales Revenue", "Recurring Revenue", "Rental Income", "Royalties"].includes(income.description)
    );

    const nonOperatingIncomes = filteredIncomes.filter(income => 
        ["Investment Income", "Grants and Subsidies", "Other Income", "Sponsorship and Advertising Revenue"].includes(income.description)
    );

    const regularExpenses = filteredExpenses.filter(expense => 
        ["Fixed Expenses", "Variable Expenses", "Operational Expenses"].includes(expense.description)
    );

    const pettyCashExpenses = filteredExpenses.filter(expense => 
        ["Office Supplies", "Employee Reimbursements", "Miscellaneous Expenses"].includes(expense.description)
    );

    const rows = [];

    // Add Operating Incomes heading
    rows.push(
        <tr key="operating-heading">
            <td colSpan="4" className="table-primary text-center">Operating Incomes</td>
            <td colSpan="4" className="table-primary text-center">Regular Expenses</td>
        </tr>
    );

    // Calculate the maximum number of rows for Operating Incomes and Regular Expenses
    const maxOperatingRows = Math.max(operatingIncomes.length, regularExpenses.length);

    // Add Operating Income rows
    for (let index = 0; index < maxOperatingRows; index++) {
        const income = operatingIncomes[index] || null; // Get income or null if not available
        const expense = regularExpenses[index] || null; // Get expense or null if not available

        rows.push(
            <CashRow
                key={`operating-row-${index}`}
                income={income}
                expense={expense}
                onEditIncome={handleEditIncome}
                onEditExpense={handleEditExpense}
                onDeleteIncome={handleDeleteIncome}
                onDeleteExpense={handleDeleteExpense}
            />
        );
    }

    // Add Non-Operating Incomes heading
    rows.push(
        <tr key="non-operating-heading">
            <td colSpan="4" className="table-secondary text-center">Non-Operating Incomes</td>
            <td colSpan="4" className="table-secondary text-center">Petty Cash Expenses</td>
        </tr>
    );

    // Calculate the maximum number of rows for Non-Operating Incomes and Petty Cash Expenses
    const maxNonOperatingRows = Math.max(nonOperatingIncomes.length, pettyCashExpenses.length);

    // Add Non-Operating Income rows
    for (let index = 0; index < maxNonOperatingRows; index++) {
        const income = nonOperatingIncomes[index] || null; // Get income or null if not available
        const expense = pettyCashExpenses[index] || null; // Get expense or null if not available

        rows.push(
            <CashRow
                key={`non-operating-row-${index}`}
                income={income}
                expense={expense}
                onEditIncome={handleEditIncome}
                onEditExpense={handleEditExpense}
                onDeleteIncome={handleDeleteIncome}
                onDeleteExpense={handleDeleteExpense}
            />
        );
    }

    // Calculate Total Income for the selected month
    const totalIncome = filteredIncomes.reduce((total, income) => total + income.amount, 0);

    // Calculate Total Expenses for the selected month
    const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);

    // Calculate Net Balance for the selected month
    const netBalance = totalIncome - totalExpenses;

    // Determine class for the total row based on netBalance
    let totalRowClass = "";
    if (netBalance > 0) {
        totalRowClass = "table-success"; // Green for profit
    } else if (netBalance < 0) {
        totalRowClass = "table-danger"; // Red for loss
    }

    // Generate Month Options
    const months = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    return (
        <div>
            <div className="mb-3">
                <label htmlFor="monthSelect" className="form-label">Select Month</label>
                <select
                    id="monthSelect"
                    className="form-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="">All Months</option>
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                </select>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Actions</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                    <tr className={totalRowClass}>
                        <td colSpan="2" className="text-center">Total Income:</td>
                        <td>{totalIncome.toFixed(2)}</td>
                        <td></td>
                        <td colSpan="2" className="text-center">Total Expenses:</td>
                        <td>{totalExpenses.toFixed(2)}</td>
                        <td></td>
                    </tr>
                    <tr className={totalRowClass}>
                        <td colSpan="6" className="text-right">Net Balance:</td>
                        <td>{netBalance.toFixed(2)}</td>
                        <td colSpan="4"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default IncomeAndOutgoingTable;
