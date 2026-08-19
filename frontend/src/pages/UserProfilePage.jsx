import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const S = {
  label: { display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.375rem' },
  input: { width: '100%', padding: '0.55rem 1rem', border: '1.5px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#0f172a', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' },
  card: { backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgb(0,0,0,0.06)', padding: '1.5rem' },
};

const UserProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '' });
  const [focusId, setFocusId] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { toast.success('Profile updated successfully'); setLoading(false); }, 1000);
  };

  const inputStyle = (id) => ({
    ...S.input,
    ...(focusId === id ? { borderColor: '#2563eb', boxShadow: '0 0 0 3px #bfdbfe' } : {}),
  });

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.875rem' }}>My Profile</h1>
        <p style={{ color: '#64748b', marginTop: '0.375rem' }}>Manage your account details and emergency contacts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
        {/* Avatar card */}
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '6rem', height: '6rem', backgroundColor: '#dbeafe', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '1rem' }}>
            <User size={48} />
          </div>
          <h2 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.25rem' }}>{user?.firstName} {user?.lastName}</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: '0.75rem' }}>{user?.email}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '0.3rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }}>
            <Shield size={14} />
            {user?.roles?.includes('ROLE_ADMIN') ? 'Administrator' : 'User'}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: 'span 2' }}>
          {/* Personal info */}
          <div style={S.card}>
            <h3 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.05rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
              Personal Information
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={S.label} htmlFor="firstName">First Name</label>
                  <input id="firstName" type="text" value={formData.firstName} onChange={handleChange}
                    style={inputStyle('firstName')}
                    onFocus={() => setFocusId('firstName')} onBlur={() => setFocusId(null)} />
                </div>
                <div>
                  <label style={S.label} htmlFor="lastName">Last Name</label>
                  <input id="lastName" type="text" value={formData.lastName} onChange={handleChange}
                    style={inputStyle('lastName')}
                    onFocus={() => setFocusId('lastName')} onBlur={() => setFocusId(null)} />
                </div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={S.label}>Email Address <span style={{ color: '#94a3b8', fontWeight: '400' }}>(cannot be changed)</span></label>
                <div style={{ ...S.input, backgroundColor: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'not-allowed' }}>
                  <Mail size={16} style={{ flexShrink: 0 }} />
                  {user?.email}
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{ backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '600', padding: '0.55rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.65 : 1 }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Emergency contacts */}
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.05rem' }}>Emergency Contacts</h3>
              <button style={{ color: '#2563eb', fontWeight: '600', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={() => toast('Feature coming soon!', { icon: 'ℹ️' })}>
                + Add New
              </button>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Add trusted contacts to notify quickly in emergencies.
            </p>
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0', padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No emergency contacts added yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
