import React from 'react';
import Map from '../Pages/Map'; // Caminho para o componente Map
import Navbar from '../Components/sidebar/sidebar'

const App: React.FC = () => {
  return (
    <div>

      <Navbar/>
        <Map />
    </div>
  );
}

export default App;
