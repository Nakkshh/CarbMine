import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MineMap from '../components/map/MineMap';
import { predictEmissions } from '../api/carbonApi';

const FUEL_TYPES = [
  { value: 'coal',       label: 'Coal' },
  { value: 'oil',        label: 'Oil' },
  { value: 'naturalGas', label: 'Natural Gas' },
  { value: 'biomass',    label: 'Biomass' },
];

const DEFAULT_FORM = {
  lat:            '23.7749',
  lng:            '86.4344',
  excavation:     '25000',
  transportation: '1500',
  fuel:           '8000',
  equipment:      '2000',
  workers:        '500',
  output:         '50000',
  fuelType:       'coal',
  reduction:      '0.15',
};

// Shared input style using CSS variables (follows theme)
const inputStyle = {
  backgroundColor: 'var(--bg-primary)',
  border:          '1px solid var(--border)',
  color:           'var(--text-primary)',
};

const labelStyle = {
  color: 'var(--text-secondary)',
};

export default function PredictionMapPage() {
  const location = useLocation();

  // Works standalone (default values) AND pre-filled from EstimatePage
  const [form,    setForm]    = useState({ ...DEFAULT_FORM, ...(location.state || {}) });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        ...form,
        lat:            parseFloat(form.lat),
        lng:            parseFloat(form.lng),
        excavation:     parseFloat(form.excavation),
        transportation: parseFloat(form.transportation),
        fuel:           parseFloat(form.fuel),
        equipment:      parseFloat(form.equipment),
        workers:        parseInt(form.workers),
        output:         parseFloat(form.output),
        reduction:      parseFloat(form.reduction),
      };
      const data = await predictEmissions(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCO2 = (val) => {
    if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(2)} B kg`;
    if (val >= 1_000_000)     return `${(val / 1_000_000).toFixed(2)} M kg`;
    if (val >= 1_000)         return `${(val / 1_000).toFixed(2)} K kg`;
    return `${val} kg`;
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            CO₂ Emission Predictor
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            Enter mine location and operational data to predict future emissions and carbon risk
          </p>
          {/* Badge shown when pre-filled from EstimatePage */}
          {location.state && (
            <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: 'rgba(0,240,32,0.1)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
              ✦ Pre-filled from your Estimate
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Form Panel */}
          <div className="lg:col-span-1 rounded-2xl p-6 border"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--primary)' }}>
              Mine Parameters
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Coordinates */}
              <div>
                <label className="text-xs uppercase tracking-wider" style={labelStyle}>Location</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <label className="text-xs" style={labelStyle}>Latitude</label>
                    <input
                      type="number" name="lat" step="any"
                      value={form.lat} onChange={handleChange}
                      className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none mt-1"
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs" style={labelStyle}>Longitude</label>
                    <input
                      type="number" name="lng" step="any"
                      value={form.lng} onChange={handleChange}
                      className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none mt-1"
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="text-xs uppercase tracking-wider" style={labelStyle}>Fuel Type</label>
                <select
                  name="fuelType" value={form.fuelType} onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none mt-1"
                  style={inputStyle}
                >
                  {FUEL_TYPES.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              {/* Numeric fields */}
              {[
                { name: 'excavation',     label: 'Excavation',     unit: 'tons',    step: '100'  },
                { name: 'transportation', label: 'Transportation',  unit: 'km',      step: '10'   },
                { name: 'fuel',           label: 'Fuel Used',       unit: 'liters',  step: '100'  },
                { name: 'equipment',      label: 'Equipment Hours', unit: 'hrs',     step: '10'   },
                { name: 'workers',        label: 'Workers',         unit: 'people',  step: '1'    },
                { name: 'output',         label: 'Coal Output',     unit: 'tons/yr', step: '1000' },
                { name: 'reduction',      label: 'Reduction Rate',  unit: '0–1',     step: '0.01' },
              ].map(field => (
                <div key={field.name}>
                  <label className="text-xs uppercase tracking-wider" style={labelStyle}>
                    {field.label}
                    <span className="ml-1 normal-case" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                      ({field.unit})
                    </span>
                  </label>
                  <input
                    type="number" name={field.name} step={field.step}
                    value={form[field.name]} onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none mt-1"
                    style={inputStyle}
                    required
                  />
                </div>
              ))}

              <button
                type="submit" disabled={loading}
                className="w-full font-semibold py-3 rounded-xl transition-colors mt-2"
                style={{
                  backgroundColor: loading ? 'var(--border)' : 'var(--primary)',
                  color:           loading ? 'var(--text-secondary)' : '#000',
                  cursor:          loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Predicting...
                  </span>
                ) : 'Predict & Render Heatmap'}
              </button>
            </form>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-xl p-3 text-sm border"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#f87171' }}>
                {error === 'Failed to fetch'
                  ? '⚠ Cannot connect to backend. Make sure Flask is running on port 5000.'
                  : `⚠ ${error}`}
              </div>
            )}
          </div>

          {/* ── Map + Results Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Result Cards */}
            {result && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* CO2 Card */}
                <div className="rounded-2xl p-5 border"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={labelStyle}>Future CO₂</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {formatCO2(result.future_co2)}
                  </p>
                  <p className="text-xs mt-1" style={labelStyle}>Projected next year</p>
                </div>

                {/* Risk Score Card */}
                <div className="rounded-2xl p-5 border"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={labelStyle}>Risk Score</p>
                  <p className="text-2xl font-bold" style={{ color: result.risk_color }}>
                    {result.risk_score} / 100
                  </p>
                  <p className="text-xs mt-1" style={{ color: result.risk_color }}>
                    {result.risk_label}
                  </p>
                </div>

                {/* Risk Bar Card */}
                <div className="rounded-2xl p-5 border"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                  <p className="text-xs uppercase tracking-wider mb-3" style={labelStyle}>Risk Level</p>
                  <div className="w-full rounded-full h-3" style={{ backgroundColor: 'var(--border)' }}>
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{ width: `${result.risk_score}%`, backgroundColor: result.risk_color }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1" style={labelStyle}>
                    <span>Low</span><span>Critical</span>
                  </div>
                </div>

              </div>
            )}

            {/* Map */}
            <div className="rounded-2xl overflow-hidden flex-1 border"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', minHeight: '480px' }}>
              <MineMap result={result} lat={parseFloat(form.lat)} lng={parseFloat(form.lng)} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}