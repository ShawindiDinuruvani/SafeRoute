import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicMapPage from './pages/PublicMapPage';
import UserDashboard from './pages/UserDashboard';
import SubmitIncidentPage from './pages/SubmitIncidentPage';
import AdminDashboard from './pages/AdminDashboard';
import IncidentReviewPage from './pages/IncidentReviewPage';
import UserProfilePage from './pages/UserProfilePage';
import ModeratorDashboard from './pages/ModeratorDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AdminUserManagementPage from './pages/AdminUserManagementPage';

const Unauthorized = () => (
  <div style={{ textAlign: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
    <h1 style={{ color: '#dc2626', fontWeight: '800', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Unauthorized</h1>
    <p style={{ color: '#64748b' }}>You do not have permission to view this page.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="map" element={<PublicMapPage />} />
            <Route path="unauthorized" element={<Unauthorized />} />

            {/* Standard User / Authenticated Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_MODERATOR', 'ROLE_TRANSPORT_AUTHORITY', 'ROLE_ADMIN']} />}>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="report" element={<SubmitIncidentPage />} />
              <Route path="profile" element={<UserProfilePage />} />
            </Route>

            {/* Moderator Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_MODERATOR', 'ROLE_ADMIN']} />}>
              <Route path="moderator/dashboard" element={<ModeratorDashboard />} />
            </Route>

            {/* Transport Authority Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_TRANSPORT_AUTHORITY', 'ROLE_ADMIN']} />}>
              <Route path="authority/dashboard" element={<AuthorityDashboard />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/review" element={<IncidentReviewPage />} />
              <Route path="admin/users" element={<AdminUserManagementPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
