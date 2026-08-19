import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, Clock, Filter, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const S = {
  card: { backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgb(0,0,0,0.05)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.85rem 1rem', fontSize: '0.875rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9' },
};

const ModeratorDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/moderator/incidents?page=0&size=50');
      setIncidents(response.data.content || []);
    } catch (error) {
      toast.error('Failed to load incidents for moderation.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/moderator/incidents/${id}/status?status=${newStatus}`);
      toast.success(`Incident status updated to ${newStatus}`);
      if (selectedIncident?.id === id) {
        setSelectedIncident(prev => ({ ...prev, status: newStatus }));
      }
      fetchIncidents();
    } catch (error) {
      toast.error('Failed to update incident status.');
    }
  };

  const filteredIncidents = incidents.filter(inc => {
    if (filterStatus === 'All') return true;
    return inc.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    let bg = '#f1f5f9', color = '#475569';
    if (status === 'Verified') { bg = '#dcfce7'; color = '#15803d'; }
    else if (status === 'Pending Review') { bg = '#fef3c7'; color = '#b45309'; }
    else if (status === 'Rejected') { bg = '#fee2e2'; color = '#b91c1c'; }
    return (
      <span style={{ backgroundColor: bg, color, padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700' }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={28} style={{ color: '#2563eb' }} />
            <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.875rem' }}>Moderator Dashboard</h1>
          </div>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Review, verify, and manage public safety incident submissions.</p>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ffffff', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}>
          <Filter size={16} style={{ color: '#64748b' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Filter:</span>
          {['All', 'Pending Review', 'Verified', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '0.25rem 0.65rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '600',
                border: 'none', cursor: 'pointer',
                backgroundColor: filterStatus === st ? '#2563eb' : 'transparent',
                color: filterStatus === st ? '#ffffff' : '#64748b',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>Loading incidents...</div>
      ) : filteredIncidents.length === 0 ? (
        <div style={{ ...S.card, textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
          <p style={{ fontSize: '1rem', fontWeight: '600' }}>No incidents found for filter "{filterStatus}".</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedIncident ? '1fr 400px' : '1fr', gap: '1.5rem' }}>
          {/* Table view */}
          <div style={{ ...S.card, overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={S.th}>Incident</th>
                  <th style={S.th}>Category</th>
                  <th style={S.th}>Transport</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map(inc => (
                  <tr key={inc.id} style={{ backgroundColor: selectedIncident?.id === inc.id ? '#eff6ff' : 'transparent' }}>
                    <td style={S.td}>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{inc.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{inc.locationName}</div>
                    </td>
                    <td style={S.td}>{inc.categoryName}</td>
                    <td style={S.td}>{inc.transportType}</td>
                    <td style={S.td}>{getStatusBadge(inc.status)}</td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => setSelectedIncident(inc)}
                          title="View Details"
                          style={{ padding: '0.3rem 0.6rem', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <Eye size={14} /> View
                        </button>
                        {inc.status !== 'Verified' && (
                          <button
                            onClick={() => handleStatusUpdate(inc.id, 'Verified')}
                            style={{ padding: '0.3rem 0.6rem', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Verify
                          </button>
                        )}
                        {inc.status !== 'Rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(inc.id, 'Rejected')}
                            style={{ padding: '0.3rem 0.6rem', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Details Sidebar panel */}
          {selectedIncident && (
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.1rem' }}>Review Details</h3>
                <button onClick={() => setSelectedIncident(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '700' }}>✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Title</span>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>{selectedIncident.title}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Description</span>
                  <div style={{ color: '#334155', fontSize: '0.875rem', backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>{selectedIncident.description}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Category</span>
                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.85rem' }}>{selectedIncident.categoryName}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Severity</span>
                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.85rem' }}>{selectedIncident.severity}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Transport</span>
                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.85rem' }}>{selectedIncident.transportType}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Route</span>
                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.85rem' }}>{selectedIncident.routeName || 'N/A'}</div>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Location</span>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.85rem' }}>{selectedIncident.locationName}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Reporter</span>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.85rem' }}>{selectedIncident.reporterName}</div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleStatusUpdate(selectedIncident.id, 'Verified')}
                    style={{ flex: 1, padding: '0.5rem', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Set Verified
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedIncident.id, 'Rejected')}
                    style={{ flex: 1, padding: '0.5rem', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Set Rejected
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;
