import React from 'react';
import NeutralizationChart from './charts/NeutralizationChart';

const SliderRow = ({ label, icon, value, setValue, min = 0 }) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</span>
            </div>
            <span className="text-sm font-black px-2 py-0.5 rounded-lg"
                style={{ color: 'var(--primary)', background: 'rgba(0,240,32,0.1)' }}>
                {value}%
            </span>
        </div>
        <input type="range" value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            min={min} max="100"
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: 'var(--primary)' }} />
        <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>{min}%</span><span>100%</span>
        </div>
    </div>
);

const ResultRow = ({ label, value, unit = 'kg CO₂', highlight = false }) => (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0"
        style={{ borderColor: 'var(--border)' }}>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="text-sm font-bold"
            style={{ color: highlight ? 'var(--primary)' : 'var(--text-primary)' }}>
            {Number(value).toFixed(2)} {unit}
        </span>
    </div>
);

const NeutralisationPanel = ({
    results, neutralisationResults,
    evConversionPercentage, setEvConversionPercentage,
    neutralizePercentage, setNeutralizePercentage,
    greenFuelPercentage, setGreenFuelPercentage,
}) => (
    <div className="flex flex-col gap-6">

        {/* Header */}
        <div>
            <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }} />
                <span className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: 'var(--primary)' }}>Neutralisation</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Explore Pathways
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Adjust sliders to simulate different neutralisation strategies
            </p>
        </div>

        {/* Sliders + Results side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Sliders */}
            <div className="rounded-2xl border p-6 flex flex-col gap-6"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <SliderRow label="EV Transportation" icon="⚡"
                    value={evConversionPercentage} setValue={setEvConversionPercentage} />
                <SliderRow label="Neutralise Footprint" icon="🌍"
                    value={neutralizePercentage} setValue={setNeutralizePercentage} min={10} />
                <SliderRow label="Shift to Green Fuel" icon="🌿"
                    value={greenFuelPercentage} setValue={setGreenFuelPercentage} />
            </div>

            {/* Results */}
            {neutralisationResults && (
                <div className="rounded-2xl border p-6"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-4"
                        style={{ color: 'var(--text-secondary)' }}>
                        Results at {neutralizePercentage}% Target
                    </h4>
                    <ResultRow label="Total Carbon Footprint"
                        value={neutralisationResults.emissions ?? 0} />
                    <ResultRow label="Target to Neutralise"
                        value={neutralisationResults.emissions_to_be_neutralised ?? 0} highlight />
                    <ResultRow label={`EV Reduction (${evConversionPercentage}%)`}
                        value={neutralisationResults.transportation_footprint_reduction ?? 0} />
                    <ResultRow label={`Green Fuel Reduction (${greenFuelPercentage}%)`}
                        value={neutralisationResults.fuel_footprint_reduction ?? 0} />
                    <ResultRow label="Remaining After Reductions"
                        value={neutralisationResults.remaining_footprint_after_reduction ?? 0} />
                    <ResultRow label="Afforestation Required"
                        value={neutralisationResults.land_required_for_afforestation_hectares ?? 0}
                        unit="hectares" />
                    <ResultRow label="Electricity Savings"
                        value={neutralisationResults.estimated_electricity_savings_mwh ?? 0}
                        unit="MWh" />
                    <ResultRow label="Overall Remaining"
                        value={neutralisationResults.overall_remaining_footprint ?? 0}
                        highlight />
                </div>
            )}
        </div>

        {/* Chart */}
        {neutralisationResults && (
            <div className="rounded-2xl border p-6"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }} />
                    <h4 className="text-sm font-bold uppercase tracking-widest"
                        style={{ color: 'var(--text-secondary)' }}>Pathway Chart</h4>
                </div>
                <NeutralizationChart data={neutralisationResults} />
            </div>
        )}
    </div>
);

export default NeutralisationPanel;