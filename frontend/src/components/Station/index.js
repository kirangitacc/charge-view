import { FaTrash, FaEdit } from 'react-icons/fa';
import './index.css';

const Station = ({ id, name, latitude, longitude, status, powerOutput, connectorType, onDelete, onEdit }) => {
  return (
    <div className="station-card">
      <div className="station-details">
        <h3>{name}</h3>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Power Output:</strong> {powerOutput} kW</p>
        <p><strong>Connector Type:</strong> {connectorType}</p>
        <p><strong>Latitude:</strong> {latitude}</p>
        <p><strong>Longitude:</strong> {longitude}</p>
      </div>
      <div className="station-actions">
        <button className="station-action-btn" title="Edit" onClick={() => onEdit && onEdit(id)}>
          <FaEdit />
        </button>
        <button className="station-action-btn" title="Delete" onClick={() => onDelete && onDelete(id)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default Station;