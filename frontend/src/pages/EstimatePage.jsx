import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Link, useNavigate } from 'react-router-dom';
import { calculateEmissions, calculateNeutralisation } from '../api/carbonApi';
import EstimateForm from '../components/EstimateForm';
import EmissionResultGrid from '../components/EmissionResultGrid';
import NeutralisationPanel from '../components/NeutralisationPanel';
import { usePDFExport } from '../hooks/usePDFExport';

const FORM_STORAGE_KEY = 'carbmine_estimate_form';
const EMPTY_FORM = {
    excavation: '', transportation: '', fuel: '',
    equipment: '', workers: '', output: '',
    fuelType: '', reduction: ''
};

function EstimatePage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(() => {
        try {
            const saved = localStorage.getItem(FORM_STORAGE_KEY);
            return saved ? JSON.parse(saved) : EMPTY_FORM;
        } catch {
            return EMPTY_FORM;
        }
    });

    const [results,               setResults]               = useState(null);
    const [neutralisationResults, setNeutralisationResults] = useState(null);
    const [evConversionPercentage, setEvConversionPercentage] = useState(100);
    const [neutralizePercentage,  setNeutralizePercentage]  = useState(100);
    const [greenFuelPercentage,   setGreenFuelPercentage]   = useState(100);
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState(null);
    const [currentSection, setCurrentSection] = useState(0);

    const sections = useRef([]);
    const formRef  = useRef();

    const { exportAndSave, pdfLoading, pdfSuccess } = usePDFExport();

    const handleChange = (e) => {
        const updated = { ...formData, [e.target.name]: e.target.value };
        setFormData(updated);
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(updated));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await calculateEmissions(formData);
            setResults(result);
        } catch (err) {
            setError('Failed to calculate. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handleNeutralise = useCallback(async () => {
        if (!results) return;
        try {
            const result = await calculateNeutralisation({
                green_fuel_percentage:        greenFuelPercentage,
                neutralise_percentage:        neutralizePercentage,
                ev_transportation_percentage: evConversionPercentage,
                emissions:                    results.totalEmissions,
                transportation:               formData.transportation,
                fuel:                         formData.fuel,
            });
            setNeutralisationResults(result);
        } catch (err) {
            console.error('Neutralisation error:', err);
        }
    }, [results, greenFuelPercentage, neutralizePercentage, evConversionPercentage,
        formData.transportation, formData.fuel]);

    useEffect(() => { handleNeutralise(); }, [handleNeutralise]);

    useEffect(() => {
        if (sections.current[currentSection]) {
            gsap.fromTo(
                sections.current[currentSection],
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 }
            );
        }
    }, [currentSection]);

    const handleRecalculate = () => {
        setResults(null);
        setNeutralisationResults(null);
        localStorage.removeItem(FORM_STORAGE_KEY);
        setFormData(EMPTY_FORM);
    };

    const handlePredictClick = () => {
        navigate('/predict', {
            state: {
                excavation:     formData.excavation,
                transportation: formData.transportation,
                fuel:           formData.fuel,
                equipment:      formData.equipment,
                workers:        formData.workers,
                output:         formData.output,
                fuelType:       formData.fuelType,
                reduction:      formData.reduction || '0.15',
                lat:            '23.7749',
                lng:            '86.4344',
            }
        });
    };

    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-20"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
            <div className="max-w-5xl mx-auto" ref={formRef}>

                {/* ── Page Header ── */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-px w-8" style={{ background: 'var(--primary)' }} />
                        <span className="text-xs font-bold tracking-[0.3em] uppercase"
                            style={{ color: 'var(--primary)' }}>
                            Carbon Intelligence
                        </span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                        Estimate, Analyse,
                        <br />
                        <span style={{ color: 'var(--primary)' }}>and Neutralise</span>
                    </h1>
                    <p className="mt-3 text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                        A comprehensive approach to carbon footprint management for your coal mine operations.
                    </p>
                </div>

                {/* ── Divider ── */}
                <div className="h-px w-full mb-10" style={{ background: 'var(--border)' }} />

                {/* ── Form or Results ── */}
                {!results ? (
                    <EstimateForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        currentSection={currentSection}
                        setCurrentSection={setCurrentSection}
                        sections={sections}
                        loading={loading}
                        error={error}
                    />
                ) : (
                    <div>

                        {/* Results header */}
                        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">
                                    Emission Results
                                </h2>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                    Based on your mine's operational data
                                </p>
                            </div>
                            <button
                                onClick={handleRecalculate}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:scale-105"
                                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Recalculate
                            </button>
                        </div>

                        {/* Emission Grid */}
                        <div className="rounded-2xl border p-6 mb-6"
                            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <EmissionResultGrid results={results} formData={formData} />
                        </div>

                        {/* Neutralisation Panel */}
                        <div className="rounded-2xl border p-6 mb-8"
                            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <NeutralisationPanel
                                results={results}
                                neutralisationResults={neutralisationResults}
                                evConversionPercentage={evConversionPercentage}
                                setEvConversionPercentage={setEvConversionPercentage}
                                neutralizePercentage={neutralizePercentage}
                                setNeutralizePercentage={setNeutralizePercentage}
                                greenFuelPercentage={greenFuelPercentage}
                                setGreenFuelPercentage={setGreenFuelPercentage}
                            />
                        </div>

                        {/* ── Action Buttons ── */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">

                            {/* Predict button */}
                            <button
                                onClick={handlePredictClick}
                                className="btn-primary flex-1 sm:flex-none justify-center px-6 py-3">
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    Predict Future CO₂
                                </span>
                            </button>

                            {/* PDF Button — ← FIXED: .current added */}
                            <button
                                onClick={() => exportAndSave(formRef.current)}
                                disabled={pdfLoading}
                                className="btn-primary flex-1 sm:flex-none justify-center px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                                {pdfLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                                stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Generating PDF...
                                    </span>
                                ) : pdfSuccess ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                        Saved!
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Generate & Save PDF
                                    </span>
                                )}
                            </button>

                            {/* View Reports */}
                            <Link to="/view" className="btn-ghost flex-1 sm:flex-none text-center px-6 py-3">
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    View Reports
                                </span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EstimatePage;