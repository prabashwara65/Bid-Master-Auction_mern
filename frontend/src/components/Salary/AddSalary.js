import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddSalary.css'; // External CSS file for custom styling

function AddSalary() {
  const [basicSalary, setBasicSalary] = useState('');
  const [bonus, setBonus] = useState('');
  const [otHours, setOtHours] = useState('');
  const [otRate, setOtRate] = useState('');
  const [otAmount, setOtAmount] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const calculatedOtAmount = Math.max(0, parseFloat(otHours) * parseFloat(otRate) || 0);
    setOtAmount(calculatedOtAmount);

    const epf = Math.max(0, parseFloat(basicSalary) * 0.08 || 0);
    const etf = Math.max(0, parseFloat(basicSalary) * 0.03 || 0);

    const calculatedTotalSalary =
      Math.max(0, parseFloat(basicSalary)) +
      Math.max(0, parseFloat(bonus)) +
      calculatedOtAmount - epf - etf || 0;
    setTotalSalary(calculatedTotalSalary);
  }, [basicSalary, bonus, otHours, otRate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(basicSalary) < 0 || parseFloat(bonus) < 0 || parseFloat(otRate) < 0 || parseFloat(otHours) < 0) {
      alert("Fields cannot contain negative values.");
      return;
    }

    try {
      await axios.post('http://localhost:8070/salaries/', {
        userId: id,
        BasicSalary: parseFloat(basicSalary),
        Bonus: parseFloat(bonus),
        OTHours: parseFloat(otHours),
        OTRate: parseFloat(otRate),
      });
      navigate(`/salaryTable`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCurrencyChange = (setter) => (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setter(value);
  };

  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card shadow-sm custom-card">
              <div className="card-header text-center bg-primary text-white py-3">
                <h2 className="mb-0">Add Salary</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="custom-form">
                  <div className="mb-4 input-group">
                    <span className="input-group-text"><i className="fas fa-money-bill-wave"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      value={basicSalary}
                      onChange={handleCurrencyChange(setBasicSalary)}
                      required
                      placeholder="Basic Salary (0.00)"
                    />
                  </div>

                  <div className="mb-4 input-group">
                    <span className="input-group-text"><i className="fas fa-gift"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      value={bonus}
                      onChange={handleCurrencyChange(setBonus)}
                      required
                      placeholder="Bonus (0.00)"
                    />
                  </div>

                  <div className="mb-4 input-group">
                    <span className="input-group-text"><i className="fas fa-clock"></i></span>
                    <input
                      type="number"
                      className="form-control"
                      value={otHours}
                      onChange={(e) => setOtHours(Math.max(0, e.target.value))}
                      required
                      placeholder="OT Hours"
                    />
                  </div>

                  <div className="mb-4 input-group">
                    <span className="input-group-text"><i className="fas fa-dollar-sign"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      value={otRate}
                      onChange={handleCurrencyChange(setOtRate)}
                      required
                      placeholder="OT Rate (0.00)"
                    />
                  </div>

                  <div className="mb-3 d-flex justify-content-between">
                    <h6 className="fw-bold">OT Amount:</h6>
                    <h6>{otAmount.toFixed(2)}</h6>
                  </div>

                  <div className="mb-4 d-flex justify-content-between">
                    <h6 className="fw-bold">Total Salary:</h6>
                    <h6>{totalSalary.toFixed(2)}</h6>
                  </div>

                  <button type="submit" className="btn btn-success w-100 py-2">
                    <i className="fas fa-plus-circle me-2"></i>Add Salary
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddSalary;
