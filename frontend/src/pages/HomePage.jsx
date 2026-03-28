import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HomePage = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo('.hero-line',
            { opacity: 0, y: 80, skewY: 3 },
            { opacity: 1, y: 0, skewY: 0, duration: 1, stagger: 0.15, ease: 'power4.out' }
        );
        gsap.fromTo('.hero-sub',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' }
        );
        gsap.fromTo('.hero-cta',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: 'power3.out' }
        );

        ScrollTrigger.batch(['.reveal-up', '.reveal-left', '.reveal-right'], {
            start: '10% 85%',
            once: true,
            onEnter: batch => gsap.fromTo(batch,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', overwrite: true }
            ),
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)', overflowX: 'hidden' }}>

            {/* ════════════════════════════════════════
                HERO — Full bleed image, raw typography
            ════════════════════════════════════════ */}
            <section className="relative min-h-screen flex flex-col justify-end pb-16 px-6 lg:px-20">

                {/* Full bleed bg image */}
                <div className="absolute inset-0 z-0">
                    <img src="./assets/s1.jfif" alt="Coal Mine"
                        className="w-full h-full object-cover"
                        loading="eager" />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.2) 100%)' }} />
                    {/* Green tint strip at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'var(--primary)' }} />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto w-full">
                    {/* Eyebrow */}
                    <p className="hero-sub text-xs lg:text-base font-semibold tracking-[0.3em] uppercase mb-6"
                        style={{ color: 'white' }}>
                        India's Coal Carbon Intelligence Platform
                    </p>

                    {/* Massive headline */}
                    <div className="overflow-hidden mb-2">
                        <h1 className="hero-line text-[13vw] lg:text-[9vw] font-black uppercase leading-none text-white tracking-tighter">
                            Carb
                            <span style={{ color: 'var(--primary)', WebkitTextStroke: '0px' }}>Mine</span>
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-8">
                        <p className="hero-line text-xl lg:text-3xl font-light text-white/80 max-w-2xl leading-relaxed">
                            Empowering India's coal industry to measure,<br />
                            neutralize, and profit from carbon action.
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="hero-cta flex flex-wrap items-center gap-4">
                        <Link to="/estimate"
                            className="group flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-sm text-black transition-all hover:scale-105"
                            style={{ background: 'var(--primary)' }}>
                            Start Estimating
                            <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <Link to="/calculation"
                            className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white border border-white/30 hover:border-white/60 transition-all hover:scale-105">
                            View Calculations
                        </Link>
                    </div>

                    {/* Inline stats */}
                    <div className="hero-cta mt-14 flex flex-wrap gap-10 border-t border-white/10 pt-8">
                        {/* {[
                            { v: '500+', l: 'Mines Tracked' },
                            { v: '2.4M T', l: 'CO₂ Estimated' },
                            { v: '₹12Cr+', l: 'Credits Generated' },
                            { v: '98%', l: 'Accuracy' },
                        ].map((s, i) => (
                            <div key={i}>
                                <div className="text-2xl font-black text-white">{s.v}</div>
                                <div className="text-xs text-white/50 mt-0.5 tracking-wide uppercase">{s.l}</div>
                            </div>
                        ))} */}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════
                MARQUEE STRIP
            ════════════════════════════════════════ */}
            <div className="py-4 overflow-hidden border-y" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                <div className="marquee-inner flex gap-10 whitespace-nowrap w-max">
                    {[...Array(2)].map((_, di) => (
                        <div key={di} className="flex gap-10 items-center">
                            {['Carbon Footprint Tracking', 'Emission Estimation', 'Carbon Credits', 'Neutralization Planning', 'Data Visualization', 'PDF Reports', 'Mine Analytics', 'Green Compliance'].map((t, i) => (
                                <span key={i} className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest px-2"
                                    style={{ color: 'var(--text-secondary)' }}>
                                    <span style={{ color: 'var(--primary)' }}>✦</span>
                                    {t}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ════════════════════════════════════════
                SECTION 01 — Emission Estimation
                Layout: Big number left, content right
            ════════════════════════════════════════ */}
            <section className="py-24 px-6 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">

                        {/* Left — big number + image */}
                        <div className="reveal-left flex-1 flex flex-col gap-6">
                            <div className="text-[120px] lg:text-[160px] font-black leading-none select-none"
                                style={{ color: 'var(--primary)', opacity: 0.15, lineHeight: 1 }}>
                                01
                            </div>
                            <div className="mt-[-60px] relative rounded-2xl overflow-hidden aspect-[4/3]">
                                <img src="./assets/coal.jpg" alt="Coal Mine" loading="lazy"
                                    className="w-full h-full object-cover" />
                                <div className="absolute inset-0"
                                    style={{ background: 'linear-gradient(135deg, rgba(0,240,32,0.15) 0%, transparent 60%)' }} />
                            </div>
                        </div>

                        {/* Right — content */}
                        <div className="reveal-right flex-1 flex flex-col justify-center gap-8 lg:pt-24">
                            <span className="text-xs font-bold tracking-[0.3em] uppercase"
                                style={{ color: 'var(--primary)' }}>Emission Estimation</span>
                            <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                                Know Every Tonne<br />
                                <span style={{ color: 'var(--primary)' }}>You Emit</span>
                            </h2>
                            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                From excavation to transportation to workforce — every emission source captured, quantified, and reported in one dashboard.
                            </p>

                            <div className="flex flex-col gap-4">
                                {[
                                    { no: '—01', title: 'Excavation Impact', desc: 'Heavy machinery, blasting, and energy-intensive operations.' },
                                    { no: '—02', title: 'Transportation Emissions', desc: 'Fuel consumption and distance traveled between all sites.' },
                                    { no: '—03', title: 'Workforce Contribution', desc: 'Worker transportation and facility energy use.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                                        <span className="text-xs font-mono pt-1" style={{ color: 'var(--primary)' }}>{item.no}</span>
                                        <div>
                                            <h4 className="font-bold text-sm">{item.title}</h4>
                                            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link to="/estimate" className="btn-primary w-fit">Start Estimating →</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════
                SECTION 02 — Neutralization
                Layout: Full-width dark band
            ════════════════════════════════════════ */}
            <section className="reveal-up py-24 px-6 lg:px-20" style={{ background: 'var(--surface)' }}>
                <div className="max-w-7xl mx-auto">

                    <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
                        {/* Image */}
                        <div className="flex-1">
                            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                                <img src="./assets/neutral.webp" alt="Neutralization" loading="lazy"
                                    className="w-full h-full object-cover" />
                                <div className="absolute inset-0"
                                    style={{ background: 'linear-gradient(135deg, rgba(0,240,32,0.15) 0%, transparent 60%)' }} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col gap-8">
                            <div className="text-[120px] font-black leading-none select-none"
                                style={{ color: 'var(--primary)', opacity: 0.12 }}>02</div>
                            <div className="mt-[-50px]">
                                <span className="text-xs font-bold tracking-[0.3em] uppercase"
                                    style={{ color: 'var(--primary)' }}>Neutralization</span>
                                <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mt-3">
                                    From Emission<br />
                                    <span style={{ color: 'var(--primary)' }}>to Net Zero</span>
                                </h2>
                                <p className="text-base mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Actionable neutralization strategies — tailored to your mine's actual emission profile.
                                </p>
                            </div>

                            {/* Strategy pills */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { icon: '🌳', title: 'Afforestation', desc: 'CO₂ sequestration via land planting' },
                                    { icon: '⚡', title: 'EV Adoption', desc: 'Zero-emission fleet transition' },
                                    { icon: '🔋', title: 'Green Fuels', desc: 'Sustainable energy alternatives' },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-2xl flex flex-col gap-2 border transition-all hover:scale-105"
                                        style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                                        <span className="text-2xl">{item.icon}</span>
                                        <h4 className="font-bold text-sm">{item.title}</h4>
                                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════
                SECTION 03 — Carbon Credits
                Layout: Horizontal split with accent bg
            ════════════════════════════════════════ */}
            <section className="reveal-up py-24 px-6 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">

                        <div className="flex-1 flex flex-col gap-8">
                            <div className="text-[120px] font-black leading-none select-none"
                                style={{ color: 'var(--primary)', opacity: 0.12 }}>03</div>
                            <div className="mt-[-50px]">
                                <span className="text-xs font-bold tracking-[0.3em] uppercase"
                                    style={{ color: 'var(--primary)' }}>Carbon Credits</span>
                                <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mt-3">
                                    Sustainability<br />
                                    <span style={{ color: 'var(--primary)' }}>Pays Off</span>
                                </h2>
                                <p className="text-base mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Turn your green actions into tradeable carbon credits with real market value.
                                </p>
                            </div>

                            <div className="flex flex-col gap-px rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                                {[
                                    { label: 'Credits Estimation', value: 'Auto-calculated from your neutralization actions' },
                                    { label: 'Market Pricing', value: 'Live estimated value per credit in INR' },
                                    { label: 'PDF Reports', value: 'Exportable compliance-ready reports' },
                                ].map((row, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-5 py-4"
                                        style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)' }}>
                                        <span className="text-xs font-bold uppercase tracking-wider min-w-[160px]"
                                            style={{ color: 'var(--primary)' }}>{row.label}</span>
                                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{row.value}</span>
                                    </div>
                                ))}
                            </div>

                            <Link to="/calculation" className="btn-primary w-fit">Calculate My Credits →</Link>
                        </div>

                        <div className="flex-1">
                            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                                <img src="./assets/carbcredits.webp" alt="Carbon Credits" loading="lazy"
                                    className="w-full h-full object-cover" />
                                <div className="absolute inset-0"
                                    style={{ background: 'linear-gradient(135deg, rgba(0,240,32,0.15) 0%, transparent 60%)' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ CTA — Editorial Typography Split ══ */}
            <section className="reveal-up pt-16 pb-24 px-6 lg:px-20">
                <div className="max-w-7xl mx-auto">

                    {/* Top rule with label */}
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                        <span className="text-xs font-bold tracking-[0.3em] uppercase"
                            style={{ color: 'var(--primary)' }}>Start Today</span>
                        <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                    </div>

                    {/* Giant split headline */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">

                        {/* Left — Outlined + filled text stack */}
                        <div className="flex flex-col leading-none select-none">
                            <span className="text-[18vw] lg:text-[11vw] font-black uppercase tracking-tighter"
                                style={{
                                    color: 'transparent',
                                    WebkitTextStroke: '2px var(--primary)',
                                    lineHeight: 1
                                }}>
                                Go
                            </span>
                            <span className="text-[18vw] lg:text-[11vw] font-black uppercase tracking-tighter"
                                style={{ color: 'var(--primary)', lineHeight: 1 }}>
                                Green.
                            </span>
                        </div>

                        {/* Right — Tagline + CTAs */}
                        <div className="flex flex-col gap-6 lg:max-w-xs lg:pb-4">
                            <p className="text-base leading-relaxed"
                                style={{ color: 'var(--text-secondary)' }}>
                                Join India's leading coal mines already tracking, reducing, and profiting from their carbon journey.
                            </p>
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                                <Link to="/register"
                                    className="btn-primary text-sm text-center">
                                    Create Free Account →
                                </Link>
                                <Link to="/estimate"
                                    className="btn-ghost text-sm text-center">
                                    Try Without Account
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom rule */}
                    <div className="h-px mt-12" style={{ background: 'var(--border)' }} />
                </div>
            </section>
        </div>
    );
};

export default HomePage;