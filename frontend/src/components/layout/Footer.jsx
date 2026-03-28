import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-20 py-12">

                {/* Top row */}
                <div className="flex flex-col lg:flex-row justify-between gap-10">

                    {/* Brand */}
                    <div className="flex flex-col gap-4 max-w-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                    <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="#000" strokeWidth="2" strokeLinejoin="round" fill="rgba(0,0,0,0.1)" />
                                    <path d="M12 7v10M7 9.5l5 3 5-3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--primary)' }}>
                                CarbMine
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            India's coal carbon intelligence platform. Measure, neutralize, and profit from carbon action.
                        </p>
                        {/* Green line accent */}
                        <div className="h-0.5 w-12 rounded-full" style={{ background: 'var(--primary)' }} />
                    </div>

                    {/* Links */}
                    <div className="flex flex-col sm:flex-row gap-10">

                        <div className="flex flex-col gap-3">
                            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--primary)' }}>
                                Platform
                            </p>
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/estimate', label: 'Estimate' },
                                { to: '/calculation', label: 'Calculations' },
                                { to: '/view', label: 'Reports' },
                            ].map(link => (
                                <Link key={link.to} to={link.to}
                                    className="text-sm transition-colors duration-200 hover:underline"
                                    style={{ color: 'var(--text-secondary)' }}
                                    onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--primary)' }}>
                                Account
                            </p>
                            {[
                                { to: '/login', label: 'Login' },
                                { to: '/register', label: 'Register' },
                            ].map(link => (
                                <Link key={link.to} to={link.to}
                                    className="text-sm transition-colors duration-200"
                                    style={{ color: 'var(--text-secondary)' }}
                                    onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--primary)' }}>
                                Built With
                            </p>
                            {['React', 'Spring Boot', 'Firebase', 'Tailwind CSS'].map((tech, i) => (
                                <span key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ borderTop: '1px solid var(--border)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        © 2025 CarbMine. All Rights Reserved.
                    </span>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span>Made with</span>
                        <span style={{ color: 'var(--primary)' }}>♥</span>
                        <span>for India's coal sector</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;