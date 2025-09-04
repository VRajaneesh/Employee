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
- JWT authentication for secure endpoints
- Password reset and forgot password endpoints
- Dockerized backend and frontend for easy deployment
- Comprehensive docstrings and inline documentation for maintainability

## New Features (Week 3)
- Environment-specific configuration with `.env.dev` and `.env.prod`
- Secure secret management and `.gitignore` for sensitive files
- Improved error handling and validation for all endpoints
- Angular Material UI integration in frontend
- Docker Compose setup for full-stack deployment
- Expanded API documentation and example calls

## Tech Stack
- Python 3
- Flask
- Flask-SQLAlchemy
- Pydantic
- SQLite (default)
- Flask-JWT-Extended (JWT authentication)
- Flask-CORS (CORS support)
- Docker & Docker Compose (containerized deployment)

## Git Instructions

Clone the repository:
```powershell
git clone https://github.com/VRajaneesh/Employee.git
cd Employee
```

To update your local copy with the latest changes:
```powershell
git pull origin main
```


## Setup Instructions
## Environment Variables

The backend uses environment files to manage configuration for different environments:

- `.env.dev` (development)
- `.env.prod` (production)

**Required variables:**

| Variable      | Description                       | Example (dev)                | Example (prod)                |
|--------------|-----------------------------------|------------------------------|-------------------------------|
| DEBUG        | Enable debug mode                 | True                         | False                         |
| DATABASE_URL | Database connection string        | sqlite:///dev.db             | postgresql://user:pass@host/db|
| SECRET_KEY   | Secret key for Flask/JWT          | dev-secret-key               | prod-secret-key               |

**Best Practices:**
- Do not commit `.env*` files to version control (see `.gitignore`).
- Set production secrets securely in your deployment environment.
- Document any additional required variables in this section.
**Important:** Run all commands from the parent directory for correct imports and module resolution.
1. Clone or download the project.
2. Open a terminal in the project folder.
3. Change directory to the backend folder:
   ```powershell
   cd employee_app
   ```
4. Create and activate a virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
5. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

6. Change directory back to the project root:
   ```powershell
   cd ..
   ```
7. Run the backend server:
   ```powershell
   python -m employee_app.app.app
   ```

## API Endpoints
| Method | Endpoint                | Description                                 |
|--------|-------------------------|---------------------------------------------|
| POST   | /register               | Register a new user                         |
| POST   | /login                  | Login and get JWT token                     |
| POST   | /logout                 | Logout (demo endpoint)                      |
| POST   | /forgot-password        | Request password reset link                 |
| POST   | /reset-password         | Reset password using token                  |
| GET    | /employees              | List all employees (JWT required)           |
| GET    | /employees/<id>         | Get one employee (JWT required)             |
| POST   | /employees              | Create new employee (JWT required, Pydantic validation) |
| PUT    | /employees/<id>         | Update employee (JWT required, Pydantic validation)     |
| DELETE | /employees/<id>         | Delete employee (JWT required)              |

### Example API Calls

**Register a new user:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"yourpassword"}' http://localhost:5000/register
```

**Login and get JWT token:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"yourpassword"}' http://localhost:5000/login
```

Assume the login response returns:
```json
{
   "access_token": "<JWT_TOKEN>"
}
```

**List employees (JWT required):**
```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:5000/employees
```

**Get employee (JWT required):**
```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:5000/employees/1
```

**Create employee (JWT required):**
```bash
curl -X POST -H "Authorization: Bearer <JWT_TOKEN>" -H "Content-Type: application/json" \
   -d '{"name":"John Doe","email":"john@example.com","department":"IT","phone":"1234567890"}' \
   http://localhost:5000/employees
```

**Update employee (JWT required):**
```bash
curl -X PUT -H "Authorization: Bearer <JWT_TOKEN>" -H "Content-Type: application/json" \
   -d '{"name":"Jane Doe"}' \
   http://localhost:5000/employees/1
```

**Delete employee (JWT required):**
```bash
curl -X DELETE -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:5000/employees/1
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

1. Open PowerShell in the project root.
2. Set the Python path and run tests:
   ```powershell
   $env:PYTHONPATH="."; pytest employee_app/tests
   ```

## How to Run Backend Tests and Generate HTML Report

To run all backend tests and generate an HTML report:

```powershell
python -m pytest employee_app/tests --html=report.html
```

- The test results will be saved in `report.html` in your project root.
- Open `report.html` in your browser to view the detailed test report.

## Docker Deployment

Use docker-compose to run both backend and frontend together:
```powershell
docker-compose up --build -d
```
This builds the images and starts all services in the background.

Or, if you want to run the services in the foreground and see the logs directly:
```powershell
docker-compose up --build
```

To stop all running services:
```powershell
   docker-compose down
   ```

- Backend will be available at http://localhost:5000
- Frontend will be available at http://localhost:4200
- See `docker-compose.yml` for details.

## Known Issues & Limitations

- SQLite is used for both development and production by default. For production, consider using PostgreSQL or another robust database.
- Password reset email is simulated (token is printed/logged, not sent).
- API rate limiting and advanced security features (e.g., HTTPS, CSRF) are not enabled by default.
- Frontend and backend must be started together for full functionality.

---

This README now provides a complete backend overview, including authentication, API endpoints, testing, troubleshooting, and extension ideas. Anyone can understand, run, and extend the Flask backend confidently.


