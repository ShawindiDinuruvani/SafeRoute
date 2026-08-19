import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, FileSearch, ShieldCheck } from 'lucide-react';

const SEVERITY_COLORS = {
  'Low': '#3b82f6',
  'Medium': '#eab308',
  'High': '#f97316',
  'Critical': '#dc2626',
};

const StatCard = ({ label, count, accentColor, icon }) => (
  <div style={{
    backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem',
    border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgb(0,0,0,0.06)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
      <div style={{ backgroundColor: accentColor + '20', padding: '0.5rem', borderRadius: '0.5rem', color: accentColor }}>
        {icon}
      </div>
      <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>{label}</p>
    </div>
    <p style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>{count}</p>
  </div>
);

const AdminDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchIncidents(); }, []);

  const fetchIncidents = async () => {
    try {
      const response = await api.get('/admin/incidents?size=100');
      setIncidents(response.data.content || []);
    } catch { toast.error('Failed to load admin stats'); }
    finally { setLoading(false); }
  };

  const pendingCount = incidents.filter(i => i.status === 'Pending Review').length;
  const verifiedCount = incidents.filter(i => i.status === 'Verified').length;
  const criticalCount = incidents.filter(i => i.severity === 'Critical').length;

  const categoryCount = incidents.reduce((acc, curr) => {
    acc[curr.categoryName] = (acc[curr.categoryName] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(categoryCount).map(([name, count]) => ({ name, count }));

  const severityCount = incidents.reduce((acc, curr) => {
    acc[curr.severity] = (acc[curr.severity] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(severityCount).map(([name, value]) => ({ name, value }));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.875rem' }}>Admin Dashboard</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Platform overview and analytics</p>
        </div>
        <Link to="/admin/review" style={{
          backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '600',
          padding: '0.6rem 1.25rem', borderRadius: '0.5rem', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          boxShadow: '0 1px 3px rgb(0,0,0,0.12)',
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}>
          <FileSearch size={18} />
          Review Pending Reports
        </Link>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading stats...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <StatCard label="Total Reports" count={incidents.length} accentColor="#64748b" icon={<AlertCircle size={20} />} />
            <StatCard label="Pending Review" count={pendingCount} accentColor="#ca8a04" icon={<FileSearch size={20} />} />
            <StatCard label="Verified" count={verifiedCount} accentColor="#16a34a" icon={<ShieldCheck size={20} />} />
            <StatCard label="Critical Incidents" count={criticalCount} accentColor="#dc2626" icon={<AlertCircle size={20} />} />
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgb(0,0,0,0.06)' }}>
              <h2 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1rem', marginBottom: '1.5rem' }}>Incidents by Category</h2>
              <div style={{ height: '300px' }}>
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} angle={-35} textAnchor="end" />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <RechartsTooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 12px rgb(0,0,0,0.12)', backgroundColor: '#ffffff', color: '#0f172a' }} />
                      <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data yet</div>
                )}
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgb(0,0,0,0.06)' }}>
              <h2 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1rem', marginBottom: '1.5rem' }}>Incidents by Severity</h2>
              <div style={{ height: '300px' }}>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || '#3b82f6'} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 12px rgb(0,0,0,0.12)', backgroundColor: '#ffffff', color: '#0f172a' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data yet</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
