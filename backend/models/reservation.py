from backend.database import db

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    table_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    time_slot = db.Column(db.String(10), nullable=False)  # 'Lunch' or 'Dinner'
    name = db.Column(db.String(80), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    card_number = db.Column(db.String(20), nullable=False)
    guest_count = db.Column(db.Integer, nullable=False)