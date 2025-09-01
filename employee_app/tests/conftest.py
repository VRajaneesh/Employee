"""
conftest.py
Pytest fixtures for Employee Directory app.

This file sets up a separate in-memory SQLite test database and provides a Flask test client for isolated, repeatable API testing. It ensures that tests do not affect production data and that each test run starts with a clean database.
"""
import pytest
from employee_app.app.app import app
from employee_app.app.models.db import db

@pytest.fixture(scope='session')
def test_app():
    """
    Pytest fixture to configure the Flask app for testing with an in-memory SQLite database.
    Creates all tables before tests and drops them after.
    """
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture()
def client(test_app):
    """
    Pytest fixture to provide a Flask test client for API requests.
    """
    return test_app.test_client()
