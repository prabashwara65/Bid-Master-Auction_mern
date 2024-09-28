import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for routing

const URL = "http://localhost:8070/cash";

// Row component for displaying income and expenses data with Update buttons
const CashRow = ({ income, expense, onEditIncome, onEditExpense }) => {
    const formattedIncomeDate = income ? new Date(income.date).toISOString().split("T")[0] : "";
    const formattedExpenseDate = expense ? new Date(expense.date).toISOString().split("T")[0] : "";

    return (
        <tr>
            {/* Incomes */}
            <td>{formattedIncomeDate}</td>
            <td>{income?.description || ""}</td>
            <td>Rs.{income ? income.amount.toFixed(2) : ""}</td>
            <td>
                {income && <span className="badge bg-success">{income.cashType}</span>}
            </td>
            <td>
                {income && (
                    <button
                        className="btn btn-warning btn-sm"
                        onClick={() => onEditIncome(income._id)}
                    >
                        Update
                    </button>
                )}
            </td>

            {/* Expenses and Petty Cash */}
            <td>{formattedExpenseDate}</td>
            <td>{expense?.description || ""}</td>
            <td>Rs.{expense ? expense.amount.toFixed(2) : ""}</td>
            <td>
                {expense && (
                    <span
                        className={`badge ${
                            expense.cashType === "Expense" ? "bg-danger" : "bg-warning"
                        }`}
                    >
                        {expense.cashType}
                    </span>
                )}
            </td>
            <td>
                {expense && (
                    <button
                        className="btn btn-warning btn-sm"
                        onClick={() => onEditExpense(expense._id)}
                    >
                        Update
                    </button>
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
                            <th>Description (Income)</th>
                            <th>Amount (Income)</th>
                            <th>Cash Type (Income)</th>
                            <th>Action (Income)</th> {/* Action column for income */}
                            <th>Date (Expense)</th>
                            <th>Description (Expense)</th>
                            <th>Amount (Expense)</th>
                            <th>Cash Type (Expense)</th>
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
