import React, { useState } from 'react';

const EXCAVATION_FACTOR = 94.6;
const TRANSPORTATION_FACTOR = 74.1;
const EQUIPMENT_FACTOR = 73.3;
const EV_CONSTANT = 0.20;
const GREEN_FUEL_CONSTANT = 0.50;
const SEQUESTRATION_RATE = 2.2;
const ELECTRICITY_REDUCTION_RATE = 0.3;

const FormulaCard = ({ icon, title, accent, formula, variables, explanation }) => (
    <div className="rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.01]"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">{icon}</span>
            <div className="w-full">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: accent }} />
                    <h3 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        {title}
                    </h3>
                </div>

                {/* Formula pill */}
                <div className="inline-block px-4 py-2 rounded-xl mb-4 font-mono text-sm font-bold"
                    style={{ background: 'rgba(0,240,32,0.08)', color: 'var(--primary)', border: '1px solid rgba(0,240,32,0.2)' }}>
                    {formula}
                </div>

                {/* Variables */}
                <div className="flex flex-col gap-1.5 mb-4">
                    {variables.map((v, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="font-bold font-mono flex-shrink-0 w-6" style={{ color: accent }}>{v.sym}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{v.desc}</span>
                        </div>
                    ))}
                </div>

                {/* Explanation */}
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {explanation}
                </p>
            </div>
        </div>
    </div>
);

const SectionHeader = ({ number, title }) => (
    <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
            style={{ background: 'rgba(0,240,32,0.12)', color: 'var(--primary)' }}>
            {number}
        </div>
        <div className="flex-1">
            <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {title}
            </h2>
            <div className="h-px mt-2" style={{ background: 'var(--border)' }} />
        </div>
    </div>
);

const CalculationsPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { label: 'Emissions', icon: '💨' },
        { label: 'Neutralisation', icon: '🌿' },
        { label: 'Carbon Credits', icon: '💰' },
        { label: 'References', icon: '📚' },
    ];

    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-20"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
            <div className="max-w-5xl mx-auto">

                {/* ── Page Header ── */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-px w-8" style={{ background: 'var(--primary)' }} />
                        <span className="text-xs font-bold tracking-[0.3em] uppercase"
                            style={{ color: 'var(--primary)' }}>
                            Methodology
                        </span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
                        Project
                        <span style={{ color: 'var(--primary)' }}> Calculations</span>
                    </h1>
                    <p className="mt-3 text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                        An in-depth look at the formulas and emission factors used in CarbMine's carbon intelligence engine.
                    </p>
                </div>

                {/* ── Emission Factor Pills ── */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {[
                        { label: 'Excavation Factor', value: `${EXCAVATION_FACTOR} kg CO₂/ton` },
                        { label: 'Transport Factor', value: `${TRANSPORTATION_FACTOR} kg CO₂/km` },
                        { label: 'Equipment Factor', value: `${EQUIPMENT_FACTOR} kg CO₂/hr` },
                        { label: 'EV Constant', value: EV_CONSTANT },
                        { label: 'Green Fuel', value: GREEN_FUEL_CONSTANT },
                        { label: 'Sequestration', value: `${SEQUESTRATION_RATE} t/ha/yr` },
                    ].map((f, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
                            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{f.label}:</span>
                            <span className="font-bold" style={{ color: 'var(--primary)' }}>{f.value}</span>
                        </div>
                    ))}
                </div>

                {/* ── Tab Nav ── */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {tabs.map((tab, i) => (
                        <button key={i} onClick={() => setActiveTab(i)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                            style={{
                                background: activeTab === i ? 'var(--primary)' : 'var(--surface)',
                                color: activeTab === i ? '#000' : 'var(--text-secondary)',
                                borderColor: activeTab === i ? 'var(--primary)' : 'var(--border)',
                            }}>
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab 0: Emission Calculations ── */}
                {activeTab === 0 && (
                    <div className="flex flex-col gap-6">
                        <SectionHeader number="1" title="Emission Calculations" />
                        <p className="text-sm -mt-4 mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Emissions calculated for excavation, transportation, fuel, and equipment operations.
                        </p>
                        <FormulaCard icon="⛏️" title="Excavation Emissions" accent="#FF6384"
                            formula={`E = A × ${EXCAVATION_FACTOR}`}
                            variables={[
                                { sym: 'E', desc: 'Total excavation emissions (kg CO₂)' },
                                { sym: 'A', desc: 'Amount of excavation material (tons)' },
                            ]}
                            explanation={`The EXCAVATION_FACTOR (${EXCAVATION_FACTOR} kg CO₂/ton) represents CO₂ produced per ton of material excavated. Multiply by total tonnage to get total excavation footprint.`}
                        />
                        <FormulaCard icon="🚛" title="Transportation Emissions" accent="#36A2EB"
                            formula={`T = C × D × F`}
                            variables={[
                                { sym: 'T', desc: 'Total transportation emissions (kg CO₂)' },
                                { sym: 'C', desc: 'Distance traveled (km)' },
                                { sym: 'D', desc: `Transport factor (${TRANSPORTATION_FACTOR} kg CO₂/km)` },
                                { sym: 'F', desc: 'Fuel consumption factor' },
                            ]}
                            explanation="Transportation emissions account for distance, emission factor per kilometer, and fuel consumed. Higher mileage or fuel-intensive routes significantly raise this component."
                        />
                        <FormulaCard icon="⛽" title="Fuel Consumption Emissions" accent="#FFCE56"
                            formula={`F = E × ${GREEN_FUEL_CONSTANT}`}
                            variables={[
                                { sym: 'F', desc: 'Total fuel consumption emissions (kg CO₂)' },
                                { sym: 'E', desc: 'Amount of fuel consumed (liters)' },
                            ]}
                            explanation={`The GREEN_FUEL_CONSTANT (${GREEN_FUEL_CONSTANT}) reflects CO₂ emissions per liter of fuel. Switching to green fuels directly reduces this factor.`}
                        />
                        <FormulaCard icon="🏗️" title="Equipment Usage Emissions" accent="#9966FF"
                            formula={`G = H × ${EQUIPMENT_FACTOR}`}
                            variables={[
                                { sym: 'G', desc: 'Total equipment emissions (kg CO₂)' },
                                { sym: 'H', desc: 'Hours of equipment operation' },
                            ]}
                            explanation={`The EQUIPMENT_FACTOR (${EQUIPMENT_FACTOR} kg CO₂/hr) accounts for emissions from heavy machinery. Reducing operational hours lowers this significantly.`}
                        />
                        <FormulaCard icon="➕" title="Total Emissions" accent="var(--primary)"
                            formula="Total = E + T + F + G"
                            variables={[
                                { sym: 'E', desc: 'Excavation emissions' },
                                { sym: 'T', desc: 'Transportation emissions' },
                                { sym: 'F', desc: 'Fuel consumption emissions' },
                                { sym: 'G', desc: 'Equipment usage emissions' },
                            ]}
                            explanation="The total carbon footprint is the sum of all four emission sources. This figure is used as the baseline for neutralisation pathway calculations."
                        />
                    </div>
                )}

                {/* ── Tab 1: Neutralisation ── */}
                {activeTab === 1 && (
                    <div className="flex flex-col gap-6">
                        <SectionHeader number="2" title="Neutralisation Strategies" />
                        <p className="text-sm -mt-4 mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Strategies to reduce the carbon footprint via EVs, green fuels, afforestation and renewables.
                        </p>
                        <FormulaCard icon="⚡" title="Electric Vehicle (EV) Reduction" accent="#4BC0C0"
                            formula={`EV Reduction = E × (EV% / 100) × ${EV_CONSTANT}`}
                            variables={[
                                { sym: 'E', desc: 'Total transportation emissions (kg CO₂)' },
                                { sym: 'EV%', desc: 'Percentage of fleet converted to EV' },
                            ]}
                            explanation={`The EV_CONSTANT (${EV_CONSTANT}) reflects the efficiency gain of EVs over conventional vehicles — approximately 20% reduction in transport emissions per converted vehicle.`}
                        />
                        <FormulaCard icon="🌿" title="Green Fuel Reduction" accent="#00F020"
                            formula={`GF Reduction = F × (GF% / 100) × ${GREEN_FUEL_CONSTANT}`}
                            variables={[
                                { sym: 'F', desc: 'Total fuel consumption emissions (kg CO₂)' },
                                { sym: 'GF%', desc: 'Percentage shifted to green fuels' },
                            ]}
                            explanation={`The GREEN_FUEL_CONSTANT (${GREEN_FUEL_CONSTANT}) represents the ~50% emission reduction when switching from fossil fuels to green alternatives like biomass or hydrogen.`}
                        />
                        <FormulaCard icon="🌳" title="Afforestation" accent="#22c55e"
                            formula={`Land (ha) = Remaining CO₂ / ${SEQUESTRATION_RATE}`}
                            variables={[
                                { sym: 'ha', desc: 'Hectares of land needed for afforestation' },
                                { sym: `${SEQUESTRATION_RATE}`, desc: 'CO₂ sequestered per hectare per year (tons)' },
                            ]}
                            explanation={`Based on IPCC data, forests sequester approximately ${SEQUESTRATION_RATE} tons of CO₂ per hectare per year. This calculates land needed to offset remaining emissions.`}
                        />
                        <FormulaCard icon="☀️" title="Renewable Energy Reduction" accent="#FFCE56"
                            formula={`RE Reduction = E × ${ELECTRICITY_REDUCTION_RATE}`}
                            variables={[
                                { sym: 'E', desc: 'Total emissions (kg CO₂)' },
                                { sym: `${ELECTRICITY_REDUCTION_RATE}`, desc: 'Reduction rate from renewable energy adoption' },
                            ]}
                            explanation={`Renewable energy sources can reduce electricity-related emissions by up to ${ELECTRICITY_REDUCTION_RATE * 100}% according to IRENA 2022 data.`}
                        />
                    </div>
                )}

                {/* ── Tab 2: Carbon Credits ── */}
                {activeTab === 2 && (
                    <div className="flex flex-col gap-6">
                        <SectionHeader number="3" title="Carbon Credits" />
                        <p className="text-sm -mt-4 mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Carbon credits represent permits to emit CO₂. These formulas calculate credits earned and their market value.
                        </p>
                        <FormulaCard icon="🔥" title="Fuel Emissions" accent="#FF6384"
                            formula="fuel_emissions = fuel × fuel_emission_factor"
                            variables={[
                                { sym: 'fuel', desc: 'Quantity of fuel consumed (liters)' },
                                { sym: 'factor', desc: 'Emission factor for the specific fuel type' },
                            ]}
                            explanation="Fuel emission factor varies by fuel type — coal has the highest, biomass the lowest. This is used as input for total emissions calculation."
                        />
                        <FormulaCard icon="📊" title="Total Emissions (Credits)" accent="#36A2EB"
                            formula="total = annualcoal × COAL_CO2_FACTOR + fuel_emissions"
                            variables={[
                                { sym: 'annualcoal', desc: 'Annual coal production (tons)' },
                                { sym: 'COAL_CO2', desc: 'CO₂ emitted per ton of coal burned' },
                                { sym: 'fuel_em', desc: 'Emissions from fuel consumption' },
                            ]}
                            explanation="This consolidates coal combustion emissions with operational fuel emissions to establish the total baseline for carbon credit calculations."
                        />
                        <FormulaCard icon="📏" title="Baseline Emissions" accent="#FFCE56"
                            formula="baseline = total_emissions (no reduction)"
                            variables={[
                                { sym: 'baseline', desc: 'Business-as-usual emissions (kg CO₂)' },
                            ]}
                            explanation="Baseline represents the scenario with zero reduction measures applied. It is the reference point against which emissions reductions and credits are measured."
                        />
                        <FormulaCard icon="🏆" title="Carbon Credits Earned" accent="#9966FF"
                            formula="credits = baseline − reduced"
                            variables={[
                                { sym: 'credits', desc: 'Carbon credits earned (tons CO₂)' },
                                { sym: 'baseline', desc: 'Emissions without reduction measures' },
                                { sym: 'reduced', desc: 'Emissions after applying mitigation policies' },
                            ]}
                            explanation="Each credit represents one ton of CO₂ avoided compared to baseline. The greater the mitigation, the more credits earned and tradable on carbon markets."
                        />
                        <FormulaCard icon="💵" title="Carbon Credit Worth" accent="#00F020"
                            formula="worth = credits × cost_per_credit"
                            variables={[
                                { sym: 'worth', desc: 'Total monetary value of credits earned ($)' },
                                { sym: 'credits', desc: 'Number of carbon credits earned' },
                                { sym: 'cost', desc: 'Market price per credit ($/ton CO₂)' },
                            ]}
                            explanation="Carbon credit prices fluctuate on global markets. CarbMine uses current market pricing to estimate the financial value of your emission reductions."
                        />
                    </div>
                )}

                {/* ── Tab 3: References ── */}
                {activeTab === 3 && (
                    <div className="flex flex-col gap-4">
                        <SectionHeader number="4" title="References" />
                        {[
                            {
                                title: '2006 IPCC Guidelines for National Greenhouse Gas Inventories',
                                desc: 'Methodologies for estimating greenhouse gas emissions and removals.',
                                links: [
                                    { label: 'IPCC Mobile Combustion Guidelines', url: 'https://www.ipcc-nggip.iges.or.jp/public/2006gl/pdf/2_Volume2/V2_3_Ch3_Mobile_Combustion.pdf' },
                                    { label: 'IPCC Stationary Combustion Guidelines', url: 'https://www.ipcc-nggip.iges.or.jp/public/2006gl/pdf/2_Volume2/V2_2_Ch2_Stationary_Combustion.pdf' },
                                ]
                            },
                            {
                                title: 'Carbon Footprint Reduction from EVs',
                                desc: 'EVs typically reduce carbon emissions by 20%-30% compared to conventional vehicles.',
                                links: [{ label: 'IEA Global EV Outlook 2023', url: 'https://www.iea.org/reports/global-ev-outlook-2023' }]
                            },
                            {
                                title: 'Carbon Footprint Reduction from Cleaner Fuels',
                                desc: 'Switching from coal to natural gas can reduce carbon emissions by about 50%.',
                                links: [{ label: 'EPA Greenhouse Gas Emissions', url: 'https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle' }]
                            },
                            {
                                title: 'Afforestation Sequestration Rate',
                                desc: `Afforestation sequesters approximately ${SEQUESTRATION_RATE} tons of carbon per hectare per year.`,
                                links: [{ label: 'IPCC Special Report on Climate Change and Land', url: 'https://www.ipcc.ch/srccl/' }]
                            },
                            {
                                title: 'Renewable Energy Reduction',
                                desc: 'Renewable energy can reduce electricity consumption and carbon emissions by up to 30%.',
                                links: [{ label: 'IRENA Renewable Energy and Jobs 2022', url: 'https://www.irena.org/publications/2022/Dec/Renewable-Energy-and-Jobs-Annual-Review-2022' }]
                            },
                        ].map((ref, i) => (
                            <div key={i} className="rounded-2xl border p-6 transition-all hover:scale-[1.01]"
                                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                                        style={{ background: 'rgba(0,240,32,0.12)', color: 'var(--primary)' }}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                                            {ref.title}
                                        </h3>
                                        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                                            {ref.desc}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {ref.links.map((link, j) => (
                                                <a key={j} href={link.url} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:scale-105"
                                                    style={{ color: 'var(--primary)', borderColor: 'rgba(0,240,32,0.3)', background: 'rgba(0,240,32,0.06)' }}>
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    {link.label}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalculationsPage;