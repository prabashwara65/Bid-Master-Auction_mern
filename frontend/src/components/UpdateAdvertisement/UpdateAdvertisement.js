import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';


const URL = "http://localhost:8070/ads";

function UpdateAdvertisement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [adData, setAdData] = useState({
    title: '',
    description: '',
    date: '',
    image: '',
  });
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  // Dynamically set min and max date
  const updateMinAndMaxDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    setMinDate(currentDate);  // Set minimum selectable date to today

    // Calculate one month from today
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const maxYear = nextMonth.getFullYear();
    const maxMonth = String(nextMonth.getMonth() + 1).padStart(2, '0');
    const maxDay = String(nextMonth.getDate()).padStart(2, '0');
    const maxDate = `${maxYear}-${maxMonth}-${maxDay}`;
    setMaxDate(maxDate); // Set maximum selectable date to one month from today
  };

  useEffect(() => {
    updateMinAndMaxDate();

    const fetchAdvertisement = async () => {
      try {
        const response = await axios.get(`${URL}/${id}`);
        const ad = response.data.ad;
        setAdData({
          title: ad.title,
          description: ad.description,
          date: ad.date.split('T')[0],
          image: ad.image,
        });
      } catch (error) {
        console.error('Error fetching advertisement:', error);
      }
    };

    fetchAdvertisement();

    // Update the calendar daily at 00:00
    const intervalId = setInterval(() => {
      updateMinAndMaxDate(); // Update min and max date at midnight every day
    }, 60000); // Check every minute to update at 00:00

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'description') {
      // Validate to disallow special characters
      const filteredValue = value.replace(/[^a-zA-Z0-9.,\s]/g, ""); // Allow letters, numbers, spaces, periods, and commas only
      setAdData((prevAdData) => ({
        ...prevAdData,
        [name]: filteredValue,
      }));
    } else {
      setAdData((prevAdData) => ({
        ...prevAdData,
        [name]: value,
      }));
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAdData((prevAdData) => ({
        ...prevAdData,
        image: reader.result,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${URL}/${id}`, adData);
      alert('Advertisement updated successfully!');
      navigate('/AdvertisementDetails');
    } catch (error) {
      console.error('Error updating advertisement:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="container">
      <div className="content">
        <h1>Update Advertisement</h1>
        <form onSubmit={handleSubmit}>
          <label>Current Image</label>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            {adData.image && (
              <img
                src={adData.image}
                alt="Current or Preview"
                style={{ width: "100%", height: "auto", marginTop: '10px' }}
              />
            )}
          </div>
          <br />

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={adData.date}
            onChange={handleInputChange}
            min={minDate}  // Minimum selectable date (today)
            max={maxDate}  // Maximum selectable date (one month from today)
            required
          />
          <br /><br />

          <label>Title</label>
          <select
            name="title"
            value={adData.title}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Title</option>
            <option value="Jewellery">Jewellery</option>
            <option value="Collectables">Collectables</option>
            <option value="Arts">Arts</option>
          </select>
          <br /><br />

          <label>Description</label>
          <textarea
            name="description"
            value={adData.description}
            onChange={handleInputChange}
            required
          />
          <br /><br />

          <div className="center-button">
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateAdvertisement;
