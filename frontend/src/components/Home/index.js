import { useState, useEffect } from 'react';
import Select from 'react-select';
import { locations } from '../../App'; // Import locations from App.js
import Header from '../Header/index.js';
import StationsMap from '../MapCon/index.js';
import './index.css';

const powerOptions = [
  { value: '7', label: '7 kW' },
  { value: '22', label: '22 kW' },
  { value: '50', label: '50 kW' },
  { value: '100', label: '100 kW' },
];

const connectorOptions = [
  { value: 'Type 1 (SAE J1772)', label: 'Type 1 (SAE J1772)' },
  { value: 'Type 2 (Mennekes)', label: 'Type 2 (Mennekes)' },
  { value: 'CCS1 (Combo 1)', label: 'CCS1 (Combo 1)' },
  { value: 'CCS2 (Combo 2)', label: 'CCS2 (Combo 2)' },
  { value: 'CHAdeMO', label: 'CHAdeMO' },
  { value: 'GB/T', label: 'GB/T' },
  { value: 'Tesla', label: 'Tesla' },
];

const Home = () => {
  const [stations, setStations] = useState([]);
  const [form, setForm] = useState({
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    status: 'Active',
    powerOutput: '',
    connectorType: '',
    user_id:localStorage.getItem('user_id') || '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    powerOutput: '',
    connectorType: '',
  });
  
  const [editId, setEditId] = useState(null);
  
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default center (India)

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const userId = localStorage.getItem('user_id');
        const res = await fetch(`https://charge-view.onrender.com/stations/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStations(data);
      } catch (error) {
        setErrorMsg('Failed to fetch stations');
      }
    };

    fetchStations();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


 const handleLocationChange = async (selectedOption) => {
  setForm((prev) => ({ ...prev, location: selectedOption.value }));

  const loc = selectedOption.value.split(',')[0]; // Get the city name from the selected option
  try {
    const response = await fetch(
      `https://geocode.maps.co/search?q=${loc}&api_key=683adf2393193359426509ybrb2ea4d`);
    const data = await response.json();
    console.log(response+'response from server location');

    if (data.length > 0) {
      const { lat, lon } = data[0];
      setForm((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lon,
      }));
      setMapCenter([parseFloat(lat), parseFloat(lon)]);
    } else {
      setErrorMsg('Location not found');
    }
  } catch (error) {
    setErrorMsg('Failed to fetch location coordinates');
  }
};

const createStation = async () => {
  const token = localStorage.getItem('jwt_token');
  const res = await fetch('https://charge-view.onrender.com/station', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  if (res.ok) {
    setStations((prev) => [...prev, { ...form, id: data.id || Date.now() }]);
    setForm({
      name: '',
      location: '',
      latitude: '',
      longitude: '',
      status: 'Active',
      powerOutput: '',
      connectorType: '',
      user_id: localStorage.getItem('user_id') || '',
    });
    setEditId(null);
  } else {
    setErrorMsg(data.message || 'Failed to create station');
  }
};

const updateStation = async () => {
  const token = localStorage.getItem('jwt_token');


  console.log(editId+'edit id');

  const res = await fetch(`https://charge-view.onrender.com/station/${editId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  if (res.ok) {
    setStations((prev) =>
      prev.map((station) =>
        station.id === editId ? { ...station, ...form } : station
      )
    );
    setEditId(null);
    setForm({
      name: '',
      location: '',
      latitude: '',
      longitude: '',
      status: 'Active',
      powerOutput: '',
      connectorType: '',
      user_id: localStorage.getItem('user_id') || '',
    });
  } else {
    setErrorMsg(data.message || 'Failed to update station');
  }
};

const onSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg('');
  if (editId) {
    await updateStation();
  } else {
    await createStation();
  }
};

  // Edit handler
  const handleEdit = (id) => {
    const station = stations.find((s) => s.id === id);
    if (station) {
      setEditId(id);
      setForm({
        name: station.name,
        location: station.location,
        latitude: station.latitude,
        longitude: station.longitude,
        status: station.status,
        powerOutput: station.powerOutput,
        connectorType: station.connectorType,
        user_id: station.user_id || localStorage.getItem('user_id') || '',
      });
      setMapCenter([parseFloat(station.latitude), parseFloat(station.longitude)]);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    const token = localStorage.getItem('jwt_token');
    try {
      const res = await fetch(`https://charge-view.onrender.com/station/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setStations((prev) => prev.filter((station) => station.id !== id));
      } else {
        setErrorMsg('Failed to delete station');
      }
    } catch (error) {
      setErrorMsg('Failed to delete station');
    }
  };

  // ...existing code...

// Filter stations based on filters state
const filteredStations = stations.filter(station => {
  const statusMatch = !filters.status || station.status === filters.status;
  const powerMatch = !filters.powerOutput || Number(station.powerOutput) === Number(filters.powerOutput);
  const connectorMatch = !filters.connectorType || station.connectorType === filters.connectorType;
  return statusMatch && powerMatch && connectorMatch;
});

  return (
    <>
      <Header filters={filters} setFilters={setFilters} />

      <div className="home-main-row">
        <div className="station-form-container">
          <h2>{editId ? 'Edit Charging Station' : 'Create Charging Station'}</h2>
          <form className="station-form" onSubmit={onSubmit}>
            <label>Name</label>
            <input type="text" name="name" value={form.name} onChange={onChange} required />

            <label>Connector Type</label>
            <Select
              options={connectorOptions}
              value={connectorOptions.find(opt => opt.value === form.connectorType) || null}
              onChange={option => setForm(prev => ({ ...prev, connectorType: option ? option.value : '' }))}
              placeholder="Select Connector Type"
              isSearchable
            />

            <label>Power Output (kW)</label>
            <Select
              options={powerOptions}
              value={powerOptions.find(opt => opt.value === form.powerOutput) || null}
              onChange={option => setForm(prev => ({ ...prev, powerOutput: option ? option.value : '' }))}
              placeholder="Select Power Output"
              isSearchable={false}
            />

            <label>Location</label>
            <Select 
              options={locations.map(city => ({ value: city, label: city }))}
              value={form.location ? { value: form.location, label: form.location } : null}
              onChange={handleLocationChange}
              placeholder="Select or Search a City..."
              isSearchable
            />

            <label>Status</label>
            <select name="status" value={form.status} onChange={onChange} required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button type="submit">{editId ? 'Update Station' : 'Create Station'}</button>
          </form>
        </div>
        <StationsMap
          stations={filteredStations}
          errorMsg={errorMsg}
          mapCenter={mapCenter}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default Home;
