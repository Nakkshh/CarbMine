from flask import Blueprint, request, jsonify
from services.neutralisation import compute_neutralisation

bp = Blueprint('neutralisation', __name__)

@bp.route('/neutralise', methods=['POST'])
def neutralise():
    data = request.get_json()
    result = compute_neutralisation(data)
    return jsonify(result)
