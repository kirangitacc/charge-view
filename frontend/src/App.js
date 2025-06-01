import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './components/Home/index.js';
import Login from './components/Login/index.js';
import Profile from './components/Profile/index.js';
import Register from './components/Register/index.js';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Add this import

import './App.css';

// List of locations: All major Indian cities + Two cities from each country
export const locations = [
  "Mumbai, India", "Delhi, India", "Bangalore, India", "Hyderabad, India",
  "Chennai, India", "Kolkata, India", "Ahmedabad, India", "Pune, India",
  "New York, USA", "Los Angeles, USA", 
  "London, UK", "Manchester, UK", 
  "Tokyo, Japan", "Osaka, Japan", 
  "Berlin, Germany", "Hamburg, Germany",
  "Sydney, Australia", "Melbourne, Australia",
  "Paris, France", "Lyon, France",
  "Dubai, UAE", "Abu Dhabi, UAE",
  "Shanghai, China", "Beijing, China"
];

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:id"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>
);

export default App;
