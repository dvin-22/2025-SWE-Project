from backend.app import db
from backend.models.table import Table
from flask import Flask

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    if not Table.query.first():
        tables = [
            Table(location='window', capacity=2),
            Table(location='window', capacity=4),
            Table(location='inside', capacity=2),
            Table(location='inside', capacity=6),
            Table(location='room', capacity=4),
            Table(location='room', capacity=8)
        ]
        db.session.bulk_save_objects(tables)
        db.session.commit()
        print("샘플 테이블 데이터 삽입 완료")
    else:
        print("이미 데이터가 존재합니다")