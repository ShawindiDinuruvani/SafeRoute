import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issue in React/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({ click(e) { setPosition(e.latlng); } });
  return position === null ? null : <Marker position={position} />;
};

const fieldStyle = {
  label: { display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.375rem' },
  input: {
    width: '100%', padding: '0.55rem 1rem', border: '1.5px solid #cbd5e1',
    borderRadius: '0.5rem', fontSize: '0.95rem', color: '#0f172a',
    backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
};

const FocusInput = ({ id, type = 'text', value, onChange, required, placeholder, minLength, style = {} }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input id={id} type={type} value={value} onChange={onChange} required={required}
      placeholder={placeholder} minLength={minLength}
      style={{
        ...fieldStyle.input, ...style,
        ...(focused ? { borderColor: '#2563eb', boxShadow: '0 0 0 3px #bfdbfe' } : {}),
      }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    />
  );
};

const FocusSelect = ({ id, value, onChange, required, children }) => {
  const [focused, setFocused] = useState(false);
  return (
    <select id={id} value={value} onChange={onChange} required={required}
      style={{
        ...fieldStyle.input,
        ...(focused ? { borderColor: '#2563eb', boxShadow: '0 0 0 3px #bfdbfe' } : {}),
      }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
      {children}
    </select>
  );
};

const Section = ({ title, children }) => (
  <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgb(0,0,0,0.06)' }}>
    <h2 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>{title}</h2>
    {children}
  </div>
);

const SubmitIncidentPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ lat: 6.9271, lng: 79.8612 });

  const [formData, setFormData] = useState({
    title: '', description: '', categoryId: '', severity: 'Medium',
    transportType: 'Bus', routeName: '', vehicleNumber: '',
    locationName: '', incidentDate: new Date().toISOString().slice(0, 16), isAnonymous: false,
  });

  useEffect(() => {
    api.get('/categories').then(res => {
      setCategories(res.data);
      if (res.data.length > 0) setFormData(p => ({ ...p, categoryId: res.data[0].id }));
    }).catch(() => toast.error('Failed to load categories'));
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) { toast.error('Please select a category'); return; }
    setLoading(true);
    try {
      await api.post('/incidents', {
        ...formData,
        latitude: position.lat, longitude: position.lng,
        incidentDate: new Date(formData.incidentDate).toISOString(),
      });
      toast.success('Incident reported successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally { setLoading(false); }
  };

  const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' };
  const fieldGap = { marginBottom: '1.25rem' };

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.875rem' }}>Report an Incident</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          Provide details about the safety incident. Your report will be reviewed by an administrator before appearing on the public map.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Basic Details */}
        <Section title="Basic Details">
          <div style={{ ...fieldGap }}>
            <label style={fieldStyle.label} htmlFor="title">Short Title *</label>
            <FocusInput id="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Pickpocketing on Bus 138" />
          </div>
          <div style={grid2}>
            <div>
              <label style={fieldStyle.label} htmlFor="categoryId">Category *</label>
              <FocusSelect id="categoryId" value={formData.categoryId} onChange={handleChange} required>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </FocusSelect>
            </div>
            <div>
              <label style={fieldStyle.label} htmlFor="severity">Severity *</label>
              <FocusSelect id="severity" value={formData.severity} onChange={handleChange}>
                {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s} value={s}>{s}</option>)}
              </FocusSelect>
            </div>
          </div>
          <div style={{ ...fieldGap, marginTop: '1.25rem' }}>
            <label style={fieldStyle.label} htmlFor="description">Description *</label>
            <textarea id="description" value={formData.description} onChange={handleChange} required rows="4"
              placeholder="Describe what happened in detail..."
              style={{ ...fieldStyle.input, resize: 'vertical' }}
            />
          </div>
          <div>
            <label style={fieldStyle.label} htmlFor="incidentDate">Date and Time *</label>
            <FocusInput id="incidentDate" type="datetime-local" value={formData.incidentDate} onChange={handleChange} required />
          </div>
        </Section>

        {/* Transport & Location */}
        <Section title="Transport & Location">
          <div style={{ ...grid2, marginBottom: '1.25rem' }}>
            <div>
              <label style={fieldStyle.label} htmlFor="transportType">Transport Type *</label>
              <FocusSelect id="transportType" value={formData.transportType} onChange={handleChange}>
                {['Bus', 'Train', 'Taxi', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
              </FocusSelect>
            </div>
            <div>
              <label style={fieldStyle.label} htmlFor="locationName">Location Name *</label>
              <FocusInput id="locationName" value={formData.locationName} onChange={handleChange} required placeholder="e.g. Pettah Bus Terminal" />
            </div>
            <div>
              <label style={fieldStyle.label} htmlFor="routeName">Route Name / Number (Optional)</label>
              <FocusInput id="routeName" value={formData.routeName} onChange={handleChange} placeholder="e.g. 138 Maharagama-Colombo" />
            </div>
            <div>
              <label style={fieldStyle.label} htmlFor="vehicleNumber">Vehicle Number (Optional)</label>
              <FocusInput id="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label style={fieldStyle.label}>Pinpoint on Map *</label>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Click on the map to set the exact location of the incident.</p>
            <div style={{ height: '300px', borderRadius: '0.5rem', overflow: 'hidden', border: '1.5px solid #cbd5e1', position: 'relative', zIndex: 10 }}>
              <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.375rem' }}>
              Lat: {position.lat?.toFixed(4)}, Lng: {position.lng?.toFixed(4)}
            </p>
          </div>
        </Section>

        {/* Anonymous toggle */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgb(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <p style={{ color: '#0f172a', fontWeight: '600', fontSize: '0.95rem' }}>Submit Anonymously</p>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.125rem' }}>Your name will not be visible on the public map.</p>
          </div>
          <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <input type="checkbox" id="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
            <div style={{
              width: '2.75rem', height: '1.5rem', borderRadius: '9999px',
              backgroundColor: formData.isAnonymous ? '#2563eb' : '#cbd5e1',
              position: 'relative', transition: 'background-color 0.2s',
            }}>
              <div style={{
                position: 'absolute', top: '2px',
                left: formData.isAnonymous ? 'calc(100% - 22px)' : '2px',
                width: '1.25rem', height: '1.25rem', borderRadius: '9999px',
                backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgb(0,0,0,0.2)',
                transition: 'left 0.2s',
              }} />
            </div>
          </label>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#ffffff', color: '#475569', fontWeight: '600', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', border: '1.5px solid #cbd5e1', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}>
            Cancel
          </button>
          <button type="submit" disabled={loading}
            style={{ backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '700', padding: '0.6rem 1.75rem', borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.65 : 1, transition: 'background-color 0.15s' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitIncidentPage;
