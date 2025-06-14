from flask import Blueprint, request, jsonify
from datetime import datetime
from backend.database import db
from backend.models.table import Table
from backend.models.reservation import Reservation

table_bp = Blueprint('table', __name__)

@table_bp.route('/tables', methods=['GET'])
def get_available_tables():
    date_str = request.args.get('date')
    time_slot = request.args.get('timeSlot')  # 'Lunch' or 'Dinner'

    if not date_str or not time_slot:
        return jsonify({'error': 'date and timeSlot query params are required'}), 400

    try:
        selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    reserved_ids = db.session.query(Reservation.table_id).filter_by(
        date=selected_date,
        time_slot=time_slot
    ).all()
    reserved_ids = [r[0] for r in reserved_ids]

    available_tables = Table.query.filter(~Table.id.in_(reserved_ids)).all()

    return jsonify([
        {
            'id': t.id,
            'location': t.location,
            'capacity': t.capacity
        } for t in available_tables
    ])

@table_bp.route('/table/<int:table_id>', methods=['GET'])
def get_table_info(table_id):
    table = Table.query.get(table_id)
    if not table:
        return jsonify({'error': 'Table not found'}), 404

    return jsonify({
        'id': table.id,
        'location': table.location,
        'capacity': table.capacity
    }), 200