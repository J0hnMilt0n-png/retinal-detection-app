# Deployment Guide

This guide covers deployment options for the Retinal Detection System in production environments.

## 🚀 Deployment Architecture

### Recommended Production Setup

```
Frontend (Next.js) -> CDN -> Load Balancer -> Backend (Django) -> Database
                                    ↓
                               File Storage (S3/GCS)
```

## 🖥 Frontend Deployment

### Option 1: Vercel (Recommended)

#### Prerequisites

- GitHub/GitLab repository
- Vercel account

#### Steps

1. **Connect Repository**

   ```bash
   # Push code to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Environment Variables**

   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api/v1
   NEXT_PUBLIC_MEDIA_URL=https://your-api-domain.com/media
   NEXT_PUBLIC_APP_NAME=RetinalDetect
   NEXT_PUBLIC_MAX_FILE_SIZE=10485760
   ```

4. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Configure DNS records
   - SSL certificate automatically handled

### Option 2: Netlify

#### Steps

1. **Build Project**

   ```bash
   cd frontend
   npm run build
   npm run export  # For static export
   ```

2. **Deploy to Netlify**

   - Create account at [netlify.com](https://netlify.com)
   - Drag and drop `out/` folder
   - Or connect GitHub repository

3. **Configure Redirects**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   /api/*  https://your-backend.com/api/:splat  200
   ```

### Option 3: AWS S3 + CloudFront

#### Steps

1. **Build Static Site**

   ```bash
   npm run build
   npm run export
   ```

2. **Create S3 Bucket**

   ```bash
   aws s3 mb s3://your-app-bucket
   aws s3 website s3://your-app-bucket --index-document index.html
   ```

3. **Upload Files**

   ```bash
   aws s3 sync out/ s3://your-app-bucket --delete
   ```

4. **Configure CloudFront**
   - Create CloudFront distribution
   - Set S3 bucket as origin
   - Configure custom error pages for SPA routing

## 🐍 Backend Deployment

### Option 1: AWS EC2

#### Prerequisites

- AWS account
- EC2 instance (Ubuntu/Amazon Linux)
- Domain name (optional)

#### Steps

1. **Server Setup**

   ```bash
   # Connect to EC2 instance
   ssh -i your-key.pem ubuntu@your-instance-ip

   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install dependencies
   sudo apt install python3 python3-pip python3-venv nginx postgresql -y
   ```

2. **Application Setup**

   ```bash
   # Clone repository
   git clone your-repository-url
   cd retinal-detection-app/backend

   # Create virtual environment
   python3 -m venv venv
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt
   pip install gunicorn psycopg2-binary
   ```

3. **Database Setup**

   ```bash
   # Configure PostgreSQL
   sudo -u postgres createdb retinal_db
   sudo -u postgres createuser --interactive

   # Update Django settings for production
   export DATABASE_URL=postgresql://user:password@localhost/retinal_db
   export DEBUG=False
   export ALLOWED_HOSTS=your-domain.com

   # Run migrations
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

4. **Gunicorn Configuration**
   Create `/etc/systemd/system/gunicorn.service`:

   ```ini
   [Unit]
   Description=Gunicorn instance to serve retinal-detection
   After=network.target

   [Service]
   User=ubuntu
   Group=www-data
   WorkingDirectory=/home/ubuntu/retinal-detection-app/backend
   Environment="PATH=/home/ubuntu/retinal-detection-app/backend/venv/bin"
   ExecStart=/home/ubuntu/retinal-detection-app/backend/venv/bin/gunicorn --workers 3 --bind unix:/home/ubuntu/retinal-detection-app/backend/retinal_detection.sock retinal_detection.wsgi:application

   [Install]
   WantedBy=multi-user.target
   ```

5. **Nginx Configuration**
   Create `/etc/nginx/sites-available/retinal-detection`:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location = /favicon.ico { access_log off; log_not_found off; }
       location /static/ {
           root /home/ubuntu/retinal-detection-app/backend;
       }
       location /media/ {
           root /home/ubuntu/retinal-detection-app/backend;
       }

       location / {
           include proxy_params;
           proxy_pass http://unix:/home/ubuntu/retinal-detection-app/backend/retinal_detection.sock;
       }
   }
   ```

6. **Enable Services**
   ```bash
   sudo systemctl start gunicorn
   sudo systemctl enable gunicorn
   sudo ln -s /etc/nginx/sites-available/retinal-detection /etc/nginx/sites-enabled
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 2: Google Cloud Run

#### Steps

1. **Containerize Application**
   Create `Dockerfile` in backend/:

   ```dockerfile
   FROM python:3.9-slim

   WORKDIR /app

   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   COPY . .

   RUN python manage.py collectstatic --noinput

   EXPOSE 8080

   CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 retinal_detection.wsgi:application
   ```

2. **Deploy to Cloud Run**

   ```bash
   # Build and push container
   gcloud builds submit --tag gcr.io/PROJECT-ID/retinal-detection

   # Deploy to Cloud Run
   gcloud run deploy --image gcr.io/PROJECT-ID/retinal-detection --platform managed
   ```

### Option 3: Docker + DigitalOcean

#### Steps

1. **Create docker-compose.yml**

   ```yaml
   version: "3.8"

   services:
     web:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - DEBUG=False
         - DATABASE_URL=postgresql://user:pass@db:5432/retinal_db
       depends_on:
         - db

     db:
       image: postgres:13
       environment:
         - POSTGRES_DB=retinal_db
         - POSTGRES_USER=user
         - POSTGRES_PASSWORD=pass
       volumes:
         - postgres_data:/var/lib/postgresql/data/

     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
       depends_on:
         - web

   volumes:
     postgres_data:
   ```

2. **Deploy to DigitalOcean**
   ```bash
   # Create droplet and install Docker
   docker-compose up -d
   ```

## 🗄 Database Options

### PostgreSQL (Recommended)

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'retinal_db'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

### AWS RDS

- Managed PostgreSQL service
- Automatic backups and scaling
- High availability options

### Google Cloud SQL

- Managed database service
- Automatic maintenance and updates
- Built-in security features

## 📁 File Storage

### AWS S3

```python
# settings.py
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATICFILES_STORAGE = 'storages.backends.s3boto3.StaticS3Boto3Storage'

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'us-east-1')
```

### Google Cloud Storage

```python
# settings.py
DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
GS_BUCKET_NAME = os.getenv('GS_BUCKET_NAME')
GS_PROJECT_ID = os.getenv('GS_PROJECT_ID')
```

## 🔒 SSL/HTTPS Configuration

### Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### CloudFlare SSL

- Free SSL certificates
- DDoS protection
- CDN capabilities

## 📊 Monitoring & Logging

### Application Monitoring

```python
# settings.py - Add Sentry for error tracking
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="YOUR_SENTRY_DSN",
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,
    send_default_pii=True
)
```

### Server Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop netstat

# Log monitoring
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u gunicorn -f
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install
        working-directory: ./frontend
      - run: npm run build
        working-directory: ./frontend
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.3
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /home/ubuntu/retinal-detection-app
            git pull origin main
            source venv/bin/activate
            pip install -r requirements.txt
            python manage.py migrate
            python manage.py collectstatic --noinput
            sudo systemctl restart gunicorn
```

## 🔧 Environment Variables

### Production Environment Variables

```bash
# Backend
export SECRET_KEY='your-production-secret-key'
export DEBUG=False
export ALLOWED_HOSTS='your-domain.com,www.your-domain.com'
export DATABASE_URL='postgresql://user:pass@host:port/db'
export AWS_ACCESS_KEY_ID='your-aws-key'
export AWS_SECRET_ACCESS_KEY='your-aws-secret'
export AWS_STORAGE_BUCKET_NAME='your-s3-bucket'

# Frontend
export NEXT_PUBLIC_API_BASE_URL='https://api.your-domain.com/api/v1'
export NEXT_PUBLIC_MEDIA_URL='https://media.your-domain.com'
```

## 🛡 Security Checklist

### Backend Security

- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Use HTTPS only
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable Django security middleware
- [ ] Regular dependency updates

### Frontend Security

- [ ] Use HTTPS only
- [ ] Configure Content Security Policy
- [ ] Validate all user inputs
- [ ] Sanitize file uploads
- [ ] Use secure authentication tokens
- [ ] Implement rate limiting

## 🔄 Backup Strategy

### Database Backups

```bash
# PostgreSQL backup script
#!/bin/bash
DB_NAME="retinal_db"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump $DB_NAME > $BACKUP_DIR/backup_$DATE.sql
aws s3 cp $BACKUP_DIR/backup_$DATE.sql s3://backup-bucket/
```

### File Backups

```bash
# Media files backup
aws s3 sync /path/to/media/ s3://backup-bucket/media/ --delete
```

## 🚨 Disaster Recovery

### Recovery Procedures

1. **Database Recovery**

   ```bash
   # Restore from backup
   psql retinal_db < backup_file.sql
   ```

2. **Application Recovery**

   ```bash
   # Restore application code
   git clone backup-repository
   # Restore configuration
   # Restart services
   ```

3. **Monitoring Setup**
   - Health check endpoints
   - Alerting for downtime
   - Performance monitoring

## 📈 Performance Optimization

### Backend Optimization

- Database query optimization
- Caching with Redis
- Image compression
- CDN for static files

### Frontend Optimization

- Code splitting
- Image optimization
- Bundle analysis
- Performance monitoring

## 📞 Troubleshooting

### Common Production Issues

1. **502 Bad Gateway**: Check Gunicorn status
2. **Database Connection**: Verify credentials and network
3. **Static Files 404**: Run `collectstatic` command
4. **SSL Issues**: Check certificate validity
5. **High Memory Usage**: Monitor and optimize queries

### Useful Commands

```bash
# Check service status
sudo systemctl status gunicorn
sudo systemctl status nginx

# View logs
sudo journalctl -u gunicorn -n 50
sudo tail -f /var/log/nginx/error.log

# Restart services
sudo systemctl restart gunicorn
sudo systemctl reload nginx
```
