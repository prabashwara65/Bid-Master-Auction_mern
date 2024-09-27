import React from 'react';

const CardWithLinks = () => {
  return (
    <div style={cardStyle}>
      <div style={linkContainerStyle}>
        <a href="/addsalary" style={linkStyle}>Add Salary</a>
        <a href="/updatesalary" style={linkStyle}>Update Salary</a>
        <a href="/viewreport" style={linkStyle}>View Report</a>
      </div>
    </div>
  );
};

// Styles
const cardStyle = {
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  width: '300px', // Adjust width as needed
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  margin: '20px auto', // Center card on the page
};

const headerStyle = {
  marginBottom: '15px',
};

const linkContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px', // Space between links
};

const linkStyle = {
  textDecoration: 'none',
  color: '#0070f3', // Link color
  fontSize: '18px',
  padding: '10px',
  borderRadius: '4px',
  transition: 'background-color 0.3s',
};

const linkHoverStyle = {
  backgroundColor: '#f0f0f0',
};

export default CardWithLinks;
