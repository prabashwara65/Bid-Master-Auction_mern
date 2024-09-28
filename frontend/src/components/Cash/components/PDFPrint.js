import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const URL = "http://localhost:8070/cash";

// Row component for displaying income and expenses data
const CashRow = ({ income, expense }) => {
    const formattedIncomeDate = income ? new Date(income.date).toISOString().split("T")[0] : "";
    const formattedExpenseDate = expense ? new Date(expense.date).toISOString().split("T")[0] : "";

    return (
        <tr>
            {/* Incomes */}
            <td style={{ border: '1px solid black', padding: '4px' }}>
                {formattedIncomeDate}
                {income && <div style={{ marginTop: '0.25rem' }}>{income.cashType}</div>}
            </td>
            <td style={{ border: '1px solid black', padding: '4px' }}>{income?.description || ""}</td>
            <td style={{ border: '1px solid black', padding: '4px' }}>{income ? income.amount.toFixed(2) : ""}</td>

            {/* Expenses */}
            <td style={{ border: '1px solid black', padding: '4px' }}>
                {formattedExpenseDate}
                {expense && (
                    <div style={{ marginTop: '0.25rem' }}>
                        {expense.cashType}
                    </div>
                )}
            </td>
            <td style={{ border: '1px solid black', padding: '4px' }}>{expense?.description || ""}</td>
            <td style={{ border: '1px solid black', padding: '4px' }}>{expense ? expense.amount.toFixed(2) : ""}</td>
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
    const tableRef = useRef();

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

    // Filter incomes and expenses
    const operatingIncomes = incomes.filter(income => 
        ["Sales Revenue", "Recurring Revenue", "Rental Income", "Royalties"].includes(income.description)
    );

    const nonOperatingIncomes = incomes.filter(income => 
        ["Investment Income", "Grants and Subsidies", "Other Income", "Sponsorship and Advertising Revenue"].includes(income.description)
    );

    const regularExpenses = expenses.filter(expense => 
        ["Fixed Expenses", "Variable Expenses", "Operational Expenses"].includes(expense.description)
    );

    const pettyCashExpenses = expenses.filter(expense => 
        ["Office Supplies", "Employee Reimbursements", "Miscellaneous Expenses"].includes(expense.description)
    );

    const rows = [];

    // Add Operating Incomes heading
    rows.push(
        <tr key="operating-heading">
            <td colSpan="3" style={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '4px' }}>Operating Incomes</td>
            <td colSpan="3" style={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '4px' }}>Regular Expenses</td>
        </tr>
    );

    // Add Operating Income rows
    operatingIncomes.forEach((income, index) => {
        rows.push(
            <CashRow
                key={`operating-income-${index}`}
                income={income}
                expense={regularExpenses[index] || null} // Pair with Regular Expenses
            />
        );
    });

    // Add Non-Operating Incomes heading
    rows.push(
        <tr key="non-operating-heading">
            <td colSpan="3" style={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '4px' }}>Non-Operating Incomes</td>
            <td colSpan="3" style={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '4px' }}>Petty Cash Expenses</td>
        </tr>
    );

    // Add Non-Operating Income rows
    nonOperatingIncomes.forEach((income, index) => {
        rows.push(
            <CashRow
                key={`non-operating-income-${index}`}
                income={income}
                expense={pettyCashExpenses[index] || null} // Pair with Petty Cash Expenses
            />
        );
    });

    // Calculate Total Income
    const totalIncome = [...operatingIncomes, ...nonOperatingIncomes].reduce((total, income) => total + income.amount, 0);

    // Calculate Total Expenses
    const totalExpenses = [...regularExpenses, ...pettyCashExpenses].reduce((total, expense) => total + expense.amount, 0);

    // Calculate Net Balance
    const netBalance = totalIncome - totalExpenses;

    // Function to download the table as a PDF using html2pdf
    const downloadPDF = () => {
        const element = tableRef.current;
        const options = {
            margin: 1,
            filename: 'income_and_expense_table.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf().from(element).set(options).save();
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', fontSize: '1.5rem' }}>Income and Expense Table</h1>
            <hr />
            <button style={{ marginBottom: '15px', padding: '10px 15px', border: '1px solid black', cursor: 'pointer' }} onClick={downloadPDF}>
                Download PDF
            </button>
            <div style={{ overflowX: 'auto' }} ref={tableRef}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '4px' }}>Date (Income)</th>
                            <th style={{ border: '1px solid black', padding: '4px' }}>Description (Income)</th>
                            <th style={{ border: '1px solid black', padding: '4px' }}>Amount (Income)</th>
                            <th style={{ border: '1px solid black', padding: '4px' }}>Date (Expense)</th>
                            <th style={{ border: '1px solid black', padding: '4px' }}>Description (Expense)</th>
                            <th style={{ border: '1px solid black', padding: '4px' }}>Amount (Expense)</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
            {/* Footer to show totals */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '0.9rem' }}>
                <tbody>
                    <tr>
                        <td colSpan="3" style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid black', padding: '4px' }}>Total Income</td>
                        <td style={{ textAlign: 'end', fontWeight: 'bold', border: '1px solid black', padding: '4px' }}>Rs.{totalIncome.toFixed(2)}</td>
                        <td colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid black', padding: '4px' }}>Total Expenses</td>
                        <td style={{ textAlign: 'end', fontWeight: 'bold', border: '1px solid black', padding: '4px' }}>Rs.{totalExpenses.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="6" style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', border: '1px solid black', padding: '4px' }}>Net Balance</td>
                        <td style={{ textAlign: 'end', fontSize: '1rem', fontWeight: 'bold', border: '1px solid black', padding: '4px' }}>Rs.{netBalance.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default IncomeAndOutgoingTable;
