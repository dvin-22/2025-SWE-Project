from backend.database import db

class Table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(50), nullable=False)   # 'window', 'inside', 'room'
    capacity = db.Column(db.Integer, nullable=False)       # 2, 4, 6, 8