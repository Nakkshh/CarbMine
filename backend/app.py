from flask import Flask
from flask_cors import CORS
from routes.emissions import bp as emissions_bp
from routes.neutralisation import bp as neutralisation_bp
from routes.meta import bp as meta_bp
from routes.predict import predict_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(emissions_bp)
    app.register_blueprint(neutralisation_bp)
    app.register_blueprint(meta_bp)
    app.register_blueprint(predict_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)