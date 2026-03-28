from config import (
    EV_CONSTANT, GREEN_FUEL_CONSTANT,
    SEQUESTRATION_RATE, ELECTRICITY_REDUCTION_RATE
)

def compute_neutralisation(data: dict) -> dict:
    emissions = float(data['emissions'])
    transportation = float(data['transportation'])
    fuel = float(data['fuel'])
    green_fuel_pct = float(data['green_fuel_percentage']) / 100
    neutralise_pct = float(data['neutralise_percentage']) / 100
    ev_pct = float(data['ev_transportation_percentage']) / 100

    emissions_to_neutralise = emissions * neutralise_pct
    transportation_reduction = transportation * EV_CONSTANT * ev_pct
    fuel_reduction = fuel * GREEN_FUEL_CONSTANT * green_fuel_pct
    remaining = emissions_to_neutralise - (transportation_reduction + fuel_reduction)
    land_required = remaining / SEQUESTRATION_RATE
    electricity_savings = emissions_to_neutralise * ELECTRICITY_REDUCTION_RATE
    overall_remaining = emissions - emissions_to_neutralise

    return {
        'emissions': emissions,
        'emissions_to_be_neutralised': emissions_to_neutralise,
        'transportation_footprint_reduction': transportation_reduction,
        'fuel_footprint_reduction': fuel_reduction,
        'remaining_footprint_after_reduction': remaining,
        'land_required_for_afforestation_hectares': land_required,
        'estimated_electricity_savings_mwh': electricity_savings,
        'overall_remaining_footprint': overall_remaining,
        'message': 'Carbon footprint neutralization pathways calculated successfully.'
    }