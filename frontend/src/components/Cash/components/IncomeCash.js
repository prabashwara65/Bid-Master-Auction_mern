import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const URL = "http://localhost:8070/cash";

// Row component for displaying income data
const IncomeRow = ({ income, onEdit }) => {
    const formattedDate = new Date(income.date).toISOString().split("T")[0];

    return (
        <tr>
            <td>{formattedDate}</td>
            <td>{income.description}</td>
            <td>Rs.{income.amount.toFixed(2)}</td>
            <td>
                <span className="badge bg-success">Income</span>
                <button
                    className="btn btn-warning btn-sm ms-2 "
                    onClick={() => onEdit(income._id)} // Call onEdit with the income id
                >
                    Update
                </button>
            </td>
        </tr>
    );
};

// Fetch the income data from API
const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);
};

function IncomeTable() {
    const [incomes, setIncomes] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch and filter income data
    useEffect(() => {
        fetchHandler().then((data) => {
            const filteredIncomes = data.cash.filter((item) => item.cashType === "Income");
            setIncomes(filteredIncomes);
        });
    }, []);

    // Handle row edit
    const handleEdit = (id) => {
        navigate(`/updateCash/${id}`); // Navigate to the update page with the income id
    };

    return (
        <div className="container">
            <h1>Income Table</h1>
            <hr />
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Status</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {incomes.map((income) => (
                            <IncomeRow key={income._id} income={income} onEdit={handleEdit} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default IncomeTable;
