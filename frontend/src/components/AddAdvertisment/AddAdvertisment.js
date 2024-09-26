import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Nav from '../Nav2/Nav2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../Firebase/firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddAdvertisment() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        image: null,
        date: "",
        title: "",
        description: "",
    });
    const [error, setError] = useState("");
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");

    // Function to update the minimum and maximum dates dynamically
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
        updateMinAndMaxDate(); // Set initial min and max dates on mount
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/jpeg, image/png, image/gif',
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            setInputs((prevState) => ({
                ...prevState,
                image: file,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");  // Clear previous errors
        if (inputs.image) {
            const storageRef = ref(storage, `advertisements/${inputs.image.name}`);
            await uploadBytes(storageRef, inputs.image)
                .then((snapshot) => getDownloadURL(snapshot.ref))
                .then((url) => {
                    submitFormData({ ...inputs, image: url });
                })
                .catch((err) => setError("Error uploading image: " + err.message));
        } else {
            submitFormData(inputs);
        }
    };

    const submitFormData = (formData) => {
        axios.post("http://localhost:8070/ads/", formData)
            .then(() => navigate("/advertisements"))
            .catch((err) => setError("Error submitting form: " + err.message));
    };

    return (
        <div className="container mt-5">
            <Nav />
            <h1>Create Advertisement</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                {error && <div className="alert alert-danger">{error}</div>}
                <label htmlFor="image" className="form-label">Image</label>
                <div {...getRootProps()} className={`border p-3 mb-3 ${imagePreviewUrl ? 'border-success' : 'border-secondary'}`}>
                    <input {...getInputProps()} id="image" />
                    <p>Drag 'n' drop an image here, or click to select an image</p>
                    {imagePreviewUrl && <img src={imagePreviewUrl} alt="Preview" className="img-fluid" />}
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        name="title"
                        value={inputs.title}
                        onChange={handleInputChange}
                        placeholder="Title"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="date"
                        name="date"
                        value={inputs.date}
                        onChange={handleInputChange}
                        min={minDate}
                        max={maxDate}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <textarea
                        name="description"
                        value={inputs.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default AddAdvertisment;
