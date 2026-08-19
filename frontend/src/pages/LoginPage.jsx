import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const S = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 1rem' },
  card: { width: '100%', maxWidth: '28rem', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 6px rgb(0,0,0,0.06)' },
  header: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' },
  title: { color: '#0f172a', fontWeight: '800', fontSize: '1.5rem', marginTop: '0.5rem' },
  sub: { color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' },
  label: { display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.375rem' },
  input: { width: '100%', padding: '0.55rem 1rem', border: '1.5px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '0.95rem', color: '#0f172a', backgroundColor: '#ffffff', outline: 'none', boxSizing: 'border-box' },
  inputFocus: { borderColor: '#2563eb', boxShadow: '0 0 0 3px #bfdbfe' },
  btn: { width: '100%', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '700', padding: '0.65rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem', transition: 'background-color 0.15s' },
  link: { color: '#2563eb', fontWeight: '600', textDecoration: 'none' },
  space: { marginBottom: '1.1rem' },
};

const InputField = ({ id, type, label, value, onChange, required, placeholder, minLength }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={S.space}>
      <label style={S.label} htmlFor={id}>{label}</label>
      <input
        id={id} type={type} value={value} onChange={onChange}
        required={required} placeholder={placeholder} minLength={minLength}
        style={{ ...S.input, ...(focused ? S.inputFocus : {}) }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please enter both email and password.'); return; }
    setLoading(true);
    try {
      const userData = await login(email, password);
      toast.success('Login successful!');
      
      const roles = userData.roles || [];
      if (roles.includes('ROLE_ADMIN') || roles.includes('ADMIN')) {
        navigate('/admin/dashboard');
      } else if (roles.includes('ROLE_MODERATOR') || roles.includes('MODERATOR')) {
        navigate('/moderator/dashboard');
      } else if (roles.includes('ROLE_TRANSPORT_AUTHORITY') || roles.includes('TRANSPORT_AUTHORITY')) {
        navigate('/authority/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>
          <Shield style={{ color: '#2563eb', width: '3rem', height: '3rem' }} />
          <h2 style={S.title}>Welcome Back</h2>
          <p style={S.sub}>Log in to your SafeRoute account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <InputField id="email" type="email" label="Email Address" value={email}
            onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          <InputField id="password" type="password" label="Password" value={password}
            onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.65 : 1 }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={S.link}
            onMouseEnter={e => e.currentTarget.style.color = '#1d4ed8'}
            onMouseLeave={e => e.currentTarget.style.color = '#2563eb'}>
            Sign up
          </Link>
        </p>


      </div>
    </div>
  );
};

export default LoginPage;
