"""
schemas.py
Pydantic models for validating employee and user data in API endpoints.

Defines schemas for employee creation and update requests, as well as user registration and login, using Pydantic.
Each field is validated for type, length, and format.
"""
from pydantic import BaseModel, EmailStr, constr  # EmailStr validates email format

class EmployeeCreateSchema(BaseModel):
    # Name must be a non-empty string
    name: constr(strip_whitespace=True, min_length=1)
    # Email must be a valid email address
    email: EmailStr
    # Department must be a non-empty string
    department: constr(strip_whitespace=True, min_length=1)
    # Phone must be exactly 10 digits
    phone: constr(strip_whitespace=True, min_length=10, max_length=10)

class EmployeeUpdateSchema(BaseModel):
    # All fields are optional for update, but validated if provided
    name: constr(strip_whitespace=True, min_length=1) = None
    email: EmailStr = None
    department: constr(strip_whitespace=True, min_length=1) = None
    phone: constr(strip_whitespace=True, min_length=10, max_length=10) = None

class UserRegisterSchema(BaseModel):
    # Name must be a non-empty string
    name: constr(strip_whitespace=True, min_length=1)
    # Email must be a valid email address
    email: EmailStr
    # Password must be at least 6 characters long
    password: constr(strip_whitespace=True, min_length=6)

class UserLoginSchema(BaseModel):
    # Email must be a valid email address
    email: EmailStr
    # Password must be at least 6 characters long
    password: constr(strip_whitespace=True, min_length=6)
