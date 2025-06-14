from flask import Flask
from flask_cors import CORS
from backend.database import db
from backend.models.user import User
from backend.models.table import Table
from backend.models.reservation import Reservation
from backend.routes.auth_routes import auth_bp
from backend.routes.table_routes import table_bp
from backend.routes.reservation_routes import reservation_bp

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return {'message': 'Flask backend is running on port 8000'}

app.register_blueprint(auth_bp)
app.register_blueprint(table_bp)
app.register_blueprint(reservation_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)