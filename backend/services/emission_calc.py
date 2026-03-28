from config import (
    EXCAVATION_FACTOR, TRANSPORTATION_FACTOR, EQUIPMENT_FACTOR,
    COAL_CO2_EMISSION_FACTOR, EMISSION_FACTORS, COST_PER_CC
)

def compute_emissions(data: dict) -> dict:
    excavation = float(data['excavation'])
    transportation = float(data['transportation'])
    fuel = float(data['fuel'])
    equipment = float(data['equipment'])
    workers = int(data['workers'])
    output = float(data['output'])
    fueltype = data.get('fuelType', 'coal')
    reduced = float(data['reduction'])

    excavation_emissions = excavation * EXCAVATION_FACTOR
    transportation_emissions = transportation * TRANSPORTATION_FACTOR * 0.5
    equipment_emissions = equipment * EQUIPMENT_FACTOR
    total_emissions = excavation_emissions + transportation_emissions + equipment_emissions

    fuel_emission_factor = EMISSION_FACTORS.get(fueltype, COAL_CO2_EMISSION_FACTOR)
    fuel_emissions = fuel * fuel_emission_factor
    total = output * COAL_CO2_EMISSION_FACTOR + fuel_emissions
    baseline_emissions = total
    carbon_credits = baseline_emissions - reduced
    worth = carbon_credits * COST_PER_CC

    return {
        'totalEmissions': total_emissions,
        'excavationEmissions': excavation_emissions,
        'transportationEmissions': transportation_emissions,
        'equipmentEmissions': equipment_emissions,
        'excavationPerCapita': excavation_emissions / workers,
        'transportationPerCapita': transportation_emissions / workers,
        'equipmentPerCapita': equipment_emissions / workers,
        'excavationPerOutput': excavation_emissions / output,
        'transportationPerOutput': transportation_emissions / output,
        'equipmentPerOutput': equipment_emissions / output,
        'perCapitaEmissions': total_emissions / workers,
        'perOutputEmissions': total_emissions / output,
        'baseline': baseline_emissions,
        'carboncredits': carbon_credits,
        'reduced': reduced,
        'worth': worth,
        'total': total
    }