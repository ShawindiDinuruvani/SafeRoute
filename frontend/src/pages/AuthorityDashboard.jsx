import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bus, MapPin, AlertTriangle, FileText, CheckCircle2, Send, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

const S = {
  card: { backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgb(0,0,0,0.05)' },
  statCard: { backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' },
  input: { width: '100%', padding: '0.55rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#0f172a', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' },
  btn: { backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '700', padding: '0.55rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.9rem' },
};

const AuthorityDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [actionText, setActionText] = useState('');
  const [actionStatus, setActionStatus] = useState('In Progress');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVerifiedIncidents();
  }, []);

  const fetchVerifiedIncidents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/authority/incidents');
      setIncidents(response.data || []);
    } catch (error) {
      toast.error('Failed to load verified incidents.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAction = async (e) => {
    e.preventDefault();
    if (!selectedIncident || !actionText.trim()) {
      toast.error('Please enter action details.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/authority/incidents/${selectedIncident.id}/action`, {
        actionTaken: actionText,
        actionStatus: actionStatus,
      });
      toast.success('Action recorded successfully.');
      setActionText('');
      setSelectedIncident(null);
      fetchVerifiedIncidents();
    } catch (error) {
      toast.error('Failed to record action.');
    } finally {
      setSubmitting(false);
    }
  };

  // Compute Analytics summary
  const totalVerified = incidents.length;
  const highSeverityCount = incidents.filter(i => i.severity === 'High').length;
  const resolvedCount = incidents.filter(i => i.actionStatus === 'Resolved').length;

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bus size={28} style={{ color: '#2563eb' }} />
          <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.875rem' }}>Transport Authority Portal</h1>
        </div>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Monitor verified transport safety incidents and log corrective actions.</p>
      </div>

      {/* Analytics Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={S.statCard}>
          <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#dbeafe', color: '#2563eb' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Verified Incidents</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{totalVerified}</div>
          </div>
        </div>
        <div style={S.statCard}>
          <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#fee2e2', color: '#dc2626' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>High Severity</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{highSeverityCount}</div>
          </div>
        </div>
        <div style={S.statCard}>
          <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Actions Resolved</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{resolvedCount}</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>Loading verified incidents...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedIncident ? '1fr 440px' : '1fr', gap: '1.5rem' }}>
          {/* Main Incidents List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>Verified Incident Feed</h2>
            {incidents.length === 0 ? (
              <div style={{ ...S.card, textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                No verified incidents available for authority action.
              </div>
            ) : (
              incidents.map(inc => (
                <div key={inc.id} style={{ ...S.card, borderLeft: inc.severity === 'High' ? '4px solid #dc2626' : '4px solid #2563eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>{inc.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', fontSize: '0.8rem', color: '#64748b' }}>
                        <span>📍 {inc.locationName}</span>
                        <span>🚌 {inc.transportType} ({inc.routeName || 'General'})</span>
                        <span style={{ fontWeight: '700', color: inc.severity === 'High' ? '#dc2626' : '#2563eb' }}>{inc.severity} Severity</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedIncident(inc); setActionText(inc.actionTaken || ''); setActionStatus(inc.actionStatus || 'In Progress'); }}
                      style={{ padding: '0.4rem 0.85rem', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '0.375rem', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      {inc.actionTaken ? 'Update Action' : 'Record Action'}
                    </button>
                  </div>
                  <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#334155', backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '0.375rem' }}>
                    {inc.description}
                  </p>
                  {inc.actionTaken && (
                    <div style={{ marginTop: '0.75rem', padding: '0.65rem', backgroundColor: '#f0fdf4', borderRadius: '0.375rem', border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534' }}>Action Taken ({inc.actionStatus || 'Updated'}):</div>
                      <div style={{ fontSize: '0.85rem', color: '#15803d', marginTop: '0.2rem' }}>{inc.actionTaken}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Record Action Form Panel */}
          {selectedIncident && (
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.1rem' }}>Log Authority Action</h3>
                <button onClick={() => setSelectedIncident(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '700' }}>✕</button>
              </div>

              <form onSubmit={handleRecordAction}>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Target Incident</span>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{selectedIncident.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedIncident.locationName}</div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={S.label} htmlFor="actionStatus">Action Status</label>
                  <select
                    id="actionStatus"
                    value={actionStatus}
                    onChange={e => setActionStatus(e.target.value)}
                    style={S.input}
                  >
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Escalated">Escalated to Police</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={S.label} htmlFor="actionText">Action / Resolution Details</label>
                  <textarea
                    id="actionText"
                    rows={5}
                    value={actionText}
                    onChange={e => setActionText(e.target.value)}
                    required
                    placeholder="Describe security measures, patrol dispatch, bus driver warning, lighting repairs, or actions taken..."
                    style={S.input}
                  />
                </div>

                <button type="submit" disabled={submitting} style={{ ...S.btn, width: '100%', opacity: submitting ? 0.65 : 1 }}>
                  {submitting ? 'Submitting...' : 'Save Action Record'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthorityDashboard;
