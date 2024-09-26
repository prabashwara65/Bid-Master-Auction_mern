import React, { useEffect, useState } from "react";
import Nav from '../Nav2/Nav2';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const URL = "http://localhost:8070/ads";

const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

function AdvertismentDetails() {
    const [advertisementDetails, setAdvertisementDetails] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAndDeleteExpiredAds = async () => {
            const data = await fetchHandler();
            const currentAds = data.ads;
            const today = new Date().toISOString().split('T')[0];
            const validAds = [];

            for (const ad of currentAds) {
                const adDate = formatDate(ad.date);
                if (adDate < today) {
                    await handleDelete(ad._id);
                } else {
                    validAds.push(ad);
                }
            }
            setAdvertisementDetails(validAds);
        };
        fetchAndDeleteExpiredAds();
    }, []);

    const handleEdit = (id) => {
        const confirmEdit = window.confirm("Are you sure you want to update this advertisement?");
        if (!confirmEdit) return;
        navigate(`/update-advertisement/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this advertisement?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${URL}/${id}`);
            setAdvertisementDetails((prevAds) => prevAds.filter((ad) => ad._id !== id));
        } catch (error) {
            console.error("Error deleting advertisement:", error);
        }
    };

    const filteredAdvertisements = advertisementDetails.filter(ad => {
        const normalizedInput = searchInput.toLowerCase();
        const matchesTitle = ad.title.toLowerCase().includes(normalizedInput);
        const matchesDate = formatDate(ad.date) === normalizedInput;
        return matchesTitle || matchesDate;
    });

    const generatePDF = async () => {
        const doc = new jsPDF();
        doc.text('Advertisement Details', 14, 16);
        const columns = ['Image', 'Title', 'Date', 'Description'];
        const rows = [];

        for (const ad of filteredAdvertisements) {
            const imageData = await getImageData(ad.image);
            rows.push([imageData || 'No Image', ad.title, formatDate(ad.date), ad.description]);
        }

        doc.autoTable({
            head: [columns],
            body: rows,
            startY: 20,
            columnStyles: {
                0: { cellWidth: 30, halign: 'center' },
            },
        });
        doc.save('advertisement_details.pdf');
    };

    return (
        <div className="advertisement-details-page">
            <Nav />
            <div className="advertisement-details-content">
                <h1>Advertisement Details</h1>
                <div className="search-pdf-container">
                    <input
                        type="text"
                        placeholder="Search by title or date (YYYY-MM-DD)"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="searchBar"
                    />
                    <button onClick={generatePDF} className="pdfButton">Generate PDF</button>
                </div>
                <div className="ad-table-wrapper">
                    <table className="ad-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdvertisements.length > 0 ? (
                                filteredAdvertisements.map((advertisement) => (
                                    <tr key={advertisement._id}>
                                        <td>
                                            <img src={advertisement.image} alt={advertisement.title} style={{ width: "100px", height: "auto" }} />
                                        </td>
                                        <td>{advertisement.title}</td>
                                        <td>{advertisement.description}</td>
                                        <td>{formatDate(advertisement.date)}</td>
                                        <td>
                                            <button className="updateButton" onClick={() => handleEdit(advertisement._id)}>Update</button>
                                            <button className="deleteButton" onClick={() => handleDelete(advertisement._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No advertisements found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdvertismentDetails;
