import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SECTIONS = [
    { label: 'Excavation', unit: 'tons', name: 'excavation', type: 'number', icon: '⛏️', hint: 'Total coal excavated in tons', desc: 'Include all surface and underground excavation' },
    { label: 'Transportation', unit: 'km', name: 'transportation', type: 'number', icon: '🚛', hint: 'Total distance traveled for coal transport', desc: 'Sum of all vehicle routes across all sites' },
    { label: 'Fuel Consumption', unit: 'liters', name: 'fuel', type: 'number', icon: '⛽', hint: 'Total fuel consumed across all operations', desc: 'Include machinery, generators and vehicles' },
    { label: 'Equipment Usage', unit: 'hours', name: 'equipment', type: 'number', icon: '🏗️', hint: 'Total hours of heavy equipment operation', desc: 'Bulldozers, excavators, drills combined' },
    { label: 'Number of Workers', unit: '', name: 'workers', type: 'number', icon: '👷', hint: 'Total workforce including contractors', desc: 'Full-time, part-time and contract workers' },
    { label: 'Emissions after Mitigation', unit: 'tons CO₂', name: 'reduction', type: 'number', icon: '📉', hint: 'Projected emissions after applying policies', desc: 'Based on current mitigation measures in place' },
    { label: 'Annual Coal Production', unit: 'tons', name: 'output', type: 'number', icon: '📦', hint: 'Total annual coal output', desc: 'Gross production before processing losses' },
];

const FUEL_OPTIONS = [
    { value: 'coal', label: 'Coal', icon: '🪨', desc: 'Highest emission factor' },
    { value: 'oil', label: 'Oil', icon: '🛢️', desc: 'Medium-high emissions' },
    { value: 'naturalGas', label: 'Natural Gas', icon: '💨', desc: 'Lower carbon intensity' },
    { value: 'biomass', label: 'Biomass', icon: '🌿', desc: 'Renewable, near-neutral' },
];

const TOTAL_STEPS = SECTIONS.length + 1; // +1 for fuel type at step 5

