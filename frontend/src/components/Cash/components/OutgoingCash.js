import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for routing

const URL = "http://localhost:8070/cash";

// Row component for displaying data
const CashRow = ({ cash, onEdit }) => {
    const formattedDate = new Date(cash.date).toISOString().split("T")[0];
    const cashTypeColor = cash.cashType === "Expense" ? "bg-danger" : "bg-warning";

    return (
        <tr>
            <td>{formattedDate}</td>
            <td>{cash.description}</td>
            <td>Rs.{cash.amount.toFixed(2)}</td>
            <td className="d-flex align-items-center"> {/* Flex container for alignment */}
                <span className={`badge ${cashTypeColor} me-2`}> {/* Add margin to right */}
                    {cash.cashType}
                </span>
                <button
                    className="btn btn-warning btn-sm" // Update button styles
                    onClick={() => onEdit(cash._id)} // Call onEdit with the cash id
                >
                    Update
                </button>
            </td>
        </tr>
    );
};

// Fetch the cash data from API
const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);
};

function CashTable() {
    const [cashRecords, setCashRecords] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch and combine the data for Expenses and Peti Cash
    useEffect(() => {
        fetchHandler().then((data) => {
            const filteredCash = data.cash.filter(
                (item) => item.cashType === "Expense" || item.cashType === "Peti Cash"
            );
            setCashRecords(filteredCash); // Combine both Expense and Peti Cash
        });
    }, []);

    // Handle row edit
    const handleEdit = (id) => {
        navigate(`/updateCash/${id}`); // Navigate to the update route
    };

    return (
        <>
            <div className="container ">
                {/* Combined Table for Expenses and Peti Cash */}
                <h1>Expenses and Peti Cash Table</h1>
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
                            {cashRecords.map((cash) => (
                                <CashRow key={cash._id} cash={cash} onEdit={handleEdit} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default CashTable;
