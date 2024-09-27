import React from 'react';

const BlankCard = () => {
  return (
    <div style={cardStyle}></div>
  );
};

// Styles for the card
const cardStyle = {
  width: '200px',
  height: '80px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  margin: '5px', // Space between cards
  backgroundColor: '#f9f9f9', // Light background color
  gap: '60px',
};

// Main App component
const App = () => {
  return (
    <div style={containerStyle}>
      <BlankCard />
      <BlankCard />
      <BlankCard />
      <BlankCard />
      <BlankCard />
    </div>
  );
};

// Styles for the flex container
const containerStyle = {
  display: 'flex',
  justifyContent: 'center', // Space between cards
  alignItems: 'flex-start', // Align items at the top
  margin: '20px 0', // Margin for the container
};

export default App;
