import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <p className="text-center">
            &copy; {new Date().getFullYear()} Computer Expenses Analysis Framework
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
