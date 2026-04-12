"""
Maternal Health Tracker - Backend API
Flask-based REST API for health assessment, doctor booking, and nutrition suggestions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from functools import wraps
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'maternal-health-secret-key-2024')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-2024')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
CORS(app)
jwt = JWTManager(app)

# Mock database (replace with real database later)
users_db = {}
health_records_db = {}
appointments_db = {}
doctors_db = {
    '1': {
        'id': '1',
        'name': 'Dr. Priya Sharma',
        'specialization': 'Obstetrics & Gynecology',
        'rating': 4.9,
        'experience': '15 years',
        'hospital': 'Apollo Hospitals',
        'location': 'New Delhi',
        'address': 'Sarita Vihar, New Delhi - 110076',
        'phone': '+91-11-4060 4444',
        'consultationFee': 1500
    },
    '2': {
        'id': '2',
        'name': 'Dr. Anjali Verma',
        'specialization': 'Maternal & Fetal Medicine',
        'rating': 4.8,
        'experience': '12 years',
        'hospital': 'Fortis Healthcare',
        'location': 'Mumbai',
        'address': 'Vashi, Navi Mumbai - 400703',
        'phone': '+91-22-6180 6180',
        'consultationFee': 1800
    },
    '3': {
        'id': '3',
        'name': 'Dr. Neha Patel',
        'specialization': 'High-Risk Pregnancy',
        'rating': 4.9,
        'experience': '18 years',
        'hospital': 'Lilavati Hospital',
        'location': 'Mumbai',
        'address': 'Bungalow Road, Mumbai - 400006',
        'phone': '+91-22-6121 2121',
        'consultationFee': 2000
    },
    '4': {
        'id': '4',
        'name': 'Dr. Kavya Singh',
        'specialization': 'Obstetrics & Gynecology',
        'rating': 4.7,
        'experience': '14 years',
        'hospital': 'Max Healthcare',
        'location': 'Bangalore',
        'address': 'Rajajinagar, Bangalore - 560010',
        'phone': '+91-80-4040 4040',
        'consultationFee': 1600
    },
    '5': {
        'id': '5',
        'name': 'Dr. Rajini Desai',
        'specialization': 'Maternal Health & Nutrition',
        'rating': 4.8,
        'experience': '16 years',
        'hospital': 'Manipal Hospitals',
        'location': 'Bangalore',
        'address': 'Old Airport Road, Bangalore - 560017',
        'phone': '+91-80-4141 4141',
        'consultationFee': 1700
    },
    '6': {
        'id': '6',
        'name': 'Dr. Sneha Nayar',
        'specialization': 'Gynecology & Obstetrics',
        'rating': 4.9,
        'experience': '13 years',
        'hospital': 'Kokilaben Dhirubhai Ambani Hospital',
        'location': 'Mumbai',
        'address': 'Achyutananda Cinematic Society Road, Mumbai - 400092',
        'phone': '+91-22-6789 0000',
        'consultationFee': 2200
    },
    '7': {
        'id': '7',
        'name': 'Dr. Meera Iyer',
        'specialization': 'Maternal Medicine',
        'rating': 4.8,
        'experience': '17 years',
        'hospital': 'St. Isabels Hospital',
        'location': 'Bangalore',
        'address': 'Vasanth Nagar, Bangalore - 560052',
        'phone': '+91-80-4321 0000',
        'consultationFee': 1900
    },
    '8': {
        'id': '8',
        'name': 'Dr. Divya Gupta',
        'specialization': 'Obstetrics & High-Risk Pregnancy',
        'rating': 4.7,
        'experience': '14 years',
        'hospital': 'Fortis Escorts Heart Institute',
        'location': 'New Delhi',
        'address': 'Institutional Area, New Delhi - 110025',
        'phone': '+91-11-4168 7777',
        'consultationFee': 1700
    },
    '9': {
        'id': '9',
        'name': 'Dr. Lakshmi Menon',
        'specialization': 'Maternal Health Specialist',
        'rating': 4.9,
        'experience': '19 years',
        'hospital': 'Care Hospitals',
        'location': 'Hyderabad',
        'address': 'Banjara Hills, Hyderabad - 500034',
        'phone': '+91-40-6730 7777',
        'consultationFee': 1600
    },
    '10': {
        'id': '10',
        'name': 'Dr. Riya Banerjee',
        'specialization': 'Obstetrics & Gynecology',
        'rating': 4.8,
        'experience': '11 years',
        'hospital': 'Ruby Hall Clinic',
        'location': 'Pune',
        'address': 'Sasoon Road, Pune - 411001',
        'phone': '+91-20-6640 0000',
        'consultationFee': 1400
    }
}

# ==================== HEALTH CONDITION ASSESSMENT ====================

def assess_health_condition(symptoms, lmp_date):
    """
    Assess maternal health condition based on symptoms and LMP date
    Returns: health_condition, risk_level, recommendations
    """
    
    # Calculate pregnancy week
    weeks_pregnant = (datetime.now() - lmp_date).days // 7 if lmp_date else 0
    
    # Risk assessment logic
    risk_factors = {
        'bleeding': 'high_risk',
        'severe_headache': 'high_risk',
        'abdominal_pain': 'medium_risk',
        'swelling': 'medium_risk',
        'fatigue': 'low_risk',
        'nausea': 'low_risk',
        'back_pain': 'low_risk',
    }
    
    # Determine risk level
    risk_level = 'normal'
    for symptom in symptoms:
        if symptom in risk_factors:
            symptom_risk = risk_factors[symptom]
            if symptom_risk == 'high_risk':
                risk_level = 'HIGH RISK'
                break
            elif symptom_risk == 'medium_risk' and risk_level == 'normal':
                risk_level = 'MEDIUM RISK'
    
    # Determine health condition
    if risk_level == 'HIGH RISK':
        condition = 'Critical - Consult Doctor Immediately'
    elif risk_level == 'MEDIUM RISK':
        condition = 'Requires Medical Attention'
    else:
        condition = 'Normal Pregnancy'
    
    return {
        'condition': condition,
        'risk_level': risk_level,
        'weeks_pregnant': weeks_pregnant,
        'symptoms': symptoms
    }


# ==================== NUTRITION RECOMMENDATIONS ====================

NUTRITION_GUIDE = {
    'Normal Pregnancy': {
        'foods': [
            'Green leafy vegetables (spinach, kale)',
            'Dairy products (milk, yogurt, cheese)',
            'Lean proteins (chicken, fish, eggs)',
            'Whole grains (brown rice, whole wheat)',
            'Fruits (oranges, bananas, berries)',
            'Nuts and seeds (almonds, walnuts)',
            'Iron-rich foods (red meat, beans)',
        ],
        'foods_to_avoid': [
            'Raw or undercooked meat',
            'High-mercury fish (shark, swordfish)',
            'Unpasteurized dairy',
            'Excess caffeine',
            'Alcohol',
        ],
        'daily_calories': 2500,
        'protein_grams': 75,
        'calcium_mg': 1000,
    },
    'Requires Medical Attention': {
        'foods': [
            'Easily digestible foods',
            'Small frequent meals',
            'Fresh fruits and vegetables',
            'Protein-rich foods',
        ],
        'foods_to_avoid': [
            'Spicy foods',
            'Heavy/fried foods',
            'Gas-producing foods',
        ],
        'daily_calories': 2300,
        'note': 'Consult doctor before making major dietary changes',
    },
    'Critical - Consult Doctor Immediately': {
        'note': 'URGENT: Please seek medical attention immediately. Do not rely on dietary changes alone.',
        'emergency_foods': [
            'Vitamin-rich foods per doctor recommendation',
        ]
    }
}


# ==================== AUTHENTICATION ROUTES ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    if data['email'] in users_db:
        return jsonify({'error': 'User already exists'}), 409
    
    user = {
        'id': len(users_db) + 1,
        'email': data['email'],
        'password': generate_password_hash(data['password']),
        'name': data.get('name', ''),
        'phone': data.get('phone', ''),
        'lmp_date': data.get('lmp_date', None),
        'created_at': datetime.now().isoformat()
    }
    
    users_db[data['email']] = user
    access_token = create_access_token(identity=str(user['id']))
    
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user.get('name', '')
        }
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    user = users_db.get(data['email'])
    
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=str(user['id']))
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user.get('name', '')
        }
    }), 200


# ==================== HEALTH ASSESSMENT ROUTES ====================

@app.route('/api/health/assess', methods=['POST'])
@jwt_required()
def assess_health():
    """Submit symptoms and get health assessment"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('symptoms'):
        return jsonify({'error': 'Symptoms required'}), 400
    
    # Get LMP date from user profile
    user_email = next((k for k, v in users_db.items() if v['id'] == int(user_id)), None)
    user = users_db.get(user_email) if user_email else None
    
    lmp_date = datetime.fromisoformat(user['lmp_date']) if user and user.get('lmp_date') else None
    
    # Assess health
    assessment = assess_health_condition(data['symptoms'], lmp_date)
    
    # Get nutrition recommendations
    nutrition = NUTRITION_GUIDE.get(assessment['condition'], {})
    
    # Save health record
    record = {
        'id': len(health_records_db) + 1,
        'user_id': user_id,
        'assessment': assessment,
        'nutrition': nutrition,
        'created_at': datetime.now().isoformat()
    }
    
    health_records_db[str(record['id'])] = record
    
    return jsonify({
        'assessment': assessment,
        'nutrition_suggestions': nutrition,
        'record_id': record['id'],
        'timestamp': record['created_at']
    }), 200


