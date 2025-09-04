"""
app.py
Main Flask application entry point for Employee Directory.

This file sets up the Flask app, configures the database, registers blueprints, and defines RESTful API endpoints for employee CRUD operations.
It uses Pydantic for input validation and SQLAlchemy for ORM/database access.
"""
from flask import Flask, request, jsonify
import re
from employee_app.app.models.db import db
from employee_app.app.models.models import Employee, User
from employee_app.app.models.reset_token import PasswordResetToken
from employee_app.app.models.schemas import EmployeeCreateSchema, EmployeeUpdateSchema, UserRegisterSchema, UserLoginSchema
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import logging
from dotenv import load_dotenv
import os

import jwt as pyjwt
from datetime import datetime, timedelta, timezone
import secrets

app = Flask(__name__)
# Load environment variables based on FLASK_ENV
env = os.environ.get('FLASK_ENV', 'development')
if env == 'production':
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.prod'))
else:
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.dev'))
# Enable CORS for cross-origin requests from frontend
CORS(app)
# Flask app and database configuration
database_url = os.environ.get('DATABASE_URL')
secret_key = os.environ.get('SECRET_KEY')
if env == 'production':
    if not database_url or not secret_key:
        raise RuntimeError('DATABASE_URL and SECRET_KEY must be set in production environment!')
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SECRET_KEY'] = secret_key
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///employees.db'
    app.config['SECRET_KEY'] = secret_key or 'your_secret_key_here'
db.init_app(app)  # Initialize SQLAlchemy ORM

"""
JWT configuration
JWT_SECRET: Secret key for signing tokens
JWT_ALGORITHM: Algorithm used for JWT
JWT_EXP_DELTA_SECONDS: Token expiration time in seconds
"""
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'your-jwt-secret-key')
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = int(os.environ.get('JWT_EXP_DELTA_SECONDS', 3600))

# Setup basic logging
logging.basicConfig(level=logging.INFO)

with app.app_context():
    """
    Initialize database and add sample employees if table is empty.
    """
    db.create_all()  # Create tables
    # Add sample employees if table is empty
    if Employee.query.count() == 0:
        sample_employees = [
            Employee(name="Alice Smith", email="alice@example.com", department="HR", phone="1234567890"),
            Employee(name="Bob Johnson", email="bob@example.com", department="IT", phone="2345678901"),
            Employee(name="Charlie Lee", email="charlie@example.com", department="Finance", phone="3456789012"),
            Employee(name="Diana King", email="diana@example.com", department="Marketing", phone="4567890123"),
            Employee(name="Evan Wright", email="evan@example.com", department="Sales", phone="5678901234"),
        ]
        db.session.add_all(sample_employees)
        db.session.commit()


