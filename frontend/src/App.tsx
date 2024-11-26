import React from 'react';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { RideEstimatePage } from './components/RideEstimatePage'; // Certifique-se de que o caminho esteja correto
import { RideForm } from './components/RideForm'; // Certifique-se de que o caminho esteja correto

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RideForm />} />
        <Route path="/ride/estimate" element={<RideEstimatePage />} />
      </Routes>
    </Router>
  );
};

export default App; 
