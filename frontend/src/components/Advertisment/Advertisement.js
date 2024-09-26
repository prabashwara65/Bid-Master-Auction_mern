import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Advertisement(props) {
  const { _id, image, date, title, description } = props.advertisement;

  const history = useNavigate();

  const deleteHandler = async()=>{
    await axios.delete(`http://localhost:8070/ads/${_id}`)
    .then(res=>res.data)
    .then(() =>history("/"))
    .then(() =>history("/AdvertisementDetails"))
  }

  return (
    <div>
      <h1>Advertisement Display</h1>
      <br />
      <h1>ID: {_id}</h1>
      <h1>Image: <img src={image} alt="Advertisement" style={{ maxWidth: '90px' }} /></h1>
      <h1>Date: {date}</h1>
      <h1>Title: {title}</h1>
      <h1>Description: {description}</h1>
      <Link to={`/update-advertisement/${_id}`}>
        <button>Update</button>
      </Link>
      <br /><br />
      <button onClick={deleteHandler}>Delete</button>
      <br /><br />
    </div>
  );
}

export default Advertisement;
