import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function CashForm() {
    const [amount, setAmount] = useState("");
    const [cashType, setCashType] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(""); // State for error message
    const navigate = useNavigate();

    // Valid description options for different cash types
    const validIncomeDescriptions = [
        "Sales Revenue",
        "Recurring Revenue",
        "Rental Income",
        "Royalties",
        "Investment Income",
        "Grants and Subsidies",
        "Other Income",
        "Sponsorship and Advertising Revenue",
    ];

    const validExpenseDescriptions = [
        "Fixed Expenses",
        "Variable Expenses",
        "Operational Expenses",
    ];

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

        // Reset error message before submitting
        setError("");

        // Trim the description and remove trailing whitespace
        const trimmedDescription = description.trim();

        try {
            await axios.post("http://localhost:8070/cash/", {
                amount: parseFloat(amount),
                cashType,
                date,
                description: trimmedDescription, // Use the trimmed description
            });
            navigate("/cashTable");
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        navigate("/cashTable");
    };

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal point
        setAmount(value);
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescription(value); // Update the description as user types
        setError(""); // Reset error message

        // Check if cash type is Income
        if (cashType === "Income") {
            const trimmedValue = value.trim();
            const isValid = validIncomeDescriptions.some(desc => 
                desc.toLowerCase().startsWith(trimmedValue.toLowerCase())
            );

            if (!isValid && trimmedValue.length > 0) {
                setError("Invalid description for Income. Please enter a valid option.");
                setDescription(""); // Clear description field
            }
        }
        // Check if cash type is Expense
        else if (cashType === "Expense") {
            const trimmedValue = value.trim();
            const isValid = validExpenseDescriptions.some(desc => 
                desc.toLowerCase().startsWith(trimmedValue.toLowerCase())
            );

            if (!isValid && trimmedValue.length > 0) {
                setError("Invalid description for Expense. Please enter a valid option.");
                setDescription(""); // Clear description field
            }
        }
        // Check if cash type is Peti Cash
        else if (cashType === "Peti Cash") {
            const trimmedValue = value.trim();
            const isValid = validPetiCashDescriptions.some(desc => 
                desc.toLowerCase().startsWith(trimmedValue.toLowerCase())
            );

            if (!isValid && trimmedValue.length > 0) {
                setError("Invalid description for Peti Cash. Please enter a valid option.");
                setDescription(""); // Clear description field
            }
        }
        else {
            // Clear description if it is a number
            if (!isNaN(value) && value.trim() !== "") {
                setError("Description must be a string. Please enter a valid description.");
                setDescription(""); // Clear description field
            }
        }
    };

    return (
        <>
            <div className="container vh-100 d-flex align-items-center justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow border-0 rounded">
                        <div className="card-header text-center bg-success text-white">
                            <h2 className="mb-0">Add Cash</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Cash Type</label>
                                    {["Income", "Expense", "Peti Cash"].map((type) => (
                                        <div className="form-check" key={type}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                value={type}
                                                checked={cashType === type}
                                                onChange={(e) => setCashType(e.target.value)}
                                                required
                                            />
                                            <label className="form-check-label">{type}</label>
                                        </div>
                                    ))}
                                </div>

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
                                        placeholder={
                                            cashType === "Income" ? 
                                            "Possible values: Sales Revenue, Recurring Revenue, Rental Income, Royalties, Investment Income, Grants and Subsidies, Other Income, Sponsorship and Advertising Revenue" :
                                            cashType === "Expense" ?
                                            "Possible values: Fixed Expenses, Variable Expenses, Operational Expenses" :
                                            "Possible values: Office Supplies, Employee Reimbursements, Miscellaneous Expenses"
                                        }
                                    ></textarea>
                                    {error && <div className="text-danger mt-2">{error}</div>} {/* Show error message */}
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
                                    <button type="submit" className="btn btn-success me-2">
                                        <i className="fas fa-plus-circle me-2"></i>Add Cash
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
        </>
    );
}

export default CashForm;
