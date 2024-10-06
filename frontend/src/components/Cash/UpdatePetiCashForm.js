import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function UpdatePetiCashForm() {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    const validPetiCashDescriptions = [
        "Office Supplies",
        "Employee Reimbursements",
        "Miscellaneous Expenses",
    ];

    useEffect(() => {
        // Fetch existing record data based on the id
        axios.get(`http://localhost:8070/cash/${id}`).then((response) => {
            const { amount, date, description } = response.data.cash;

            // Format the date to 'yyyy-MM-dd' before setting it
            const formattedDate = date ? new Date(date).toISOString().slice(0, 10) : "";

            setAmount(amount);
            setDate(formattedDate);
            setDescription(description);
        }).catch((error) => {
            console.error(error);
        });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (parseFloat(amount) < 0) {
            alert("Amount cannot be negative.");
            return;
        }

        setError("");
        const trimmedDescription = description.trim();

        try {
            // Sending put request to update Peti Cash
            await axios.put(`http://localhost:8070/cash/${id}`, {
                amount: parseFloat(amount),
                cashType: "Peti Cash",
                date,
                description: trimmedDescription,
            });
            // Navigate to Peti Cash table after successful update
            navigate("/cashTable");
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        navigate("/cashTable");
    };

    const handleAmountChange = (e) => {
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

    // Get today's date in yyyy-MM-dd format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    return (
        <div className="container vh-100 d-flex align-items-center justify-content-center">
            <div className="col-lg-6">
                <div className="card shadow border-0 rounded">
                    <div className="card-header text-center bg-warning text-white">
                        <h2 className="mb-0">Update Peti Cash</h2>
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
                                    // Set the max date to today
                                    max={getCurrentDate()}  
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
                                    <i className="fas fa-save me-2"></i>Update Peti Cash
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

export default UpdatePetiCashForm;
