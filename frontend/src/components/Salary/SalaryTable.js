import React from 'react';
import NavigationCard from './components/naviagteLinks'; // Adjust the path as necessary
import BlankCard from './components/blackCard'; // Adjust the path as necessary
import StackedChart from './components/StackedChart';

// Main App component
const App = () => {
  return (
    <div style={mainContainerStyle}>
      
      {/* NavigationCard on top-left */}
      <div style={topLeftContainer}>
        <NavigationCard />
      </div>
      
      {/* Blank cards in a container on top-right */}
      <div style={topRightContainer}>
        <BlankCard />
      </div>

      {/* StackedChart  */}
      <div>
        <StackedChart />
      </div>

    </div>
  );
};

// Styles for the main container that wraps both sections
const mainContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '20px',
};

// Styles for the top-left (NavigationCard)
const topLeftContainer = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
};

// Styles for the top-right (BlankCards)
const topRightContainer = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  marginLeft: 'auto', // Pushes this section to the right
};

export default App;
