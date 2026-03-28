import pickle
import os
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR   = os.path.join(BASE_DIR, '..', 'ml')

FUEL_ENCODING = {'coal': 3, 'oil': 2, 'naturalGas': 1, 'biomass': 0}

_co2_model  = None
_risk_model = None

def _load_models():
    global _co2_model, _risk_model
    if _co2_model is None:
        with open(os.path.join(ML_DIR, 'model_co2.pkl'), 'rb') as f:
            _co2_model = pickle.load(f)
    if _risk_model is None:
        with open(os.path.join(ML_DIR, 'model_risk.pkl'), 'rb') as f:
            _risk_model = pickle.load(f)

def predict(data: dict) -> dict:
    _load_models()

    fuel_encoded = FUEL_ENCODING.get(data.get('fuelType', 'coal'), 3)

    # DataFrame with named columns — fixes sklearn feature names warning
    features = pd.DataFrame([{
        'excavation':     float(data.get('excavation',     0)),
        'transportation': float(data.get('transportation', 0)),
        'fuel':           float(data.get('fuel',           0)),
        'equipment':      float(data.get('equipment',      0)),
        'workers':        float(data.get('workers',        0)),
        'output':         float(data.get('output',         0)),
        'fuel_encoded':   fuel_encoded,
        'reduction':      float(data.get('reduction',      0)),
    }])

    future_co2 = float(_co2_model.predict(features)[0])
    risk_score = float(np.clip(_risk_model.predict(features)[0], 0, 100))

    lat = float(data.get('lat', 23.7749))
    lng = float(data.get('lng', 86.4344))
    intensity = risk_score / 100.0

    heatmap_points = []
    for i in range(60):
        angle  = (i / 60) * 2 * np.pi
        radius = np.random.uniform(0.001, 0.05 * intensity + 0.01)
        heatmap_points.append([
            round(lat + radius * np.cos(angle), 6),
            round(lng + radius * np.sin(angle), 6),
            round(np.random.uniform(0.3, 1.0) * intensity, 3)
        ])

    if risk_score >= 70:
        risk_label = 'Critical'
        risk_color = '#ef4444'
    elif risk_score >= 45:
        risk_label = 'High'
        risk_color = '#f97316'
    elif risk_score >= 25:
        risk_label = 'Moderate'
        risk_color = '#eab308'
    else:
        risk_label = 'Low'
        risk_color = '#22c55e'

    return {
        'future_co2':     round(future_co2, 2),
        'risk_score':     round(risk_score, 2),
        'risk_label':     risk_label,
        'risk_color':     risk_color,
        'heatmap_points': heatmap_points,
        'lat': lat,
        'lng': lng,
    }