import React, { useState } from 'react';
import { useFirebase } from '../context/Firebase';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const [loginData, setLoginData] = useState({ email: '', password: '', rememberMe: false });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const firebase = useFirebase();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData({ ...loginData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await firebase.loginUser(loginData.email, loginData.password, loginData.rememberMe);
            navigate('/');
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found': setMessage('No account found with this email.'); break;
                case 'auth/wrong-password': setMessage('Incorrect password.'); break;
                case 'auth/invalid-email': setMessage('Invalid email address.'); break;
                case 'auth/invalid-credential': setMessage('Invalid email or password.'); break;
                case 'auth/too-many-requests': setMessage('Too many attempts. Try again later.'); break;
                default: setMessage('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setMessage('');
        try {
            await firebase.signinWithGoogle();
            navigate('/');
        } catch (error) {
            setMessage('Google sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg)' }}>

            {/* ── Left Panel — Branding (desktop only) ── */}
            <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden"
                style={{ backgroundColor: '#020b06' }}>

                {/* Background mine image */}
                <div className="absolute inset-0">
                    <img src="/assets/s1.jfif" alt="Coal Mine"
                        className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(2,11,6,0.6) 100%)' }} />
                </div>

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'var(--primary)' }}>
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                            <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="#000" strokeWidth="2" strokeLinejoin="round" fill="rgba(0,0,0,0.1)" />
                            <path d="M12 7v10M7 9.5l5 3 5-3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>CarbMine</span>
                </div>

                {/* Center quote */}
                <div className="relative z-10 flex flex-col gap-6">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase"
                        style={{ color: 'var(--primary)' }}>
                        India's Carbon Intelligence Platform
                    </p>
                    <h2 className="text-4xl font-black text-white leading-tight">
                        Measure.<br />
                        Neutralize.<br />
                        <span style={{ color: 'var(--primary)' }}>Profit.</span>
                    </h2>
                    <p className="text-sm text-white/50 max-w-xs leading-relaxed">
                        Join India's leading coal mine operators already tracking and reducing their carbon footprint.
                    </p>
                </div>
            </div>

            {/* ── Right Panel — Form ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:max-w-xl relative">
                {/* Close button */}
                <Link to="/"
                    className="absolute top-6 right-6 w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:scale-110"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}
                    title="Back to Home">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Link>
                
                <div className="w-full max-w-sm flex flex-col gap-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            Welcome back
                        </h1>
                        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                            Sign in to your CarbMine account
                        </p>
                    </div>

                    {/* Google Sign In */}
                    <button onClick={handleGoogleSignIn} disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border font-medium text-sm transition-all hover:scale-[1.02] disabled:opacity-50"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'var(--surface)' }}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>or continue with email</span>
                        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                Email
                            </label>
                            <input
                                type="email" name="email"
                                placeholder="you@example.com"
                                value={loginData.email}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    required
                                    className="input-field pr-10"
                                />
                                <button type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    style={{ color: 'var(--text-secondary)' }}>
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember me + Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="rememberMe"
                                    checked={loginData.rememberMe}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded accent-green-500" />
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Remember me</span>
                            </label>
                        </div>

                        {/* Error */}
                        {message && (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-500"
                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {message}
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" disabled={loading}
                            className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* Register link */}
                    <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold hover:underline"
                            style={{ color: 'var(--primary)' }}>
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;