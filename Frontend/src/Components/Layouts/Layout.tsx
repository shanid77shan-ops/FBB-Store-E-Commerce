// Updated Layout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  isTransparent?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ isTransparent = false }) => {
  const location = useLocation();
  
  // Determine if NavBar should be transparent
  const shouldBeTransparent = location.pathname === '/' && isTransparent;

  return (
    <>
      <NavBar isTransparent={shouldBeTransparent} />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;