import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ShieldAlert, AlertTriangle, Map } from 'lucide-react';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });

const SEVERITY_COLORS = { Critical: '#dc2626', High: '#f97316', Medium: '#eab308', Low: '#3b82f6' };

const createCustomIcon = (severity) => {
  const color = SEVERITY_COLORS[severity] || '#3b82f6';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="30" height="30" stroke="white" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg>`;
  return L.icon({ iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
};

const LEGEND = [
  { label: 'Critical', color: '#dc2626' },
  { label: 'High', color: '#f97316' },
  { label: 'Medium', color: '#eab308' },
  { label: 'Low', color: '#3b82f6' },
];

const PublicMapPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/incidents/verified')
      .then(res => setIncidents(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', minHeight: '500px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Map style={{ color: '#2563eb' }} size={28} />
            Safety Map
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
            Showing {incidents.length} verified public transport incident{incidents.length !== 1 ? 's' : ''}.
          </p>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {LEGEND.map(({ label, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
              <span style={{ display: 'inline-block', width: '0.75rem', height: '0.75rem', borderRadius: '9999px', backgroundColor: color, flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Map container */}
      <div style={{ flexGrow: 1, borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgb(0,0,0,0.06)', position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 20, backgroundColor: 'rgba(248,250,252,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ backgroundColor: '#ffffff', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgb(0,0,0,0.12)', color: '#0f172a', fontWeight: '600' }}>
              Loading map...
            </span>
          </div>
        )}
        <MapContainer center={[6.9271, 79.8612]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          {incidents.map(incident => (
            <Marker key={incident.id} position={[incident.latitude, incident.longitude]} icon={createCustomIcon(incident.severity)}>
              <Popup>
                <div style={{ maxWidth: '240px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {['Critical', 'High'].includes(incident.severity)
                      ? <ShieldAlert size={15} style={{ color: '#dc2626', flexShrink: 0 }} />
                      : <AlertTriangle size={15} style={{ color: '#ca8a04', flexShrink: 0 }} />}
                    <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{incident.title}</strong>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    {incident.description}
                  </p>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <p><span style={{ fontWeight: '700', color: '#334155' }}>Category:</span> {incident.categoryName}</p>
                    <p><span style={{ fontWeight: '700', color: '#334155' }}>Transport:</span> {incident.transportType}</p>
                    <p><span style={{ fontWeight: '700', color: '#334155' }}>Location:</span> {incident.locationName}</p>
                    <p><span style={{ fontWeight: '700', color: '#334155' }}>Date:</span> {new Date(incident.incidentDate).toLocaleString()}</p>
                    <div style={{ marginTop: '0.35rem' }}>
                      <span style={{
                        display: 'inline-block', padding: '0.1rem 0.5rem', borderRadius: '9999px',
                        fontSize: '0.7rem', fontWeight: '700', backgroundColor: SEVERITY_COLORS[incident.severity] + '20',
                        color: SEVERITY_COLORS[incident.severity],
                        border: `1px solid ${SEVERITY_COLORS[incident.severity]}40`,
                      }}>
                        {incident.severity}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default PublicMapPage;
