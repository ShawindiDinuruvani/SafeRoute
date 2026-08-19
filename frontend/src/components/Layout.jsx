import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SafeRoute. All rights reserved.</p>
          <p className="mt-2 text-xs">SafeRoute is a reporting platform and not a replacement for official emergency services. In an emergency, dial 119.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
