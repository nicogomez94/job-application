import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { scrollToTopInstant } from '../utils/scrollToTop';
import './Layout.css';

export default function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return undefined;
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    scrollToTopInstant();
  }, [location.pathname, location.search]);

  return (
    <div className="layout-container">
      <Navbar />
      <main className={`layout-main ${isAdminRoute ? 'layout-main-admin' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
