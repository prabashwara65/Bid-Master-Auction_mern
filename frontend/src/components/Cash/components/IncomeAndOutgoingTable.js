import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for routing

const URL = "http://localhost:8070/cash";

// Row component for displaying income and expenses data with Update and Delete buttons
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
            <td className="text-wrap">{income?.description || ""}</td> {/* Added text-wrap for word wrapping */}
            <td>Rs.{income ? income.amount.toFixed(2) : ""}</td>
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
            <td className="text-wrap">{expense?.description || ""}</td> {/* Added text-wrap for word wrapping */}
            <td>Rs.{expense ? expense.amount.toFixed(2) : ""}</td>
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
};

// Fetch the cash data from API
const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);
};

function IncomeAndOutgoingTable() {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const navigate = useNavigate();

    // Fetch and filter the data
    useEffect(() => {
        fetchHandler().then((data) => {
            const allIncomes = data.cash.filter((item) => item.cashType === "Income");
            const allExpenses = data.cash.filter(
                (item) => item.cashType === "Expense" || item.cashType === "Peti Cash"
            );
            setIncomes(allIncomes);
            setExpenses(allExpenses);
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

    // Filter incomes and expenses
    const operatingIncomes = incomes.filter(income => 
        ["Sales Revenue", "Recurring Revenue", "Rental Income", "Royalties"].includes(income.description)
    );

    const nonOperatingIncomes = incomes.filter(income => 
        ["Investment Income", "Grants and Subsidies", "Other Income", "Sponsorship and Advertising Revenue"].includes(income.description)
    );

    const regularExpenses = expenses.filter(expense => 
        ["Fixed Expenses", "Variable Expenses", "Operational Expenses"].includes(expense.description)
    );

    const pettyCashExpenses = expenses.filter(expense => 
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

    // Add Operating Income rows
    operatingIncomes.forEach((income, index) => {
        rows.push(
            <CashRow
                key={`operating-income-${index}`}
                income={income}
                expense={regularExpenses[index] || null} // Pair with Regular Expenses
                onEditIncome={handleEditIncome}
                onEditExpense={handleEditExpense}
                onDeleteIncome={handleDeleteIncome}
                onDeleteExpense={handleDeleteExpense}
            />
        );
    });

    // Add Non-Operating Incomes heading
    rows.push(
        <tr key="non-operating-heading">
            <td colSpan="4" className="table-secondary text-center">Non-Operating Incomes</td>
            <td colSpan="4" className="table-secondary text-center">Petty Cash Expenses</td>
        </tr>
    );

    // Add Non-Operating Income rows
    nonOperatingIncomes.forEach((income, index) => {
        rows.push(
            <CashRow
                key={`non-operating-income-${index}`}
                income={income}
                expense={pettyCashExpenses[index] || null} // Pair with Petty Cash Expenses
                onEditIncome={handleEditIncome}
                onEditExpense={handleEditExpense}
                onDeleteIncome={handleDeleteIncome}
                onDeleteExpense={handleDeleteExpense}
            />
        );
    });

    return (
        <div className="container">
            <h1>Income and Expense Table</h1>
            <hr />
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Date (Income)</th>
                            <th style={{ width: "20%" }}>Description (Income)</th>
                            <th>Amount (Income)</th>
                            <th>Action (Income)</th>
                            <th>Date (Expense)</th>
                            <th style={{ width: "20%" }}>Description (Expense)</th>
                            <th>Amount (Expense)</th>
                            <th>Action (Expense)</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        </div>
    );
}

export default IncomeAndOutgoingTable;
