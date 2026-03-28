# config.py

# Single source of truth for all constants
EXCAVATION_FACTOR = 94.6
TRANSPORTATION_FACTOR = 74.1
EQUIPMENT_FACTOR = 73.3

GWP_METHANE = 25
COAL_CO2_EMISSION_FACTOR = 2.2
COST_PER_CC = 42

EMISSION_FACTORS = {
    'coal': 2.42,
    'oil': 3.17,
    'naturalGas': 2.75,
    'biomass': 0
}

EV_CONSTANT = 0.20
GREEN_FUEL_CONSTANT = 0.50
SEQUESTRATION_RATE = 2.2
ELECTRICITY_REDUCTION_RATE = 0.3

# Flask Config class — required by app.py
class Config:
    SECRET_KEY = 'carbmine-secret-key'
    DEBUG = True
