import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center px-4"
                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    <div className="max-w-md w-full text-center">

                        {/* Icon */}
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                            style={{ background: 'rgba(239,68,68,0.1)' }}>
                            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>

                        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                            Something went wrong
                        </h1>
                        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                            An unexpected error occurred. Try refreshing the page.
                        </p>

                        {/* Error detail (dev only) */}
                        {import.meta.env.DEV && this.state.error && (
                            <div className="text-left rounded-xl p-4 mb-6 text-xs font-mono overflow-auto max-h-32"
                                style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                                {this.state.error.toString()}
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-primary px-6 py-2.5 text-sm">
                                Refresh Page
                            </button>
                            <button
                                onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
                                className="btn-ghost px-6 py-2.5 text-sm">
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;