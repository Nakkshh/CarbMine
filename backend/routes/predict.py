from flask import Blueprint, request, jsonify
from services.ml_predict import predict

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST'])
def predict_route():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        required = ['excavation', 'transportation', 'fuel',
                    'equipment', 'workers', 'output', 'fuelType', 'lat', 'lng']
        missing = [f for f in required if f not in data]
        if missing:
            return jsonify({'error': f'Missing fields: {missing}'}), 400

        result = predict(data)
        return jsonify(result), 200

    except FileNotFoundError:
        return jsonify({'error': 'ML models not found. Run train_model.py first.'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500