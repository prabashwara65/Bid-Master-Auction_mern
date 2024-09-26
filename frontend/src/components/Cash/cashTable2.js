import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from '../Nav';

const CASH_URL = "http://localhost:8070/cash";
const SALARY_URL = "http://localhost:8070/salaries";

const CashRow = ({ cash, onEdit, onDelete }) => {
    const formattedDate = new Date(cash.date).toISOString().split("T")[0];

    return (
        <tr>
            <td>{cash.cashType}</td>
            <td>{formattedDate}</td>
            <td>{cash.description}</td>
            <td>{cash.amount.toFixed(2)}</td>
            <td>
                <FaEdit
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() => onEdit(cash._id)}
                />
                <FaTrash
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => onDelete(cash._id)}
                />
            </td>
        </tr>
    );
};

// New row for salary data
const SalaryRow = ({ salary }) => (
    <tr>
        <td>{salary.fullName}</td>
        <td>{salary.jobTitle}</td>
        <td>{salary.BasicSalary.toFixed(2)}</td>
        <td>{salary.Bonus.toFixed(2)}</td>
        <td>{salary.OTHours}</td>
        <td>{salary.OTRate.toFixed(2)}</td>
    </tr>
);

const fetchCashData = async () => {
    return await axios.get(CASH_URL).then((res) => res.data);
};

const fetchSalaryData = async () => {
    return await axios.get(SALARY_URL).then((res) => res.data);
};

function CashTable() {
    const [cash, setCash] = useState([]);
    const [filteredCash, setFilteredCash] = useState([]);
    const [salaryData, setSalaryData] = useState([]); // New state for salary data
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCashData().then((data) => {
            const cashData = data.cash;
            setCash(cashData);
            setFilteredCash(cashData); 
        });

        // Fetch salary data
        fetchSalaryData().then((data) => {
            setSalaryData(data);
        });
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${CASH_URL}/${id}`);
            const updatedCash = cash.filter((item) => item._id !== id);
            setCash(updatedCash);
            setFilteredCash(updatedCash);
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    const handleEdit = async (id) => {
        navigate(`/updateCash/${id}`);
    };

    const handleAddCash = () => {
        navigate('/cashForm');
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = cash.filter((item) => {
            const matchType = item.cashType.toLowerCase().includes(value);
            const matchDescription = item.description.toLowerCase().includes(value);

            return matchType || matchDescription;
        });

        setFilteredCash(filtered);
    };

    return (
        <>
            <Nav />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-8 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h1>Cash Table</h1>
                            <button className="btn btn-primary" onClick={handleAddCash}>
                                Add Cash
                            </button>
                        </div>
                        <hr />
                        <div className="mb-3">
                            <input
                                type="text"
                                name="searchTerm"
                                placeholder="Search by Type or Description"
                                className="form-control"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>Cash Type</th>
                                                <th>Date</th>
                                                <th>Description</th>
                                                <th>Amount</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCash.map((cash) => (
                                                <CashRow
                                                    key={cash._id}
                                                    cash={cash}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* New Table for Salary Information */}
                    <div className="col-lg-8 mb-4">
                        <h2>Salary Table</h2>
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Full Name</th>
                                        <th>Job Title</th>
                                        <th>Basic Salary</th>
                                        <th>Bonus</th>
                                        <th>OT Hours</th>
                                        <th>OT Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salaryData.map((salary) => (
                                        <SalaryRow key={salary._id} salary={salary} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CashTable;
