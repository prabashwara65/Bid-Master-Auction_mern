import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageBidders() {
    const [bidders, setBidders] = useState([]);

    useEffect(() => {
        const fetchBidders = async () => {
            try {
                const response = await axios.get("http://localhost:8070/bidder/all");
                setBidders(response.data);
            } catch (error) {
                console.error("Error fetching bidders:", error);
            }
        };
        fetchBidders();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8070/bidder/delete/${id}`)
            setBidders(bidders.filter(bidder => bidder._id !== id))
        } catch (error) {
            console.error("Error deleting bidder:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Manage Bidders</h1>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Address</th>
                        <th>Contact Info</th>
                        <th>Birthday</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bidders.map(bidder => (
                        <tr key={bidder._id}>
                            <td>{bidder.firstName}</td>
                            <td>{bidder.lastName}</td>
                            <td>{bidder.email}</td>
                            <td>{bidder.username}</td>
                            <td>{bidder.address}</td>
                            <td>{bidder.contactInfo}</td>
                            <td>{bidder.birthday}</td>
                            <td>
                                <button 
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(bidder._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}