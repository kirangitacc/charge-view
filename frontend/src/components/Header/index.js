import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import './index.css';

const defaultConnectorTypes = [
  "Type 1 (SAE J1772)",
  "Type 2 (Mennekes)",
  "CCS1 (Combo 1)",
  "CCS2 (Combo 2)",
  "CHAdeMO",
  "GB/T",
  "Tesla"
];

const Header = ({
  filters,
  setFilters,
  connectorTypes = defaultConnectorTypes,
  showFilters = true,
}) => {
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Left: Logo */}
        <div className="logoh">C</div>

        {/* Middle: Filters */}
        {showFilters && (
          <div className="filters-row">
            <select
              name="status"
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
              className="filter-dropdown"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              name="connectorType"
              value={filters.connectorType}
              onChange={e => setFilters(f => ({ ...f, connectorType: e.target.value }))}
              className="filter-dropdown"
            >
              <option value="">All Connectors</option>
              {defaultConnectorTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              name="powerOutput"
              value={filters.powerOutput}
              onChange={e => setFilters(f => ({ ...f, powerOutput: e.target.value }))}
              className="filter-dropdown"
            >
              <option value="">All Power</option>
              <option value="7">7 kW</option>
              <option value="22">22 kW</option>
              <option value="50">50 kW</option>
              <option value="100">100 kW</option>
            </select>
          </div>
        )}

        {/* Right: Profile & Logout */}
        <div className="auth-container">
          <Link to='/user/:id'>
            <CgProfile className="profile-logo" />
            <span className="profile-heading">Profile</span>
          </Link>
          <Link to='/'>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;