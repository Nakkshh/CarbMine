import React, { useEffect, useState, useCallback } from 'react';
import { useFirebase } from '../context/Firebase';
import { Link } from 'react-router-dom';

function View() {
    const { fetchUserPDFs } = useFirebase();
    const [pdfs, setPDFs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadPDFs = useCallback(async () => {
        setLoading(true);
        try {
            const pdfList = await fetchUserPDFs();
            // sort newest first
            const sorted = pdfList.sort((a, b) => {
                const aTime = a.createdAt?.seconds ?? 0;
                const bTime = b.createdAt?.seconds ?? 0;
                return bTime - aTime;
            });
            setPDFs(sorted);
        } catch (error) {
            console.error('Failed to load PDFs:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchUserPDFs]);

    useEffect(() => { loadPDFs(); }, [loadPDFs]);

    // ← safe date parser handles both Firestore Timestamp and ISO string
    const parseDate = (createdAt) => {
        if (!createdAt) return new Date();
        if (createdAt?.seconds) return new Date(createdAt.seconds * 1000);
        return new Date(createdAt);
    };

    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-20"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
            <div className="max-w-3xl mx-auto">

                {/* ── Page Header ── */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-px w-8" style={{ background: 'var(--primary)' }} />
                        <span className="text-xs font-bold tracking-[0.3em] uppercase"
                            style={{ color: 'var(--primary)' }}>
                            Reports
                        </span>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight">
                                Saved <span style={{ color: 'var(--primary)' }}>Reports</span>
                            </h1>
                            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                                All your generated carbon emission PDFs in one place
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {pdfs.length > 0 && (
                                <div className="px-4 py-2 rounded-xl text-sm font-bold"
                                    style={{ background: 'rgba(0,240,32,0.1)', color: 'var(--primary)' }}>
                                    {pdfs.length} report{pdfs.length !== 1 ? 's' : ''}
                                </div>
                            )}
                            {/* Refresh button */}
                            <button
                                onClick={loadPDFs}
                                disabled={loading}
                                className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50"
                                style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)' }}
                                title="Refresh">
                                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-px mb-10" style={{ background: 'var(--border)' }} />

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24"
                            style={{ color: 'var(--primary)' }}>
                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Loading your reports...
                        </p>
                    </div>
                )}

                {/* ── Empty State ── */}
                {!loading && pdfs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                            style={{ background: 'rgba(0,240,32,0.08)' }}>
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" style={{ color: 'var(--primary)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                                No reports yet
                            </h3>
                            <p className="text-sm max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                                Generate your first carbon emission estimate and save it as a PDF report.
                            </p>
                        </div>
                        <Link to="/estimate" className="btn-primary px-6 py-2.5 text-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            Create First Report
                        </Link>
                    </div>
                )}

                {/* ── PDF List ── */}
                {!loading && pdfs.length > 0 && (
                    <div className="flex flex-col gap-4">
                        {pdfs.map((pdf, index) => {
                            const date    = parseDate(pdf.createdAt);   // ← safe parser
                            const dateStr = date.toLocaleDateString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric'
                            });
                            const timeStr = date.toLocaleTimeString('en-IN', {
                                hour: '2-digit', minute: '2-digit'
                            });

                            return (
                                <div key={pdf.id ?? index}
                                    className="rounded-2xl border p-5 flex items-center justify-between gap-4 transition-all hover:scale-[1.01]"
                                    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

                                    {/* Left — Icon + Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'rgba(0,240,32,0.08)' }}>
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor" style={{ color: 'var(--primary)' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                                Emission Report #{pdfs.length - index}
                                            </p>
                                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                                {dateStr} · {timeStr}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right — View button */}
                                    <a href={pdf.url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:scale-105 flex-shrink-0"
                                        style={{
                                            borderColor: 'var(--primary)',
                                            color:       'var(--primary)',
                                            background:  'rgba(0,240,32,0.06)'
                                        }}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        View PDF
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default View;