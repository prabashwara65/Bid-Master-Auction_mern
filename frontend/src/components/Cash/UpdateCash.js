import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Nav';

function UpdateCash() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [cashType, setCashType] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(''); // State for error message

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

    useEffect(() => {
        const fetchCashData = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/cash/${id}`);
                if (response.data && response.data.cash) {
                    const { cashType, date, description, amount } = response.data.cash;
                    const formattedDate = date ? new Date(date).toISOString().slice(0, 10) : '';
                    setCashType(cashType || '');
                    setDate(formattedDate);
                    setDescription(description || '');
                    setAmount(amount || '');
                }
            } catch (error) {
                console.error('Failed to fetch cash record:', error);
            }
        };
        fetchCashData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (parseFloat(amount) < 0) {
            alert("Amount cannot be negative.");
            return;
        }

        // Trim the description and remove trailing whitespace
        const trimmedDescription = description.trim();
        setError(""); // Reset error message

        // Validate description based on cash type
        if (cashType === "Income") {
            const isValid = validIncomeDescriptions.some(desc => 
                desc.toLowerCase().startsWith(trimmedDescription.toLowerCase())
            );

            if (!isValid) {
                setError("Invalid description for Income. Please enter a valid option.");
                return;
            }
        } else if (cashType === "Expense") {
            const isValid = validExpenseDescriptions.some(desc => 
                desc.toLowerCase().startsWith(trimmedDescription.toLowerCase())
            );

            if (!isValid) {
                setError("Invalid description for Expense. Please enter a valid option.");
                return;
            }
        } else if (cashType === "Peti Cash") {
            const isValid = validPetiCashDescriptions.some(desc => 
                desc.toLowerCase().startsWith(trimmedDescription.toLowerCase())
            );

            if (!isValid) {
                setError("Invalid description for Peti Cash. Please enter a valid option.");
                return;
            }
        }

        try {
            await axios.put(`http://localhost:8070/cash/${id}`, {
                amount: parseFloat(amount),
                cashType,
                date,
                description: trimmedDescription, // Use the trimmed description
            });
            navigate('/cashTable');
        } catch (error) {
            console.error('Failed to update cash record:', error);
            setError("Failed to update the record. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate('/cashTable');
    };

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal point
        setAmount(value);
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescription(value); // Update the description as user types
        setError(""); // Reset error message
    };

    return (
        <>
            <Nav />
            <div className="container vh-100 d-flex align-items-center justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow border-0 rounded">
                        <div className="card-header text-center bg-primary text-white">
                            <h2 className="mb-0">Update Cash</h2>
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
                                        onChange={handleDescriptionChange} // Call the new handler
                                        required
                                        rows="3"
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

                                <div className="d-flex justify-content-between">
                                    <button type="submit" className="btn btn-primary me-2">
                                        Update Cash
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

export default UpdateCash;
