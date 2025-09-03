# Dockerfile for Flask backend
FROM python:3.10-slim

WORKDIR /app
COPY ../ /app/
ENV PYTHONPATH=/app

RUN pip install --upgrade pip && pip install -r employee_app/requirements.txt

EXPOSE 5000
CMD ["python", "employee_app/app/app.py"]
