import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFirebase } from '../../context/Firebase';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const { isLoggedIn, logoutUser } = useFirebase();
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const isHomePage = location.pathname === '/';
    const showBg = scrolled || !isHomePage;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target))
                setIsProfileOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => { setIsNavOpen(false); }, [location]);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/estimate', label: 'Estimate' },
        { to: '/calculation', label: 'Calculations' },
        { to: '/predict',    label: 'Predict' }, 
        { to: '/view', label: 'Reports' },
    ];

    const isActive = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    const activeLinkStyle = { background: 'var(--primary)', color: '#000' };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                backgroundColor: showBg
                    ? isDark ? 'rgba(2, 11, 6, 0.85)' : 'rgba(255, 255, 255, 0.92)'
                    : 'transparent',
                backdropFilter: showBg ? 'blur(12px)' : 'none',
                WebkitBackdropFilter: showBg ? 'blur(12px)' : 'none',
                borderBottom: showBg ? '1px solid var(--border)' : 'none',
                boxShadow: showBg
                    ? isDark ? '0 4px 24px rgba(0,240,32,0.05)' : '0 4px 24px rgba(0,0,0,0.08)'
                    : 'none',
            }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200" style={{ background: 'var(--primary)' }}>
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="#000" strokeWidth="2" strokeLinejoin="round" fill="rgba(0,0,0,0.1)" />
                                <path d="M12 7v10M7 9.5l5 3 5-3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight" style={{ color: showBg ? 'var(--primary)' : 'white' }}>
                            CarbMine
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <ul className="hidden lg:flex items-center gap-1">
                        {navLinks.map(link => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                    style={isActive(link.to)
                                        ? activeLinkStyle
                                        : { color: showBg ? 'var(--text-primary)' : 'rgba(255,255,255,0.9)' }
                                    }
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">

                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} title="Toggle theme"
                            className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 hover:scale-110"
                            style={{
                                borderColor: showBg ? 'var(--border)' : 'rgba(255,255,255,0.3)',
                                color: showBg ? 'var(--text-primary)' : 'white',
                                background: 'transparent'
                            }}>
                            {isDark ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {/* Auth */}
                        {!isLoggedIn ? (
                            <div className="hidden lg:flex items-center gap-2">
                                <Link to="/login"
                                    className="px-4 py-2 rounded-xl font-semibold text-sm border transition-all hover:scale-105"
                                    style={{
                                        borderColor: showBg ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                                        color: showBg ? 'var(--primary)' : 'white',
                                    }}>
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm">Register</Link>
                            </div>
                        ) : (
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="w-9 h-9 rounded-full flex items-center justify-center border-2 hover:scale-110 transition-all duration-200"
                                    style={{
                                        borderColor: showBg
                                            ? isDark ? 'white' : 'var(--primary)'
                                            : 'rgba(255,255,255,0.6)',
                                        background: showBg
                                            ? isDark ? 'black' : 'transparent'
                                            : 'transparent',
                                        color: showBg
                                            ? isDark ? 'white' : 'var(--primary)'
                                            : 'white',
                                    }}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 top-12 w-48 rounded-xl border p-2 bg-white dark:bg-[#0a1a0d] border-gray-200 dark:border-green-900 shadow-xl z-50">
                                        <div className="px-3 py-2 mb-1">
                                            <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Signed in</p>
                                        </div>
                                        <hr className="border-gray-100 dark:border-green-900 mb-1" />
                                        <button
                                            onClick={() => { logoutUser(); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150 font-medium">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Hamburger */}
                        <button onClick={() => setIsNavOpen(!isNavOpen)}
                            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center border border-gray-200 dark:border-green-900 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200">
                            {isNavOpen ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isNavOpen && (
                    <div className="lg:hidden border-t border-white/20 py-3 pb-4"
                        style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
                        <ul className="flex flex-col gap-1">
                            {navLinks.map(link => (
                                <li key={link.to}>
                                    <Link to={link.to}
                                        className="block px-4 py-2.5 rounded-lg text-sm font-medium text-white/90 transition-all"
                                        style={isActive(link.to) ? activeLinkStyle : {}}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {!isLoggedIn && (
                            <div className="flex gap-2 mt-3 px-2">
                                <Link to="/login" className="btn-ghost text-sm flex-1 text-center">Login</Link>
                                <Link to="/register" className="btn-primary text-sm flex-1 text-center">Register</Link>
                            </div>
                        )}
                        {isLoggedIn && (
                            <button onClick={logoutUser}
                                className="mt-3 mx-2 w-[calc(100%-16px)] flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-red-500 border border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                Logout
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;