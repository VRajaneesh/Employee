"""
test_api.py
API endpoint tests for Employee Directory Flask application.
Uses a separate test database and Flask test client.
"""
import pytest
from employee_app.app.app import app

def test_create_employee(client):
    """Test the POST /employees endpoint creates a new employee or returns 400 if email exists."""
    data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "department": "QA",
        "phone": "1234567890"
    }
    response = client.post("/employees", json=data)
    assert response.status_code in (200, 400)  # 400 if email exists
    resp_json = response.get_json()
    if response.status_code == 200:
        assert "id" in resp_json
    else:
        assert "error" in resp_json
        assert resp_json["error"] == "User already exists"

def test_duplicate_employee(client):
    """Test duplicate email check returns correct error."""
    data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "department": "QA",
        "phone": "1234567890"
    }
    client.post("/employees", json=data)
    response = client.post("/employees", json=data)
    assert response.status_code == 400
    assert "User already exists" in response.get_json()["error"]
@pytest.fixture
def client():
    """
    Pytest fixture to create a test client for the Flask app and get JWT token.
    Automatically registers and logs in a test user, returns client and auth headers.
    """
    app.config['TESTING'] = True
    with app.test_client() as client:
        # Register test user (ignore if already exists)
        reg_data = {
            "name": "TestUser",
            "email": "testuser@example.com",
            "password": "testpass123"
        }
        client.post("/register", json=reg_data)
        # Login to get JWT token
        login_data = {
            "email": "testuser@example.com",
            "password": "testpass123"
        }
        resp = client.post("/login", json=login_data)
        token = resp.get_json().get("token")
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        # Return client and headers
        class AuthClient:
            def __init__(self, client, headers):
                self.client = client
                self.headers = headers
            def get(self, *args, **kwargs):
                kwargs.setdefault('headers', self.headers)
                return self.client.get(*args, **kwargs)
            def post(self, *args, **kwargs):
                kwargs.setdefault('headers', self.headers)
                return self.client.post(*args, **kwargs)
            def put(self, *args, **kwargs):
                kwargs.setdefault('headers', self.headers)
                return self.client.put(*args, **kwargs)
            def delete(self, *args, **kwargs):
                kwargs.setdefault('headers', self.headers)
                return self.client.delete(*args, **kwargs)
        yield AuthClient(client, headers)

def test_get_employees(client):
    """Test the GET /employees endpoint returns a list of employees."""
    response = client.get('/employees')
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)

def test_get_employee(client):
    """Test the GET /employees/<id> endpoint returns an employee or 404."""
    response = client.get('/employees/1')
    assert response.status_code in (200, 404)  # 404 if not found


def test_update_employee(client):
    """Test the PUT /employees/<id> endpoint updates an employee or returns 404."""
    data = {"name": "Updated Name"}
    response = client.put('/employees/1', json=data)
    assert response.status_code in (200, 404)

def test_register_user(client):
    """Test user registration endpoint."""
    data = {
        "name": "New User",
        "email": "newuser@example.com",
        "password": "newpass123"
    }
    response = client.client.post("/register", json=data)
    assert response.status_code in (200, 400)  # 400 if user exists

def test_register_duplicate_user(client):
    """Test duplicate user registration returns error."""
    data = {
        "name": "New User",
        "email": "newuser@example.com",
        "password": "newpass123"
    }
    client.client.post("/register", json=data)
    response = client.client.post("/register", json=data)
    assert response.status_code == 400
    assert "User already exists" in response.get_json()["error"]

def test_login_success(client):
    """Test successful login returns JWT token."""
    data = {
        "email": "testuser@example.com",
        "password": "testpass123"
    }
    response = client.client.post("/login", json=data)
    assert response.status_code == 200
    assert "token" in response.get_json()

def test_login_wrong_password(client):
    """Test login with wrong password returns error."""
    data = {
        "email": "testuser@example.com",
        "password": "wrongpass"
    }
    response = client.client.post("/login", json=data)
    assert response.status_code == 401
    assert "Incorrect password" in response.get_json()["error"]

def test_login_nonexistent_user(client):
    """Test login with non-existent user returns error."""
    data = {
        "email": "nouser@example.com",
        "password": "anypass"  # Use valid length to pass schema validation
    }
    response = client.client.post("/login", json=data)
    assert response.status_code == 401
    assert "No user found" in response.get_json()["error"]

def test_protected_endpoint_no_token():
    """Test accessing protected endpoint without token returns 401."""
    from employee_app.app.app import app
    with app.test_client() as client:
        response = client.get("/employees")
        assert response.status_code == 401
        assert "Missing or invalid token" in response.get_json()["error"]

def test_protected_endpoint_invalid_token():
    """Test accessing protected endpoint with invalid token returns 401."""
    from employee_app.app.app import app
    with app.test_client() as client:
        headers = {"Authorization": "Bearer invalidtoken"}
        response = client.get("/employees", headers=headers)
    assert response.status_code == 401
    assert "Invalid or expired token" in response.get_json()["error"]

def test_create_employee_invalid_data(client):
    """Test creating employee with invalid data returns error."""
    data = {
        "name": "",
        "email": "notanemail",
        "department": "",
        "phone": "123"
    }
    response = client.post("/employees", json=data)
    assert response.status_code == 400

def test_update_employee_invalid_data(client):
    """Test updating employee with invalid data returns error."""
    data = {"email": "notanemail"}
    response = client.put("/employees/1", json=data)
    assert response.status_code in (400, 404)

def test_delete_nonexistent_employee(client):
    """Test deleting a non-existent employee returns 404."""
    response = client.delete("/employees/99999")
    assert response.status_code == 404
    assert "Employee not found" in response.get_json()["error"]

def test_logout(client):
    """Test logout endpoint returns success."""
    response = client.client.post("/logout")
    assert response.status_code == 200
    assert "Logout successful" in response.get_json()["message"]

def test_expired_token_rejected():
    """Test that expired JWT tokens are rejected by protected endpoints."""
    from employee_app.app.app import app, JWT_SECRET, JWT_ALGORITHM
    import jwt as pyjwt
    from datetime import datetime, timedelta, timezone
    # Create an expired token
    payload = {
        'user_id': 1,
        'name': 'Expired User',
        'email': 'expired@example.com',
        'exp': datetime.now(timezone.utc) - timedelta(seconds=10)  # Expired 10 seconds ago
    }
    expired_token = pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    headers = {"Authorization": f"Bearer {expired_token}"}
    with app.test_client() as client:
        response = client.get("/employees", headers=headers)
        assert response.status_code == 401
        assert "Invalid or expired token" in response.get_json()["error"]
