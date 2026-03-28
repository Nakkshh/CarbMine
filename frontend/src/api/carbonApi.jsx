const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const calculateEmissions = async (formData) => {
    const res = await fetch(`${API_URL}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error('Emission calculation failed');
    return res.json();
};

export const calculateNeutralisation = async (payload) => {
    const res = await fetch(`${API_URL}/neutralise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Neutralisation calculation failed');
    return res.json();
};

export const fetchConstants = async () => {
    const res = await fetch(`${API_URL}/constants`);
    if (!res.ok) throw new Error('Failed to fetch constants');
    return res.json();
};

export const checkHealth = async () => {
    const res = await fetch(`${API_URL}/health`);
    return res.json();
};
export const predictEmissions = async (payload) => {
    const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Prediction failed');
    return res.json();
};
