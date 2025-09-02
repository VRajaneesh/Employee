# Employee Directory Backend (Flask API)

## Overview
This is a RESTful backend for the Employee Directory application, built with Flask. It provides CRUD API endpoints for employee management and is designed to be used with a modern Angular frontend.

## Features
- REST API for employee CRUD (Create, Read, Update, Delete)
- Duplicate user (email) check when adding or editing employees
- Clear error messages for invalid input and duplicate users
- Sample employee data on first run
- Pydantic validation for API input data
- CORS enabled for frontend-backend integration
- Comprehensive docstrings and inline documentation for maintainability

## Tech Stack
- Python 3
- Flask
- Flask-SQLAlchemy
- Pydantic
- SQLite (default)

## Setup Instructions
**Important:** Run all commands from the parent directory (`C:\Users\vasam\Downloads\employee`) for correct imports and module resolution.
1. Clone or download the project.
2. Open a terminal in the project folder.
3. Create and activate a virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
4. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
5. Run the backend server:
   ```powershell
   python -m employee_app.app.app
   ```

## API Endpoints
| Method | Endpoint                | Description                |
|--------|-------------------------|----------------------------|
| POST   | /register               | Register a new user        |
| POST   | /login                  | Login and get JWT token    |
| POST   | /logout                 | Logout (demo endpoint)     |
| GET    | /employees              | List all employees (JWT required)  |
| GET    | /employees/<id>         | Get one employee (JWT required)    |
| POST   | /employees              | Create new employee (JWT required, Pydantic validation) |
| PUT    | /employees/<id>         | Update employee (JWT required, Pydantic validation)     |
| DELETE | /employees/<id>         | Delete employee (JWT required)    |

### Example API Calls
**List employees:**
```bash
curl http://localhost:5000/employees
```

**Get employee:**
```bash
curl http://localhost:5000/employees/1
```

**Create employee:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","department":"IT","phone":"1234567890"}' http://localhost:5000/employees
```

**Update employee:**
```bash
curl -X PUT -H "Content-Type: application/json" -d '{"name":"Jane Doe"}' http://localhost:5000/employees/1
```

**Delete employee:**
```bash
curl -X DELETE http://localhost:5000/employees/1
```

## Authentication
- All `/employees` endpoints require JWT authentication.
- Use `/register` to create a user and `/login` to obtain a JWT token.
- Pass the token in the `Authorization: Bearer <token>` header for all protected requests.

## Testing
- Tests use Pytest and a separate in-memory SQLite database for isolation.
- All API tests use JWT authentication; the test client automatically registers and logs in a test user.
- Test files are in the `tests/` folder.

## How to Run Backend Tests (Windows)

1. Open PowerShell in the project root (`C:\Users\vasam\Downloads\employee`).
2. Set the Python path and run tests:
   ```powershell
   $env:PYTHONPATH="."; pytest employee_app/tests
   ```
3. If you see `ModuleNotFoundError`, check that you are in the correct folder and that `employee_app` is a valid Python package (contains `__init__.py`).

## How to Run Backend Tests and Generate HTML Report

To run all backend tests and generate an HTML report:

```powershell
python -m pytest employee_app/tests --html=report.html
```

- The test results will be saved in `report.html` in your project root.
- Open `report.html` in your browser to view the detailed test report.

Make sure all dependencies are installed:
```powershell
pip install -r employee_app/requirements.txt
```

## Troubleshooting
- If you see database errors, ensure SQLite is accessible and the app has permission to write.
- For JWT errors, check the token format and expiration.
- For CORS issues, ensure Flask CORS is enabled and the frontend uses the correct API URL.
- For validation errors, check Pydantic schema requirements (name, email, department, phone, password).

## Extensions & Recommendations
- Add more user roles and permissions for advanced access control.
- Use environment variables for secret keys and database URIs in production.
- Add Swagger/OpenAPI documentation for easier API exploration.
- Consider using Docker for consistent deployment.

---

This README now provides a complete backend overview, including authentication, API endpoints, testing, troubleshooting, and extension ideas. Anyone can understand, run, and extend the Flask backend confidently.


