import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import useLocalStorage from '../../hooks/useLocalStorage';

const CheckSquareIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const NAV_LINKS = [
  { to: ROUTES.HOME,  label: 'Dashboard' },
  { to: ROUTES.TASKS, label: 'All Tasks' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [theme, setTheme]           = useLocalStorage('theme', 'light');
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Apply or remove dark class on HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Add shadow when page is scrolled
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-150 ${
      isActive
        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-slate-800'
          : 'bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2.5 text-primary-600 dark:text-primary-400 hover:opacity-80 transition-opacity"
            aria-label="Task Tracker Home"
          >
            <div className="flex items-center justify-center w-9 h-9 bg-primary-500 text-white rounded-xl shadow-sm">
              <CheckSquareIcon />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
              Task<span className="text-primary-500">Tracker</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === ROUTES.HOME}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="btn-icon text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            <Link
              to={ROUTES.NEW_TASK}
              id="create-task-nav-btn"
              className="btn-primary hidden sm:inline-flex btn-sm"
            >
              <PlusIcon />
              New Task
            </Link>

            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen((o) => !o)}
              className="btn-icon md:hidden text-gray-500 dark:text-gray-400"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-slate-700 py-3 animate-slide-down">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === ROUTES.HOME}>
                  {link.label}
                </NavLink>
              ))}
              <Link
                to={ROUTES.NEW_TASK}
                className="btn-primary btn-sm mt-2 w-full justify-center"
                id="create-task-mobile-btn"
              >
                <PlusIcon />
                New Task
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