@app.route('/api/health/history', methods=['GET'])
@jwt_required()
def get_health_history():
    """Get user's health history"""
    user_id = get_jwt_identity()
    
    user_records = [
        record for record in health_records_db.values() 
        if record['user_id'] == user_id
    ]
    
    return jsonify({
        'total_records': len(user_records),
        'records': user_records
    }), 200


# ==================== DOCTOR ROUTES ====================

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    """Get list of available doctors"""
    specialization = request.args.get('specialization')
    
    doctors = list(doctors_db.values())
    
    if specialization:
        doctors = [d for d in doctors if d['specialization'].lower() == specialization.lower()]
    
    return jsonify({
        'total_doctors': len(doctors),
        'doctors': doctors
    }), 200


@app.route('/api/doctors/<doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    """Get specific doctor profile"""
    doctor = doctors_db.get(doctor_id)
    
    if not doctor:
        return jsonify({'error': 'Doctor not found'}), 404
    
    return jsonify(doctor), 200


# ==================== APPOINTMENT ROUTES ====================

@app.route('/api/appointments/book', methods=['POST'])
@jwt_required()
def book_appointment():
    """Book an appointment with a doctor"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('doctor_id'):
        return jsonify({'error': 'Doctor ID is required'}), 400
    
    appointment_date = data.get('appointment_date') or data.get('date')
    if not appointment_date:
        return jsonify({'error': 'Appointment date is required'}), 400
    
    # Verify doctor exists
    if data['doctor_id'] not in doctors_db:
        return jsonify({'error': 'Doctor not found'}), 404
    
    appointment = {
        'id': len(appointments_db) + 1,
        'user_id': user_id,
        'doctor_id': data['doctor_id'],
        'doctor_name': doctors_db[data['doctor_id']]['name'],
        'appointment_date': appointment_date,
        'time': data.get('time', '10:00'),
        'status': 'confirmed',
        'notes': data.get('notes', ''),
        'created_at': datetime.now().isoformat()
    }
    
    appointments_db[str(appointment['id'])] = appointment
    
    return jsonify({
        'message': 'Appointment booked successfully',
        'appointment': appointment
    }), 201


@app.route('/api/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    """Get user's appointments"""
    user_id = get_jwt_identity()
    
    user_appointments = [
        apt for apt in appointments_db.values() 
        if apt['user_id'] == user_id
    ]
    
    return jsonify({
        'total_appointments': len(user_appointments),
        'appointments': user_appointments
    }), 200


@app.route('/api/appointments/<appointment_id>', methods=['DELETE'])
@jwt_required()
def cancel_appointment(appointment_id):
    """Cancel an appointment"""
    user_id = get_jwt_identity()
    appointment = appointments_db.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    if int(appointment['user_id']) != int(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    appointment['status'] = 'cancelled'
    
    return jsonify({
        'message': 'Appointment cancelled successfully',
        'appointment': appointment
    }), 200


@app.route('/api/appointments/<appointment_id>/status', methods=['PUT'])
@jwt_required()
def update_appointment_status(appointment_id):
    """Update appointment status (completed/cancelled)"""
    user_id = get_jwt_identity()
    appointment = appointments_db.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    if int(appointment['user_id']) != int(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    new_status = data.get('status', '').lower()
    
    if new_status not in ['completed', 'cancelled', 'confirmed']:
        return jsonify({'error': 'Invalid status. Must be completed, cancelled, or confirmed'}), 400
    
    appointment['status'] = new_status.capitalize()
    if new_status == 'completed':
        appointment['completed_at'] = datetime.now().isoformat()
    
    return jsonify({
        'message': f'Appointment marked as {new_status}',
        'appointment': appointment
    }), 200


@app.route('/api/appointments/<appointment_id>/complete', methods=['PUT'])
@jwt_required()
def mark_appointment_completed(appointment_id):
    """Mark appointment as completed"""
    user_id = get_jwt_identity()
    appointment = appointments_db.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    if int(appointment['user_id']) != int(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    appointment['status'] = 'Completed'
    appointment['completed_at'] = datetime.now().isoformat()
    
    return jsonify({
        'message': 'Appointment marked as completed',
        'appointment': appointment
    }), 200


# ==================== NUTRITION ROUTES ====================

@app.route('/api/nutrition/suggestions', methods=['GET'])
def get_nutrition():
    """Get nutrition suggestions based on condition"""
    condition = request.args.get('condition', 'Normal Pregnancy')
    
    nutrition = NUTRITION_GUIDE.get(condition)
    
    if not nutrition:
        return jsonify({'error': 'Condition not found'}), 404
    
    return jsonify({
        'condition': condition,
        'suggestions': nutrition
    }), 200


# ==================== HEALTH STATUS ROUTES ====================

@app.route('/api/health/current', methods=['GET'])
@jwt_required()
def get_current_health():
    """Get current health status"""
    user_id = get_jwt_identity()
    
    user_records = [
        record for record in health_records_db.values() 
        if record['user_id'] == user_id
    ]
    
    if not user_records:
        return jsonify({
            'message': 'No health records found',
            'status': 'No assessment yet'
        }), 200
    
    # Get most recent record
    latest_record = max(user_records, key=lambda x: x['created_at'])
    
    return jsonify({
        'latest_assessment': latest_record['assessment'],
        'nutrition_suggestions': latest_record['nutrition'],
        'last_updated': latest_record['created_at']
    }), 200


# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Route not found'}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check"""
    return jsonify({
        'status': 'online',
        'service': 'Maternal Health Tracker API',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    }), 200


# ==================== DOCUMENTATION ====================

@app.route('/api/docs', methods=['GET'])
def documentation():
    """API documentation"""
    docs = {
        'title': 'Maternal Health Tracker API',
        'version': '1.0.0',
        'description': 'REST API for maternal health assessment and doctor booking',
        'endpoints': {
            'auth': {
                'register': 'POST /api/auth/register',
                'login': 'POST /api/auth/login',
            },
            'health': {
                'assess': 'POST /api/health/assess (requires JWT)',
                'history': 'GET /api/health/history (requires JWT)',
                'current': 'GET /api/health/current (requires JWT)',
            },
            'doctors': {
                'list': 'GET /api/doctors',
                'get': 'GET /api/doctors/<doctor_id>',
            },
            'appointments': {
                'book': 'POST /api/appointments/book (requires JWT)',
                'list': 'GET /api/appointments (requires JWT)',
                'cancel': 'DELETE /api/appointments/<appointment_id> (requires JWT)',
            },
            'nutrition': {
                'suggestions': 'GET /api/nutrition/suggestions',
            }
        }
    }
    return jsonify(docs), 200


if __name__ == '__main__':
    print("=" * 60)
    print("MATERNAL HEALTH TRACKER - API SERVER")
    print("=" * 60)
    print("\n✓ Starting Flask API server...")
    print("✓ API Documentation: http://localhost:5000/api/docs")
    print("✓ Health Check: http://localhost:5000/api/health\n")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
