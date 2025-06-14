from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from backend.database import db
from backend.models.reservation import Reservation
from backend.models.table import Table

reservation_bp = Blueprint('reservation', __name__)


@reservation_bp.route('/reserve', methods=['POST'])
def reserve_table():
    data = request.get_json()
    try:
        user_id = data['userId']
        table_id = data['tableId']
        date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        time_slot = data['timeSlot']  # 'Lunch' or 'Dinner'
        name = data['name']
        phone = data['phone']
        card_number = data['cardNumber']
        guest_count = data['guestCount']
    except KeyError:
        return jsonify({'error': 'Missing required fields'}), 400

    # 날짜는 1개월 이내만 허용
    if date > datetime.today().date() + timedelta(days=30):
        return jsonify({'error': 'Reservation date must be within one month'}), 400

    # 테이블 유효성
    table = Table.query.filter_by(id=table_id).first()
    if not table:
        return jsonify({'error': 'Invalid table ID'}), 400

    # 이미 예약된 경우
    existing = Reservation.query.filter_by(
        table_id=table_id, date=date, time_slot=time_slot
    ).first()
    if existing:
        return jsonify({'error': 'Table already reserved'}), 409

    # 저장
    reservation = Reservation(
        user_id=user_id,
        table_id=table_id,
        date=date,
        time_slot=time_slot,
        name=name,
        phone=phone,
        card_number=card_number,
        guest_count=guest_count
    )
    db.session.add(reservation)
    db.session.commit()

    return jsonify({'message': 'reservation is successful'}), 200


@reservation_bp.route('/cancel/<int:reservation_id>', methods=['DELETE'])
def cancel_reservation(reservation_id):
    user_id = request.args.get('userId', type=int)
    if not user_id:
        return jsonify({'error': 'userId query parameter is required'}), 400

    reservation = Reservation.query.filter_by(id=reservation_id).first()

    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404

    if reservation.user_id != user_id:
        return jsonify({'error': 'You can only cancel your own reservation'}), 403

    today = datetime.today().date()
    if reservation.date <= today:
        return jsonify({'error': 'Reservation can only be canceled at least 1 day in advance'}), 400

    db.session.delete(reservation)
    db.session.commit()

    return jsonify({'message': 'Reservation canceled successfully'}), 200


@reservation_bp.route('/my-reservations', methods=['GET'])
def my_reservations():
    user_id = request.args.get('userId', type=int)
    if not user_id:
        return jsonify({'error': 'userId required'}), 400

    reservations = db.session.query(Reservation, Table).join(
        Table, Reservation.table_id == Table.id
    ).filter(Reservation.user_id == user_id).all()

    result = []
    for r, t in reservations:
        result.append({
            'id': r.id,
            'date': r.date.isoformat(),
            'time_slot': r.time_slot,
            'location': t.location,
            'capacity': t.capacity
        })

    return jsonify(result)