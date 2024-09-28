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

            {/* Expenses and Petty Cash */}
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

    // Create rows by pairing incomes and expenses
    const rows = [];
    const maxLength = Math.max(incomes.length, expenses.length);

    for (let i = 0; i < maxLength; i++) {
        rows.push(
            <CashRow
                key={i}
                income={incomes[i] || null}
                expense={expenses[i] || null}
                onEditIncome={handleEditIncome}
                onEditExpense={handleEditExpense}
                onDeleteIncome={handleDeleteIncome}
                onDeleteExpense={handleDeleteExpense}
            />
        );
    }

    return (
        <div className="container">
            <h1>Income and Expense Table</h1>
            <hr />
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Date (Income)</th>
                            <th style={{ width: "20%" }}>Description (Income)</th> {/* Increased width */}
                            <th>Amount (Income)</th>
                            <th>Action (Income)</th> {/* Action column for income */}
                            <th>Date (Expense)</th>
                            <th style={{ width: "20%" }}>Description (Expense)</th> {/* Increased width */}
                            <th>Amount (Expense)</th>
                            <th>Action (Expense)</th> {/* Action column for expenses */}
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        </div>
    );
}

export default IncomeAndOutgoingTable;
