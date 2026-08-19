import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FileText, PlusCircle, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const getStatusBadge = (status) => {
  const map = {
    'Verified': { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' },
    'Pending Review': { backgroundColor: '#fefce8', color: '#854d0e', border: '1px solid #fde047' },
    'Resolved': { backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' },
    'Rejected': { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
  };
  return map[status] || { backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
};

const StatCard = ({ icon, label, count, accent }) => (
  <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgb(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ backgroundColor: accent + '20', padding: '0.75rem', borderRadius: '0.5rem', color: accent, flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.1rem' }}>{label}</p>
      <p style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>{count}</p>
    </div>
  </div>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMyIncidents(); }, []);

  const fetchMyIncidents = async () => {
    try {
      const response = await api.get('/incidents/my');
      setIncidents(response.data.content || []);
    } catch { toast.error('Failed to load your reports'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.875rem' }}>My Dashboard</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Welcome back, {user?.firstName}!</p>
        </div>
        <Link to="/report" style={{
          backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '600',
          padding: '0.6rem 1.25rem', borderRadius: '0.5rem', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          boxShadow: '0 1px 3px rgb(0,0,0,0.12)',
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}>
          <PlusCircle size={18} />
          Report Incident
        </Link>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard icon={<FileText size={22} />} label="Total Reports" count={incidents.length} accent="#2563eb" />
        <StatCard icon={<Clock size={22} />} label="Pending Review" count={incidents.filter(i => i.status === 'Pending Review').length} accent="#ca8a04" />
        <StatCard icon={<CheckCircle size={22} />} label="Verified Reports" count={incidents.filter(i => i.status === 'Verified').length} accent="#16a34a" />
      </div>

      {/* Reports table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgb(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.1rem' }}>Recent Reports</h2>
        </div>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading your reports...</div>
        ) : incidents.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <FileText style={{ width: '3rem', height: '3rem', color: '#cbd5e1', margin: '0 auto 1rem' }} />
            <h3 style={{ color: '#0f172a', fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem' }}>No reports yet</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>You haven't submitted any incident reports.</p>
            <Link to="/report" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Submit your first report →</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Title', 'Date', 'Location', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident, i) => (
                  <tr key={incident.id} style={{ borderBottom: i < incidents.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <p style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.1rem' }}>{incident.title}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{incident.categoryName} · {incident.transportType}</p>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#475569', whiteSpace: 'nowrap' }}>
                      {new Date(incident.incidentDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#475569', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {incident.locationName}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-block', padding: '0.2rem 0.65rem',
                        borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600',
                        ...getStatusBadge(incident.status),
                      }}>
                        {incident.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
