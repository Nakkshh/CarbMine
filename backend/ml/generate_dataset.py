import pandas as pd
import numpy as np
import sys, os

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from config import EXCAVATION_FACTOR, TRANSPORTATION_FACTOR, EQUIPMENT_FACTOR, EMISSION_FACTORS

np.random.seed(42)
n = 3000

fuel_types = list(EMISSION_FACTORS.keys())  # ['coal', 'oil', 'naturalGas', 'biomass']

data = {
    'excavation':     np.random.uniform(500, 50000, n),
    'transportation': np.random.uniform(10, 5000, n),
    'fuel':           np.random.uniform(100, 20000, n),
    'equipment':      np.random.uniform(50, 5000, n),
    'workers':        np.random.randint(10, 2000, n),
    'output':         np.random.uniform(1000, 100000, n),
    'fuel_type':      np.random.choice(fuel_types, n),
    'reduction':      np.random.uniform(0.05, 0.40, n),
}

df = pd.DataFrame(data)

def compute_co2(row):
    fe             = EMISSION_FACTORS[row['fuel_type']]
    excavation_em  = row['excavation']     * EXCAVATION_FACTOR
    transport_em   = row['transportation'] * TRANSPORTATION_FACTOR * row['fuel'] * fe
    fuel_em        = row['fuel']           * fe
    equipment_em   = row['equipment']      * EQUIPMENT_FACTOR
    total          = excavation_em + transport_em + fuel_em + equipment_em
    growth         = np.random.uniform(0.95, 1.15)
    return round(total * growth, 2)

def compute_risk(row, co2):
    base_risk      = min(co2 / (row['output'] * 100), 1.0) * 60
    fuel_penalty   = {'coal': 20, 'oil': 15, 'naturalGas': 8, 'biomass': 2}
    reduction_bonus = row['reduction'] * 30
    risk           = base_risk + fuel_penalty[row['fuel_type']] - reduction_bonus
    risk           += np.random.uniform(-3, 3)
    return round(float(np.clip(risk, 0, 100)), 2)

df['future_co2']   = df.apply(compute_co2, axis=1)
df['risk_score']   = df.apply(lambda r: compute_risk(r, r['future_co2']), axis=1)
df['fuel_encoded'] = df['fuel_type'].map({'coal': 3, 'oil': 2, 'naturalGas': 1, 'biomass': 0})

df.to_csv('mine_dataset.csv', index=False)
print(f"✅ Dataset generated: {len(df)} rows")
print(df[['future_co2', 'risk_score']].describe())