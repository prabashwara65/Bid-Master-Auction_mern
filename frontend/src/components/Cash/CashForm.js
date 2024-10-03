import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function CashOptions() {
    const navigate = useNavigate();

    // Navigate to Income/Expense form
    const handleIncomeExpenseClick = () => {
        navigate("/cashForm");
    };

    // Navigate to Peti Cash form
    const handlePetiCashClick = () => {
        navigate("/petiCashForm");
    };

    return (
        <div className="container vh-100 d-flex align-items-center justify-content-center">
            <div className="row">
                <div className="col-lg-6 mb-3">
                    <div className="card shadow border-0 rounded" onClick={handleIncomeExpenseClick} style={{ cursor: 'pointer' }}>
                        <div className="card-body text-center bg-success text-white">
                            <h3>Income/Expense</h3>
                            <p className="card-text">Manage all Income and Expense records here.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 mb-3">
                    <div className="card shadow border-0 rounded" onClick={handlePetiCashClick} style={{ cursor: 'pointer' }}>
                        <div className="card-body text-center bg-warning text-white">
                            <h3>Peti Cash</h3>
                            <p className="card-text">Manage Peti Cash transactions here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CashOptions;
