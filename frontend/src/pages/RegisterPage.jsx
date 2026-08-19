import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const S = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 1rem' },
  card: { width: '100%', maxWidth: '26rem', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 6px rgb(0,0,0,0.06)' },
  header: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' },
  title: { color: '#0f172a', fontWeight: '800', fontSize: '1.5rem', marginTop: '0.5rem' },
  sub: { color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' },
  label: { display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.375rem' },
  input: { width: '100%', padding: '0.55rem 1rem', border: '1.5px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.95rem', color: '#0f172a', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' },
  inputFocus: { borderColor: '#2563eb', boxShadow: '0 0 0 3px #bfdbfe' },
  btn: { width: '100%', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '700', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem', transition: 'background-color 0.15s', display: 'block' },
  link: { color: '#2563eb', fontWeight: '600', textDecoration: 'none' },
  space: { marginBottom: '1rem' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
};

const InputField = ({ id, type = 'text', label, value, onChange, required, placeholder, minLength, style = {} }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={S.label} htmlFor={id}>{label}</label>
      <input
        id={id} type={type} value={value} onChange={onChange}
        required={required} placeholder={placeholder} minLength={minLength}
        style={{ ...S.input, ...(focused ? S.inputFocus : {}), ...style }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, password: formData.password });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register.');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>
          <Shield style={{ color: '#2563eb', width: '3rem', height: '3rem' }} />
          <h2 style={S.title}>Create an Account</h2>
          <p style={S.sub}>Join SafeRoute to report and track incidents</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={S.grid2}>
            <InputField id="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required />
            <InputField id="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div style={S.space}>
            <InputField id="email" type="email" label="Email Address" value={formData.email} onChange={handleChange} required />
          </div>
          <div style={S.space}>
            <InputField id="password" type="password" label="Password" value={formData.password} onChange={handleChange} required minLength={6} placeholder="Min. 6 characters" />
          </div>
          <div style={S.space}>
            <InputField id="confirmPassword" type="password" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.65 : 1 }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={S.link}
            onMouseEnter={e => e.currentTarget.style.color = '#1d4ed8'}
            onMouseLeave={e => e.currentTarget.style.color = '#2563eb'}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
