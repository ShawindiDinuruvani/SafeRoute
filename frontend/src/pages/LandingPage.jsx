import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Map, Bell } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section
        style={{ backgroundColor: '#1e40af', borderRadius: '1.5rem', marginBottom: '4rem' }}
        className="w-full py-20 px-4 text-center shadow-lg"
      >
        <h1 style={{ color: '#ffffff', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          className="text-4xl md:text-6xl mb-6">
          Safer Journeys for Everyone
        </h1>
        <p style={{ color: '#bfdbfe', fontSize: '1.125rem', maxWidth: '40rem', margin: '0 auto 2.5rem' }}>
          SafeRoute is a community-driven platform to report, track, and stay informed about
          safety incidents on public transport.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/report"
            style={{
              backgroundColor: '#ffffff',
              color: '#1d4ed8',
              fontWeight: '700',
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 1px 3px rgb(0,0,0,0.12)',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            <ShieldAlert size={20} />
            Report an Incident
          </Link>
          <Link
            to="/map"
            style={{
              backgroundColor: '#1d4ed8',
              color: '#ffffff',
              fontWeight: '700',
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: '1.5px solid #3b82f6',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e3a8a'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          >
            <Map size={20} />
            View Safety Map
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="w-full max-w-5xl mb-16">
        <h2 style={{ color: '#0f172a', fontWeight: '800', fontSize: '1.875rem', textAlign: 'center', marginBottom: '3rem' }}>
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              Icon: ShieldAlert,
              step: '1. Report',
              desc: 'Securely submit details about safety incidents or hazards you encounter on your route. You can choose to remain anonymous.',
            },
            {
              Icon: Map,
              step: '2. Verify & Map',
              desc: 'Administrators review reports to ensure accuracy. Verified incidents are instantly updated on the public safety map.',
            },
            {
              Icon: Bell,
              step: '3. Stay Safe',
              desc: 'Check the map before you travel. Identify high-risk routes and locations to make informed decisions about your journey.',
            },
          ].map(({ Icon, step, desc }) => (
            <div key={step}
              style={{
                backgroundColor: '#ffffff', borderRadius: '1rem',
                border: '1px solid #e2e8f0', padding: '2rem',
                boxShadow: '0 1px 3px rgb(0,0,0,0.06)', textAlign: 'center',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgb(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgb(0,0,0,0.06)'}
            >
              <div style={{
                backgroundColor: '#dbeafe', width: '4rem', height: '4rem',
                borderRadius: '9999px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 1.5rem', color: '#2563eb',
              }}>
                <Icon size={28} />
              </div>
              <h3 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.125rem', marginBottom: '0.75rem' }}>
                {step}
              </h3>
              <p style={{ color: '#475569', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{
        width: '100%', maxWidth: '48rem',
        backgroundColor: '#fef2f2', border: '1px solid #fca5a5',
        borderRadius: '1rem', padding: '1.5rem', textAlign: 'center',
      }}>
        <h4 style={{ color: '#b91c1c', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} />
          Important Emergency Disclaimer
        </h4>
        <p style={{ color: '#dc2626', fontSize: '0.875rem', lineHeight: 1.6 }}>
          SafeRoute is an informational platform for community awareness.{' '}
          <strong>It is NOT a replacement for official emergency services.</strong>{' '}
          If you are in immediate danger, please contact your local authorities (Police: 119) immediately.
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
