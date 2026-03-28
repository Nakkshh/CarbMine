import pandas as pd
import numpy as np
import pickle
import sys, os
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from config import EMISSION_FACTORS

df = pd.read_csv('mine_dataset.csv')

FEATURES = ['excavation', 'transportation', 'fuel', 'equipment',
            'workers', 'output', 'fuel_encoded', 'reduction']

X      = df[FEATURES]
y_co2  = df['future_co2']
y_risk = df['risk_score']

X_train, X_test, yc_train, yc_test = train_test_split(X, y_co2,  test_size=0.2, random_state=42)
_,       _,      yr_train, yr_test  = train_test_split(X, y_risk, test_size=0.2, random_state=42)

# ── CO2 Model — RandomForest
print("Training CO2 model...")
co2_model = RandomForestRegressor(
    n_estimators=200,
    max_depth=12,
    min_samples_split=4,
    random_state=42,
    n_jobs=-1
)
co2_model.fit(X_train, yc_train)
co2_pred = co2_model.predict(X_test)
print(f"  CO2 MAE : {mean_absolute_error(yc_test, co2_pred):,.0f} kg")
print(f"  CO2 R²  : {r2_score(yc_test, co2_pred):.4f}")

# ── Risk Model — GradientBoosting
print("Training Risk model...")
risk_model = GradientBoostingRegressor(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    random_state=42
)
risk_model.fit(X_train, yr_train)
risk_pred = risk_model.predict(X_test)
print(f"  Risk MAE: {mean_absolute_error(yr_test, risk_pred):.2f} pts")
print(f"  Risk R² : {r2_score(yr_test, risk_pred):.4f}")

# ── Save models
with open('model_co2.pkl', 'wb') as f:
    pickle.dump(co2_model, f)
with open('model_risk.pkl', 'wb') as f:
    pickle.dump(risk_model, f)

print("✅ Models saved: model_co2.pkl  model_risk.pkl")