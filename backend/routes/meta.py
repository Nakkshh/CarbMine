from flask import Blueprint, jsonify
import sys
from config import (
    EXCAVATION_FACTOR, TRANSPORTATION_FACTOR, EQUIPMENT_FACTOR,
    EV_CONSTANT, GREEN_FUEL_CONSTANT, SEQUESTRATION_RATE,
    ELECTRICITY_REDUCTION_RATE, EMISSION_FACTORS, COST_PER_CC
)

bp = Blueprint('meta', __name__)

@bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status':  'ok',
        'service': 'CarbMine API',
        'version': '1.0.0',
        'python':  sys.version.split()[0],   # ← ADD
    }), 200                                  # ← ADD explicit 200

@bp.route('/constants', methods=['GET'])
def constants():
    return jsonify({
        'excavation_factor':        EXCAVATION_FACTOR,
        'transportation_factor':    TRANSPORTATION_FACTOR,
        'equipment_factor':         EQUIPMENT_FACTOR,
        'ev_constant':              EV_CONSTANT,
        'green_fuel_constant':      GREEN_FUEL_CONSTANT,
        'sequestration_rate':       SEQUESTRATION_RATE,
        'electricity_reduction_rate': ELECTRICITY_REDUCTION_RATE,
        'emission_factors':         EMISSION_FACTORS,
        'cost_per_cc':              COST_PER_CC,
    }), 200                                  # ← ADD explicit 200