const EstimateForm = ({
    formData, handleChange, handleSubmit,
    currentSection, setCurrentSection,
    sections, loading, error
}) => {
    const cardRef = useRef(null);
    const prevSection = useRef(currentSection);

    // ── Animate between steps
    useEffect(() => {
        if (!cardRef.current) return;
        const direction = currentSection > prevSection.current ? 1 : -1;
        gsap.fromTo(cardRef.current,
            { opacity: 0, x: direction * 40 },
            { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' }
        );
        prevSection.current = currentSection;
    }, [currentSection]);

    const showNext = () => {
        if (currentSection < TOTAL_STEPS - 1)
            setCurrentSection(currentSection + 1);
    };
    const showPrev = () => {
        if (currentSection > 0)
            setCurrentSection(currentSection - 1);
    };

    // ── Enter key → next (except last step)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const isLastStep = currentSection === TOTAL_STEPS - 1;
            if (isLastStep) {
                handleSubmit(e);
            } else {
                showNext();
            }
        }
    };

    const progressPct = (currentSection / (TOTAL_STEPS - 1)) * 100;

    // Map currentSection to SECTIONS array index
    const getSectionData = () => {
        if (currentSection === 5) return null; // fuel type
        const idx = currentSection < 5 ? currentSection : currentSection - 1;
        return SECTIONS[idx];
    };
    const sectionData = getSectionData();
    const isFuelStep = currentSection === 5;
    const isLastStep = currentSection === TOTAL_STEPS - 1;

    return (
        <div className="w-full max-w-2xl mx-auto">

            {/* ── Progress bar + dots ── */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold tracking-widest uppercase"
                        style={{ color: 'var(--text-secondary)' }}>
                        Step {currentSection + 1} of {TOTAL_STEPS}
                    </span>
                    <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                        {Math.round(progressPct)}% complete
                    </span>
                </div>

                {/* Bar */}
                <div className="h-1.5 rounded-full w-full mb-4" style={{ background: 'var(--border)' }}>
                    <div className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%`, background: 'var(--primary)' }} />
                </div>

                {/* Step dots */}
                <div className="flex items-center justify-between px-1">
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <button key={i} type="button"
                            onClick={() => {
                                // Only allow going back to completed steps
                                if (i <= currentSection) setCurrentSection(i);
                            }}
                            className="flex flex-col items-center gap-1 group"
                            title={i < 5 ? SECTIONS[i].label : i === 5 ? 'Fuel Type' : SECTIONS[i - 1].label}>
                            <div className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                                style={{
                                    background: i < currentSection
                                        ? 'var(--primary)'
                                        : i === currentSection
                                            ? 'var(--primary)'
                                            : 'var(--border)',
                                    transform: i === currentSection ? 'scale(1.4)' : 'scale(1)',
                                    opacity: i > currentSection ? 0.4 : 1,
                                    cursor: i <= currentSection ? 'pointer' : 'default'
                                }} />
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Main Card ── */}
            <div ref={cardRef} className="rounded-2xl border p-8 lg:p-10"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-500 mb-6"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>

                    {/* ── Number input steps ── */}
                    {!isFuelStep && sectionData && (
                        <div ref={(el) => (sections.current[currentSection] = el)}>

                            {/* Header */}
                            <div className="flex items-start gap-4 mb-8">
                                <span className="text-4xl">{sectionData.icon}</span>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight"
                                        style={{ color: 'var(--text-primary)' }}>
                                        {sectionData.label}
                                    </h3>
                                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                        {sectionData.hint}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                                        {sectionData.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Large input */}
                            <div className="relative mb-2">
                                <input
                                    type={sectionData.type}
                                    name={sectionData.name}
                                    value={formData[sectionData.name]}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                    placeholder="0"
                                    className="input-field text-2xl font-bold pr-24 py-4"
                                    style={{ fontSize: '1.5rem' }}
                                />
                                {sectionData.unit && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                                        style={{ color: 'var(--primary)' }}>
                                        {sectionData.unit}
                                    </span>
                                )}
                            </div>

                            {/* Enter hint */}
                            <p className="text-xs mb-8 flex items-center gap-1.5"
                                style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                                <kbd className="px-1.5 py-0.5 rounded text-xs font-mono border"
                                    style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                                    Enter
                                </kbd>
                                to {isLastStep ? 'calculate' : 'continue'}
                            </p>

                            {/* Nav */}
                            <div className="flex justify-between gap-3">
                                {currentSection > 0 ? (
                                    <button type="button" onClick={showPrev}
                                        className="btn-ghost px-5 py-2.5 text-sm">
                                        ← Previous
                                    </button>
                                ) : <div />}
                                {!isLastStep ? (
                                    <button type="button" onClick={showNext}
                                        className="btn-primary px-6 py-2.5 text-sm">
                                        Next →
                                    </button>
                                ) : (
                                    <button type="submit" disabled={loading}
                                        className="btn-primary px-6 py-2.5 text-sm relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? (
                                            <>
                                                {/* Loading bar */}
                                                <span className="absolute bottom-0 left-0 h-0.5 animate-pulse w-full"
                                                    style={{ background: 'rgba(0,0,0,0.3)' }} />
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Calculating...
                                                </span>
                                            </>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Calculate Emissions
                                            </span>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Fuel Type step ── */}
                    {isFuelStep && (
                        <div ref={(el) => (sections.current[5] = el)}>

                            <div className="flex items-start gap-4 mb-8">
                                <span className="text-4xl">🔥</span>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight"
                                        style={{ color: 'var(--text-primary)' }}>
                                        Fuel Type
                                    </h3>
                                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                        Primary fuel used in your operations
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {FUEL_OPTIONS.map(opt => (
                                    <button key={opt.value} type="button"
                                        onClick={() => handleChange({ target: { name: 'fuelType', value: opt.value } })}
                                        className="flex items-center gap-3 p-4 rounded-xl border text-left transition-all hover:scale-[1.02]"
                                        style={{
                                            borderColor: formData.fuelType === opt.value ? 'var(--primary)' : 'var(--border)',
                                            background: formData.fuelType === opt.value ? 'rgba(0,240,32,0.08)' : 'var(--bg)',
                                        }}>
                                        <span className="text-2xl">{opt.icon}</span>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                                {opt.label}
                                            </span>
                                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                {opt.desc}
                                            </span>
                                        </div>
                                        {formData.fuelType === opt.value && (
                                            <svg className="w-4 h-4 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor" style={{ color: 'var(--primary)' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Enter hint */}
                            <p className="text-xs mb-6 flex items-center gap-1.5"
                                style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                                <kbd className="px-1.5 py-0.5 rounded text-xs font-mono border"
                                    style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                                    Enter
                                </kbd>
                                to continue
                            </p>

                            <div className="flex justify-between gap-3">
                                <button type="button" onClick={showPrev}
                                    className="btn-ghost px-5 py-2.5 text-sm">
                                    ← Previous
                                </button>
                                <button type="button" onClick={showNext}
                                    disabled={!formData.fuelType}
                                    className="btn-primary px-6 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EstimateForm;