import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, UserPlus, Shield, UserCheck, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const S = {
  card: { backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 1px 3px rgb(0,0,0,0.05)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.85rem 1rem', fontSize: '0.875rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.35rem' },
  input: { width: '100%', padding: '0.55rem 0.85rem', border: '1.5px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#0f172a', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' },
  btn: { backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '700', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.9rem' },
};

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'ROLE_MODERATOR',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data || []);
    } catch (error) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/admin/users', formData);
      toast.success('User account created successfully.');
      setFormData({ email: '', password: '', firstName: '', lastName: '', role: 'ROLE_MODERATOR' });
      setShowCreateModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user account.');
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role?role=${newRole}`);
      toast.success('User role updated.');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role.');
    }
  };

  const getRoleBadge = (roleName) => {
    let bg = '#f1f5f9', color = '#475569';
    if (roleName === 'ROLE_ADMIN') { bg = '#dbeafe'; color = '#1d4ed8'; }
    else if (roleName === 'ROLE_MODERATOR') { bg = '#fef3c7'; color = '#b45309'; }
    else if (roleName === 'ROLE_TRANSPORT_AUTHORITY') { bg = '#e0e7ff'; color = '#4338ca'; }
    else if (roleName === 'ROLE_USER') { bg = '#f1f5f9'; color = '#334155'; }
    return (
      <span style={{ backgroundColor: bg, color, padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700' }}>
        {roleName.replace('ROLE_', '')}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={28} style={{ color: '#2563eb' }} />
            <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.875rem' }}>User & Staff Management</h1>
          </div>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Create and manage Moderator, Transport Authority, and Admin user accounts.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{ ...S.btn, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <UserPlus size={18} />
          Create New Staff Account
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>Loading users...</div>
      ) : (
        <div style={{ ...S.card, padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={S.th}>Name</th>
                <th style={S.th}>Email</th>
                <th style={S.th}>Role</th>
                <th style={S.th}>Created Date</th>
                <th style={S.th}>Manage Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={S.td}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{u.firstName} {u.lastName}</div>
                  </td>
                  <td style={S.td}>{u.email}</td>
                  <td style={S.td}>{getRoleBadge(u.role)}</td>
                  <td style={S.td}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td style={S.td}>
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      style={{ padding: '0.3rem 0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.8rem', color: '#334155', backgroundColor: '#ffffff' }}
                    >
                      <option value="ROLE_USER">USER</option>
                      <option value="ROLE_MODERATOR">MODERATOR</option>
                      <option value="ROLE_TRANSPORT_AUTHORITY">TRANSPORT_AUTHORITY</option>
                      <option value="ROLE_ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for creating staff user */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ ...S.card, width: '100%', maxWidth: '32rem', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.25rem' }}>Create Staff / Admin Account</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '700' }}>✕</button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={S.label} htmlFor="firstName">First Name</label>
                  <input id="firstName" type="text" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} style={S.input} placeholder="Jane" />
                </div>
                <div>
                  <label style={S.label} htmlFor="lastName">Last Name</label>
                  <input id="lastName" type="text" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} style={S.input} placeholder="Smith" />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={S.label} htmlFor="email">Email Address</label>
                <input id="email" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={S.input} placeholder="staff@saferoute.com" />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={S.label} htmlFor="password">Password</label>
                <input id="password" type="password" required minLength={6} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={S.input} placeholder="••••••••" />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={S.label} htmlFor="role">Assign Role</label>
                <select id="role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={S.input}>
                  <option value="ROLE_MODERATOR">Moderator (Incident Review)</option>
                  <option value="ROLE_TRANSPORT_AUTHORITY">Transport Authority (Action & Analytics)</option>
                  <option value="ROLE_ADMIN">Administrator (Full Access & User Management)</option>
                  <option value="ROLE_USER">Standard Public User</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: '0.6rem 1.25rem', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={creating} style={{ ...S.btn, opacity: creating ? 0.65 : 1 }}>
                  {creating ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagementPage;
