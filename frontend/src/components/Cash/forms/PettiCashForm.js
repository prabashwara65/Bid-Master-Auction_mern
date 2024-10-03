import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function PetiCashForm() {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Valid description options for Peti Cash
    const validPetiCashDescriptions = [
        "Office Supplies",
        "Employee Reimbursements",
        "Miscellaneous Expenses",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (parseFloat(amount) < 0) {
            alert("Amount cannot be negative.");
            return;
        }

        setError("");
        const trimmedDescription = description.trim();

        try {
            // Sending post request for Peti Cash
            await axios.post("http://localhost:8070/cash/", {
                amount: parseFloat(amount),
                cashType: "Peti Cash",
                date,
                description: trimmedDescription,
            });
            // Navigate to Peti Cash table after successful submission
            navigate("/petiCashTable");
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        navigate("/petiCashTable");
    };

    const handleAmountChange = (e) => {
        // Allow only numbers and decimal point
        const value = e.target.value.replace(/[^0-9.]/g, ''); 
        setAmount(value);
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescription(value);

        const trimmedValue = value.trim();
        const isValid = validPetiCashDescriptions.some(desc =>
            desc.toLowerCase().startsWith(trimmedValue.toLowerCase())
        );
        if (!isValid && trimmedValue.length > 0) {
            setDescription("");
        }
    };

    return (
        <div className="container vh-100 d-flex align-items-center justify-content-center">
            <div className="col-lg-6">
                <div className="card shadow border-0 rounded">
                    <div className="card-header text-center bg-warning text-white">
                        <h2 className="mb-0">Add Peti Cash</h2>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    required
                                    rows="3"
                                    placeholder="Possible values: Office Supplies, Employee Reimbursements, Miscellaneous Expenses"
                                ></textarea>
                                {error && <div className="text-danger mt-2">{error}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Amount</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    required
                                />
                            </div>

                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-warning me-2">
                                    <i className="fas fa-plus-circle me-2"></i>Add Peti Cash
                                </button>
                                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PetiCashForm;
