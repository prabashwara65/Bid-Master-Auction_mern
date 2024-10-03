import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetiCashForm from "./PettiCashForm";
import CashForm from "./incomeExpenceReport";
import "bootstrap/dist/css/bootstrap.min.css";

function CashManagement() {
    const [activeTab, setActiveTab] = useState("cash"); // Default to Cash form

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="container vh-80  d-flex align-items-center justify-content-center ">
            <div className="col-lg-8">
                <div className="card shadow border-0 rounded">
                    <div className="card-header bg-dark text-white text-center">
                        <h2 className="mb-0">Cash Management</h2>
                    </div>
                    <div className="card-body">
                        {/* Tabs for switching between forms */}
                        <ul className="nav nav-tabs mb-4">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "cash" ? "active" : ""}`}
                                    onClick={() => handleTabChange("cash")}
                                >
                                    Income/Expense
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "petiCash" ? "active" : ""}`}
                                    onClick={() => handleTabChange("petiCash")}
                                >
                                    Peti Cash
                                </button>
                            </li>
                        </ul>

                        {/* Conditionally render the form based on the active tab */}
                        <div className="tab-content">
                            {activeTab === "cash" && (
                                <div className="tab-pane fade show active">
                                    <CashForm />
                                </div>
                            )}
                            {activeTab === "petiCash" && (
                                <div className="tab-pane fade show active">
                                    <PetiCashForm />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CashManagement;