# Helper to create JWT token
def create_jwt(user):
    """
    Create a JWT token for a user.
    Args:
        user: User object
    Returns:
        JWT token as string
    """
    payload = {
        'user_id': user.id,  # User ID
        'name': user.name,   # User name
        'email': user.email, # User email
    'exp': datetime.now(timezone.utc) + timedelta(seconds=JWT_EXP_DELTA_SECONDS)  # Expiration
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


# JWT validation decorator
def jwt_required(f):
    """
    Decorator to require JWT authentication for protected endpoints.
    Checks for valid token in Authorization header.
    """
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid token'}), 401
        token = auth_header.split(' ')[1]
        try:
            payload = pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            request.user = payload  # Attach user info to request
        except Exception as e:
            return jsonify({'error': 'Invalid or expired token'}), 401
        return f(*args, **kwargs)
    return decorated

# Example: protect employee endpoints
@app.route('/employees', methods=['GET'])
@jwt_required
def get_employees():
    """
    Get all employees (JWT protected).
    Returns:
        List of employees as JSON
    """
    employees = Employee.query.all()  # Query all employees
    result = [
        {
            'id': e.id,
            'name': e.name,
            'email': e.email,
            'department': e.department,
            'phone': e.phone
        } for e in employees
    ]
    return jsonify(result)

@app.route('/employees/<int:emp_id>', methods=['GET'])
@jwt_required
def get_employee(emp_id):
    """
    Get a single employee by ID (JWT protected).
    Args:
        emp_id: Employee ID
    Returns:
        Employee details as JSON or error if not found
    """
    employee = db.session.get(Employee, emp_id)
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404
    return jsonify({
        'id': employee.id,
        'name': employee.name,
        'email': employee.email,
        'department': employee.department,
        'phone': employee.phone
    })

@app.route('/employees', methods=['POST'])
@jwt_required
def create_employee():
    """
    Create a new employee (JWT protected).
    Validates input and checks for duplicate email.
    Returns:
        Success message and new employee ID or error
    """
    try:
        data = request.get_json()  # Get JSON data from request
        validated = EmployeeCreateSchema(**data)  # Validate input
        # Check for duplicate email
        if Employee.query.filter_by(email=validated.email).first():
            return jsonify({'error': 'User already exists'}), 400
        employee = Employee(
            name=validated.name,
            email=validated.email,
            department=validated.department,
            phone=validated.phone
        )
        db.session.add(employee)
        db.session.commit()
        return jsonify({'message': 'Employee created', 'id': employee.id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/employees/<int:emp_id>', methods=['PUT'])
@jwt_required
def update_employee(emp_id):
    """
    Update an employee by ID (JWT protected).
    Validates input and checks for duplicate email.
    Args:
        emp_id: Employee ID
    Returns:
        Success message or error
    """
    try:
        employee = db.session.get(Employee, emp_id)
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        data = request.get_json()  # Get JSON data
        validated = EmployeeUpdateSchema(**data)  # Validate input
        for field in ['name', 'email', 'department', 'phone']:
            value = getattr(validated, field)
            if value is not None:
                # Check for duplicate email
                if field == 'email' and Employee.query.filter_by(email=value).first() and employee.email != value:
                    return jsonify({'error': 'User already exists'}), 400
                setattr(employee, field, value)
        db.session.commit()
        return jsonify({'message': 'Employee updated'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/employees/<int:emp_id>', methods=['DELETE'])
@jwt_required
def delete_employee(emp_id):
    """
    Delete an employee by ID (JWT protected).
    Args:
        emp_id: Employee ID
    Returns:
        Success message or error
    """
    try:
        employee = db.session.get(Employee, emp_id)
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404
        db.session.delete(employee)
        db.session.commit()
        return jsonify({'message': 'Employee deleted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/register', methods=['POST'])
def register():
    """
    Register a new user.
    Validates input and checks for duplicate email.
    Returns:
        Success message or error
    """
    try:
        data = request.get_json()  # Get JSON data
        validated = UserRegisterSchema(**data)  # Validate input
        # Check for duplicate email
        if User.query.filter_by(email=validated.email).first():
            return jsonify({'error': 'User already exists'}), 400
        user = User(
            name=validated.name,
            email=validated.email,
            password_hash=generate_password_hash(validated.password)
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User registered'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    """
    Login user and return JWT token.
    Validates credentials and returns token if successful.
    Returns:
        Success message, token, and user info or error
    """
    try:
        data = request.get_json()  # Get JSON data
        validated = UserLoginSchema(**data)  # Validate input
        user = User.query.filter_by(email=validated.email).first()
        if not user:
            logging.info(f"Login failed: No user found for email {validated.email}")
            return jsonify({'error': 'No user found for this email'}), 401
        if not check_password_hash(user.password_hash, validated.password):
            logging.info(f"Login failed: Incorrect password for email {validated.email}")
            return jsonify({'error': 'Incorrect password'}), 401
        logging.info(f"Login successful for user {validated.email}")
        token = create_jwt(user)  # Create JWT token
        return jsonify({'message': 'Login successful', 'token': token, 'user': {'id': user.id, 'name': user.name, 'email': user.email}}), 200
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/logout', methods=['POST'])
def logout():
    """
    Logout user (demo endpoint).
    Returns:
        Success message
    """
    # For demo: just return success (session/cookie handling can be added)
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/password-reset-request', methods=['POST'])
def password_reset_request():
    """
    Handle password reset requests.
    Expects: { "email": "user@example.com" }
    Returns: Success message (simulate sending email for now)
    """
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    # Generate token and expiration
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    # Store token in DB
    token_entry = PasswordResetToken(user_id=user.id, token=reset_token, expires_at=expires_at)
    db.session.add(token_entry)
    db.session.commit()
    # Simulate sending email (log to console)
    print(f"Password reset requested for {email}. Token: {reset_token}")
    # In real app, send email with reset link
    return jsonify({'message': 'Password reset email sent', 'token': reset_token}), 200

@app.route('/password-reset', methods=['POST'])
def password_reset():
    """
    Handle password reset using token and new password.
    Expects: { "token": "...", "password": "..." }
    Returns: Success or error message
    """
    data = request.get_json()
    token = data.get('token')
    password = data.get('password')
    if not token or not password:
        return jsonify({'error': 'Token and password are required'}), 400
    # Lookup token in DB
    token_entry = PasswordResetToken.query.filter_by(token=token, used=False).first()
    if not token_entry or not token_entry.is_valid():
        return jsonify({'error': 'Invalid or expired token'}), 400
    user = User.query.get(token_entry.user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    user.password_hash = generate_password_hash(password)
    token_entry.used = True
    db.session.commit()
    print(f"Password reset for user {user.email} with token {token}")
    return jsonify({'message': 'Password reset successful!'}), 200
if __name__ == '__main__':
    """
    Run the Flask development server.
    """
    app.run(host="0.0.0.0", port=5000, debug=True)
