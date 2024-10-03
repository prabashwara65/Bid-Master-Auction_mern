import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// eslint-disable-next-line
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";

const URL = "http://localhost:8070/cash";

// Row component for displaying income and expenses data
const CashRow = ({ income, expense }) => {
  const formattedIncomeDate = income
    ? new Date(income.date).toISOString().split("T")[0]
    : "";
  const formattedExpenseDate = expense
    ? new Date(expense.date).toISOString().split("T")[0]
    : "";

  return (
    <tr>
      {/* Incomes */}
      <td style={{ border: "1px solid black", padding: "4px" }}>
        {formattedIncomeDate}
        {income && (
          <div style={{ marginTop: "0.25rem" }}>{income.cashType}</div>
        )}
      </td>
      <td style={{ border: "1px solid black", padding: "4px" }}>
        {income?.description || ""}
      </td>
      <td style={{ border: "1px solid black", padding: "4px" }}>
        {income ? income.amount.toFixed(2) : ""}
      </td>

      {/* Expenses */}
      <td style={{ border: "1px solid black", padding: "4px" }}>
        {formattedExpenseDate}
        {expense && (
          <div style={{ marginTop: "0.25rem" }}>{expense.cashType}</div>
        )}
      </td>
      <td style={{ border: "1px solid black", padding: "4px" }}>
        {expense?.description || ""}
      </td>
      <td style={{ border: "1px solid black", padding: "4px" }}>
        {expense ? expense.amount.toFixed(2) : ""}
      </td>
    </tr>
  );
};

// Fetch the cash data from API
const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function PDFPrint() {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const tableRef = useRef();
  const navigate = useNavigate();

  // Fetch and filter the data
  useEffect(() => {
    fetchHandler().then((data) => {
      const allIncomes = data.cash.filter(
        (item) => item.cashType === "Income"
      );
      const allExpenses = data.cash.filter(
        (item) => item.cashType === "Expense" || item.cashType === "Peti Cash"
      );
      setIncomes(allIncomes);
      setExpenses(allExpenses);
    });
  }, []);

  // Filter incomes and expenses based on selected month
  const filteredIncomes = incomes.filter((income) =>
    new Date(income.date).getMonth() === selectedMonth
  );

  const filteredExpenses = expenses.filter((expense) =>
    new Date(expense.date).getMonth() === selectedMonth
  );

  // Total Income and Expenses calculations
  const totalIncome = filteredIncomes.reduce(
    (total, income) => total + income.amount,
    0
  );

  const totalExpenses = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const netBalance = totalIncome - totalExpenses;

  // Get the current date
  const currentDate = new Date().toLocaleDateString();

  // Function to download the table as a PDF using html2pdf
  const downloadPDF = () => {
    const element = tableRef.current;
    const options = {
      margin: 1,
      filename: "income_and_expense_table.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
    navigate('/cashTable'); 
  };

  // Determine the style for net balance
  const netBalanceStyle = {
    color: netBalance > 0 ? "green" : netBalance < 0 ? "red" : "inherit",
    fontWeight: "bold"
  };

  return (
    <div>
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "1.5rem" }}>
          Income and Expense Table
        </h1>
        <hr />
        <label htmlFor="month-select">Select Month:</label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          style={{ marginBottom: "15px", padding: "10px", cursor: "pointer" }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <button
          style={{
            marginBottom: "15px",
            padding: "10px 15px",
            border: "1px solid black",
            cursor: "pointer",
          }}
          onClick={downloadPDF}
        >
          Download PDF
        </button>

        <div ref={tableRef}>
          <div>
            <div className="d-flex align-items-center">
              <div>
                <img
                  src="/Assests/bid-master-logo-zip-file/png/logo-no-background.png"
                  className="img-fluid w-50"
                  alt="logo"
                />
              </div>
              <div className="ms-3">
                <h5>Arcade Independence Square, Colombo 07, Sri Lanka</h5>
                <p>Call us: +94 xxxxxxxxx</p>
                <p>
                  Mail us:{" "}
                  <a href="mailto:bidmaster@gmail.com">bidmaster@gmail.com</a>
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "30px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "4px" }}>
                    Date (Income)
                  </th>
                  <th style={{ border: "1px solid black", padding: "4px" }}>
                    Description (Income)
                  </th>
                  <th style={{ border: "1px solid black", padding: "4px" }}>
                    Amount (Income)
                  </th>
                  <th style={{ border: "1px solid black", padding: "4px" }}>
                    Date (Expense)
                  </th>
                  <th style={{ border: "1px solid black", padding: "4px" }}>
                    Description (Expense)
                  </th>
                  <th style={{ border: "1px solid black", padding: "4px" }}>
                    Amount (Expense)
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.max(filteredIncomes.length, filteredExpenses.length) }, (_, index) => (
                  <CashRow
                    key={`row-${index}`}
                    income={filteredIncomes[index] || null}
                    expense={filteredExpenses[index] || null}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer to show totals */}
          <div style={{ marginTop: "20px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    Total Income: {totalIncome.toFixed(2)}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "4px",
                      fontWeight: "bold",
                    }}
                  >
                    Total Expenses: {totalExpenses.toFixed(2)}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "4px",
                      ...netBalanceStyle
                    }}
                  >
                    Net Balance: {netBalance.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signature Section */}
          <div style={{ marginTop: "100px", textAlign: "right" }}>
            <div
              style={{
                borderBottom: "2px dotted black",
                width: "200px",
                marginLeft: "430px",
              }}
            />
            <p style={{ margin: "0", marginTop: "5px" }}>Date: {currentDate}</p>
            <p style={{ margin: "0" }}> Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFPrint;
