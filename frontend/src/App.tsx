import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { RideForm } from './components/RideForm';
import RideInfoMap from './components/RideInfoMap';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RideForm />} />
        <Route path="/ride/estimate" element={<RideInfoMap />} />
      </Routes>
    </Router>
  );
};
