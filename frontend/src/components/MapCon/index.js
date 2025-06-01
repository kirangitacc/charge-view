import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaEdit, FaTrash } from 'react-icons/fa';

const StationsMap = ({ stations, mapCenter, errorMsg, onEdit, onDelete }) => (
  <div className="stations-list-container">
    <h2>Charging Stations Map</h2>
    {errorMsg && <p className="station-err-msg">{errorMsg}</p>}
    <MapContainer center={mapCenter} zoom={10} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {stations.map((station) => {
        // Choose color based on status
        const isActive = station.status === 'Active';
        const bgColor = isActive ? '#43a047' : '#e53935'; // green or red
        const borderColor = isActive ? '#1b5e20' : '#b71c1c';
        const boxShadow = isActive
          ? '0 0 16px 4px rgba(67,160,71,0.3)'
          : '0 0 16px 4px rgba(229,57,53,0.3)';

        const icon = new L.DivIcon({
          className: 'custom-status-c-marker',
          html: `
            <div style="
              width:32px;
              height:32px;
              display:flex;
              align-items:center;
              justify-content:center;
              position:relative;
            ">
              <div style="
                width:28px;
                height:28px;
                background:${bgColor};
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                box-shadow:${boxShadow};
                border:2px solid ${borderColor};
                font-weight:bold;
                font-size:18px;
                color:#fff;
                font-family:sans-serif;
                position:absolute;
                top:0;
                left:0;
              ">
                C
              </div>
              <div style="
                width:0;
                height:0;
                border-left:8px solid transparent;
                border-right:8px solid transparent;
                border-top:14px solid ${bgColor};
                position:absolute;
                left:8px;
                top:22px;
                filter:blur(0.5px);
              "></div>
            </div>
          `,
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -40]
        });

        return (
          <Marker
            key={station.id}
            position={[parseFloat(station.latitude), parseFloat(station.longitude)]}
            icon={icon}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>{station.name}</strong><br />
                Location: {station.location}<br />
                Power: {station.powerOutput} kW<br />
                Connector: {station.connectorType}<br />
                Status: {station.status}
                <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    title="Edit"
                    onClick={() => onEdit && onEdit(station.id)}
                  >
                    <FaEdit color="#1976d2" size={18} />
                  </button>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    title="Delete"
                    onClick={() => onDelete && onDelete(station.id)}
                  >
                    <FaTrash color="#d32f2f" size={18} />
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  </div>
);

export default StationsMap;

