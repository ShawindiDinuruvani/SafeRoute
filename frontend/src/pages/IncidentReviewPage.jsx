import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';

const SEV_BADGE = {
  'Critical': { backgroundColor: '#fee2e2', color: '#991b1b' },
  'High': { backgroundColor: '#ffedd5', color: '#9a3412' },
  'Medium': { backgroundColor: '#fefce8', color: '#854d0e' },
  'Low': { backgroundColor: '#dbeafe', color: '#1e40af' },
};

const IncidentReviewPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPendingIncidents(); }, []);

  const fetchPendingIncidents = async () => {
    try {
      const response = await api.get('/admin/incidents?size=100');
      setIncidents((response.data.content || []).filter(i => i.status === 'Pending Review'));
    } catch { toast.error('Failed to load pending incidents'); }
    finally { setLoading(false); }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/incidents/${id}/status?status=${newStatus}`);
      toast.success(`Incident marked as ${newStatus}`);
      setIncidents(incidents.filter(i => i.id !== id));
    } catch { toast.error('Failed to update status'); }
  };

  if (loading) return (
    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading pending reports...</div>
  );

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.875rem' }}>Review Pending Reports</h1>
        <p style={{ color: '#64748b', marginTop: '0.375rem' }}>Verify or reject submitted safety incidents.</p>
      </div>

      {incidents.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', padding: '4rem', textAlign: 'center', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgb(0,0,0,0.06)' }}>
          <CheckCircle style={{ width: '4rem', height: '4rem', color: '#16a34a', margin: '0 auto 1rem' }} />
          <h2 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.25rem' }}>All caught up!</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>No pending incident reports to review.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {incidents.map((incident) => (
            <div key={incident.id} style={{
              backgroundColor: '#ffffff', borderRadius: '0.75rem',
              border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgb(0,0,0,0.06)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: '1.5rem', flexGrow: 1 }}>
                {/* Title row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                      {incident.severity === 'Critical' && <ShieldAlert size={16} style={{ color: '#dc2626' }} />}
                      <span style={{
                        fontSize: '0.7rem', fontWeight: '700', padding: '0.15rem 0.5rem',
                        borderRadius: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em',
                        ...SEV_BADGE[incident.severity] || { backgroundColor: '#f1f5f9', color: '#475569' },
                      }}>
                        {incident.severity}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={13} /> {new Date(incident.incidentDate).toLocaleString()}
                      </span>
                    </div>
                    <h3 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.125rem' }}>{incident.title}</h3>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                    <p style={{ color: '#94a3b8' }}>Reported by</p>
                    <p style={{ color: '#334155', fontWeight: '600' }}>{incident.reporterName || 'Anonymous'}</p>
                  </div>
                </div>

                {/* Description */}
                <p style={{ color: '#475569', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {incident.description}
                </p>

                {/* Meta grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.875rem' }}>
                  {[
                    ['Category', incident.categoryName],
                    ['Transport', incident.transportType],
                    ['Location', incident.locationName],
                    incident.routeName ? ['Route / Vehicle', `${incident.routeName} ${incident.vehicleNumber ? `(${incident.vehicleNumber})` : ''}`] : null,
                  ].filter(Boolean).map(([key, val]) => (
                    <div key={key}>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{key}</p>
                      <p style={{ color: '#0f172a', fontWeight: '600', marginTop: '0.1rem' }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={() => handleUpdateStatus(incident.id, 'Verified')}
                  style={{
                    backgroundColor: '#16a34a', color: '#ffffff', fontWeight: '600',
                    padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#15803d'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#16a34a'}>
                  <CheckCircle size={16} /> Verify &amp; Publish
                </button>
                <button onClick={() => handleUpdateStatus(incident.id, 'Rejected')}
                  style={{
                    backgroundColor: '#ffffff', color: '#dc2626', fontWeight: '600',
                    padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: '1.5px solid #fca5a5', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}>
                  <XCircle size={16} /> Reject
                </button>
                <button onClick={() => handleUpdateStatus(incident.id, 'Resolved')}
                  style={{
                    backgroundColor: '#ffffff', color: '#1e40af', fontWeight: '600',
                    padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: '1.5px solid #93c5fd', cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}>
                  Mark as Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentReviewPage;
