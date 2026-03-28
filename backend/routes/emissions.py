from flask import Blueprint, request, jsonify
from services.emission_calc import compute_emissions

bp = Blueprint('emissions', __name__)

@bp.route('/calculate', methods=['POST'])
def calculate_emissions():
    data = request.get_json()
    result = compute_emissions(data)
    return jsonify(result)
