# Backend Setup Guide

This guide will help you set up the Django backend for the Retinal Detection System.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Virtual environment tool (venv, conda, or virtualenv)

## Step-by-Step Setup

### 1. Environment Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
# Install required packages
pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# Required settings:
# - SECRET_KEY: Django secret key
# - DEBUG: Set to True for development
# - DATABASE_URL: Database connection string
```

### 4. Database Setup

```bash
# Create database tables
python manage.py makemigrations accounts
python manage.py makemigrations detection
python manage.py migrate

# Create superuser account
python manage.py createsuperuser
```

### 5. Load Sample Data (Optional)

```bash
# Create sample diseases
python manage.py shell
```

In the shell, run:

```python
from detection.models import Disease

diseases = [
    {
        'name': 'Diabetic Retinopathy',
        'description': 'Diabetes complication that affects eyes',
        'icd_code': 'E11.3',
        'severity_levels': ['Mild', 'Moderate', 'Severe', 'Proliferative']
    },
    {
        'name': 'Glaucoma',
        'description': 'Group of eye conditions that damage the optic nerve',
        'icd_code': 'H40.9',
        'severity_levels': ['Mild', 'Moderate', 'Severe']
    },
    {
        'name': 'Age-related Macular Degeneration',
        'description': 'Eye disorder that causes central vision loss',
        'icd_code': 'H35.3',
        'severity_levels': ['Early', 'Intermediate', 'Advanced']
    }
]

for disease_data in diseases:
    Disease.objects.get_or_create(
        name=disease_data['name'],
        defaults=disease_data
    )

exit()
```

### 6. Run Development Server

```bash
# Start the Django development server
python manage.py runserver

# Server will be available at: http://localhost:8000
# Admin panel: http://localhost:8000/admin
# API documentation: http://localhost:8000/api/v1/
```

## Testing the API

### 1. Create Test User

Access the admin panel at http://localhost:8000/admin and create a user with the following details:

- Username: testdoctor
- Password: testpass123
- Role: doctor
- Email: doctor@example.com

### 2. Test Authentication

```bash
# Login API test
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testdoctor", "password": "testpass123"}'
```

### 3. Test Protected Endpoints

```bash
# Replace YOUR_TOKEN with the access token from login response
curl -X GET http://localhost:8000/api/v1/patients/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Common Issues and Solutions

### Issue: Module Not Found

**Error**: `ModuleNotFoundError: No module named 'rest_framework'`
**Solution**: Ensure virtual environment is activated and run `pip install -r requirements.txt`

### Issue: Database Migration Errors

**Error**: Migration conflicts or table already exists
**Solution**:

```bash
# Reset migrations (development only)
python manage.py migrate --fake-initial
# or
rm -rf */migrations/0*.py
python manage.py makemigrations
python manage.py migrate
```

### Issue: CORS Errors

**Error**: Frontend can't connect to API
**Solution**: Verify CORS_ALLOWED_ORIGINS in settings.py includes your frontend URL

## Production Configuration

For production deployment, update these settings:

1. **Security Settings**

   ```python
   DEBUG = False
   ALLOWED_HOSTS = ['yourdomain.com']
   SECRET_KEY = 'your-production-secret-key'
   ```

2. **Database Configuration**

   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'retinal_db',
           'USER': 'db_user',
           'PASSWORD': 'db_password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

3. **Static Files**
   ```python
   STATIC_ROOT = '/path/to/static/'
   MEDIA_ROOT = '/path/to/media/'
   ```

## API Endpoints Reference

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| POST   | `/api/v1/auth/login/`      | User authentication   |
| POST   | `/api/v1/auth/refresh/`    | Token refresh         |
| GET    | `/api/v1/auth/profile/`    | User profile          |
| GET    | `/api/v1/patients/`        | List patients         |
| POST   | `/api/v1/patients/`        | Create patient        |
| POST   | `/api/v1/analyze/`         | Analyze retinal image |
| GET    | `/api/v1/predictions/`     | List predictions      |
| GET    | `/api/v1/dashboard/stats/` | Dashboard statistics  |

## Monitoring and Logging

For production, consider adding:

- Application monitoring (Sentry, New Relic)
- Logging configuration
- Performance monitoring
- Health check endpoints

## Backup and Maintenance

Regular maintenance tasks:

```bash
# Database backup
python manage.py dumpdata > backup.json

# Clean up old media files (create custom management command)
python manage.py cleanup_media

# Update dependencies
pip list --outdated
pip install --upgrade package_name
```
