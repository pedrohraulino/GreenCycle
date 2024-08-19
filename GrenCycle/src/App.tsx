import React from 'react';
import Map from '../Components/map/Map'; 
import Navbar from '../Components/sidebar/sidebar'

const App: React.FC = () => {
  return (
    <>
      <Navbar/>
        <Map />
    </>
  );
}

export default App;
