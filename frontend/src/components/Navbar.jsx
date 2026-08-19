import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Map, LogOut, User as UserIcon, LayoutDashboard, Users, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (hasRole('ROLE_ADMIN')) return '/admin/dashboard';
    if (hasRole('ROLE_MODERATOR')) return '/moderator/dashboard';
    if (hasRole('ROLE_TRANSPORT_AUTHORITY')) return '/authority/dashboard';
    return '/dashboard';
  };

  return (
    <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }} className="sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <Shield style={{ color: '#2563eb' }} className="h-8 w-8" />
            <span style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
              SafeRoute
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              to="/map"
              className="flex items-center gap-1.5"
              style={{ color: '#475569', fontWeight: '500', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              <Map className="h-5 w-5" />
              <span>Incident Map</span>
            </Link>

            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-1.5"
                  style={{ color: '#475569', fontWeight: '500', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
                  onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>

                {hasRole('ROLE_ADMIN') && (
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-1.5"
                    style={{ color: '#475569', fontWeight: '500', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                  >
                    <Users className="h-5 w-5" />
                    <span>User Management</span>
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-4" style={{ borderLeft: '1px solid #e2e8f0' }}>
                  <div style={{ backgroundColor: '#dbeafe', borderRadius: '9999px', padding: '0.4rem' }}>
                    <UserIcon style={{ color: '#2563eb' }} className="h-5 w-5" />
                  </div>
                  <span style={{ color: '#334155', fontWeight: '500', fontSize: '0.9rem' }}>{user.firstName}</span>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#64748b', padding: '0.4rem', borderRadius: '0.375rem',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 pl-4" style={{ borderLeft: '1px solid #e2e8f0' }}>
                <Link
                  to="/login"
                  style={{ color: '#475569', fontWeight: '500', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
                  onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: '600',
                    padding: '0.45rem 1.1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    display: 'inline-block',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-md"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden pb-4 pt-2" style={{ borderTop: '1px solid #e2e8f0' }}>
            <div className="flex flex-col gap-2">
              <Link to="/map" onClick={() => setMenuOpen(false)}
                style={{ color: '#334155', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontWeight: '500', textDecoration: 'none', display: 'block' }}>
                Incident Map
              </Link>
              {user ? (
                <>
                  <Link to={getDashboardPath()} onClick={() => setMenuOpen(false)}
                    style={{ color: '#334155', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontWeight: '500', textDecoration: 'none', display: 'block' }}>
                    Dashboard
                  </Link>
                  {hasRole('ROLE_ADMIN') && (
                    <Link to="/admin/users" onClick={() => setMenuOpen(false)}
                      style={{ color: '#334155', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontWeight: '500', textDecoration: 'none', display: 'block' }}>
                      User Management
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    style={{ color: '#dc2626', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    style={{ color: '#334155', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontWeight: '500', textDecoration: 'none', display: 'block' }}>
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}
                    style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontWeight: '600', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
