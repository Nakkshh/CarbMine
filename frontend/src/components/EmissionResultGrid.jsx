import React from 'react';
import DoughnutChart from './charts/DoughnutChart';

const StatCard = ({ label, total, perCapita, perOutput, accent }) => (
    <div className="rounded-2xl border p-5 flex flex-col gap-3"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
            <h4 className="text-sm font-bold uppercase tracking-widest"
                style={{ color: 'var(--text-secondary)' }}>{label}</h4>
        </div>
        <p className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {Number(total).toFixed(2)}
            <span className="text-sm font-medium ml-1" style={{ color: 'var(--text-secondary)' }}>kg CO₂</span>
        </p>
        <div className="h-px" style={{ background: 'var(--border)' }} />
        <div className="flex flex-col gap-1">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Per Capita: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {Number(perCapita).toFixed(2)} kg CO₂/worker
                </span>
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Per Output: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {Number(perOutput).toFixed(2)} kg CO₂/ton
                </span>
            </p>
        </div>
    </div>
);

const EmissionResultGrid = ({ results, formData }) => (
    <div className="flex flex-col gap-8">

        {/* ── Top 4 stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Excavation" accent="#FF6384"
                total={results.excavationEmissions ?? 0}
                perCapita={results.excavationPerCapita ?? 0}
                perOutput={results.excavationPerOutput ?? 0} />
            <StatCard label="Transportation" accent="#36A2EB"
                total={results.transportationEmissions ?? 0}
                perCapita={results.transportationPerCapita ?? 0}
                perOutput={results.transportationPerOutput ?? 0} />
            <StatCard label="Equipment" accent="#FFCE56"
                total={results.equipmentEmissions ?? 0}
                perCapita={results.equipmentPerCapita ?? 0}
                perOutput={results.equipmentPerOutput ?? 0} />
            <StatCard label="Total" accent="var(--primary)"
                total={results.totalEmissions ?? 0}
                perCapita={results.perCapitaEmissions ?? 0}
                perOutput={results.perOutputEmissions ?? 0} />
        </div>

        {/* ── Bottom row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left — Collected Info + Carbon Credits */}
            <div className="flex flex-col gap-4">

                {/* Collected Info */}
                <div className="rounded-2xl border p-6"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }} />
                        <h4 className="text-sm font-bold uppercase tracking-widest"
                            style={{ color: 'var(--text-secondary)' }}>Collected Info</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        {[
                            { label: 'Excavation', value: `${formData.excavation} tons` },
                            { label: 'Transportation', value: `${formData.transportation} km` },
                            { label: 'Fuel', value: `${formData.fuel} liters` },
                            { label: 'Equipment', value: `${formData.equipment} hrs` },
                            { label: 'Workers', value: formData.workers },
                            { label: 'Fuel Type', value: formData.fuelType },
                            { label: 'After Mitigation', value: formData.reduction },
                            { label: 'Annual Coal', value: `${formData.output} tons` },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Carbon Credits */}
                <div className="rounded-2xl border p-6"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full" style={{ background: '#36A2EB' }} />
                        <h4 className="text-sm font-bold uppercase tracking-widest"
                            style={{ color: 'var(--text-secondary)' }}>Carbon Credits</h4>
                    </div>
                    <div className="flex flex-col gap-3">
                        {[
                            { label: 'Baseline', value: `${(results.baseline ?? 0).toFixed(2)} kg CO₂` },
                            { label: 'Total Emissions', value: `${(results.totalEmissions ?? 0).toFixed(2)} kg CO₂` },
                            { label: 'After Mitigation', value: `${(results.reduced ?? 0).toFixed(2)} kg CO₂` },
                            { label: 'Carbon Credits', value: `${(results.carboncredits ?? 0).toFixed(2)}` },
                            { label: 'Net Worth', value: `$${(results.worth ?? 0).toFixed(2)}` },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0"
                                style={{ borderColor: 'var(--border)' }}>
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right — Doughnut chart */}
            <div className="rounded-2xl border p-6 flex flex-col"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#FF6384' }} />
                    <h4 className="text-sm font-bold uppercase tracking-widest"
                        style={{ color: 'var(--text-secondary)' }}>Emissions Breakdown</h4>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <DoughnutChart data={results} />
                </div>
            </div>
        </div>
    </div>
);

export default EmissionResultGrid;