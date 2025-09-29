# Retinal Disease Detection System

A comprehensive full-stack application for AI-powered retinal disease detection and analysis, built with Next.js frontend and Django REST Framework backend.

## 🏥 Overview

This system provides healthcare professionals with an intelligent tool for early detection and analysis of retinal diseases including:

- Diabetic Retinopathy
- Glaucoma
- Age-related Macular Degeneration (AMD)
- Hypertensive Retinopathy

## 🎯 Features

### Core Functionality

- **AI-Powered Analysis**: Advanced deep learning models for accurate disease detection
- **Image Upload & Processing**: Support for multiple retinal image formats
- **Real-time Predictions**: Fast analysis with confidence scoring
- **Clinical Recommendations**: Evidence-based treatment suggestions
- **Medical Records**: Comprehensive patient history management
- **Dashboard Analytics**: Visual insights and statistics

### User Management

- **Role-based Access**: Different permission levels for healthcare professionals
- **Secure Authentication**: JWT-based authentication system
- **User Profiles**: Detailed healthcare provider information

### Technical Features

- **Responsive Design**: Optimized for desktop and mobile devices
- **RESTful API**: Well-documented API endpoints
- **File Upload**: Secure image handling with validation
- **Real-time Updates**: Dynamic dashboard statistics

## 🛠 Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Hook Form** - Form handling and validation
- **Recharts** - Data visualization charts
- **Lucide React** - Modern icon library

### Backend

- **Django 4.2** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL/SQLite** - Database management
- **JWT Authentication** - Secure token-based auth
- **Pillow** - Image processing library
- **OpenCV** - Computer vision operations
- **TensorFlow** - Deep learning framework

### AI/ML Components

- **Image Preprocessing**: CLAHE, noise reduction, normalization
- **Feature Detection**: Automated retinal feature identification
- **Disease Classification**: Multi-class disease prediction
- **Confidence Scoring**: Reliability assessment of predictions

## 📋 Prerequisites

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Python**: 3.8 or higher
- **Node.js**: 18 or higher
- **Memory**: 8GB RAM minimum (16GB recommended)
- **Storage**: 25GB available space

### Development Tools

- **Git** - Version control
- **VS Code** - Recommended IDE
- **Anaconda** - Python environment management (optional)
- **Docker** - Containerization (optional)

## 🚀 Installation & Setup

### Backend Setup (Django)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd retinal-detection-app/backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**

   ```bash
   cp .env.example .env
   # Edit .env file with your settings
   ```

5. **Database setup**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Create sample data** (Optional)

   ```bash
   python manage.py loaddata fixtures/sample_diseases.json
   ```

7. **Run development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (Next.js)

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment configuration**

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API URLs
   ```

4. **Run development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

## 📁 Project Structure

```
retinal-detection-app/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages and layouts
│   ├── components/          # Reusable React components
│   ├── contexts/           # React context providers
│   ├── lib/               # Utility functions and API client
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/               # Django backend application
│   ├── retinal_detection/ # Main Django project
│   ├── accounts/          # User management app
│   ├── detection/         # Core detection models
│   ├── api/              # REST API endpoints
│   ├── media/            # Uploaded images
│   ├── staticfiles/      # Static files
│   └── requirements.txt  # Backend dependencies
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MEDIA_URL=http://localhost:8000/media
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

## 🔑 API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/login/` - User login
- `POST /api/v1/auth/refresh/` - Refresh token
- `GET /api/v1/auth/profile/` - User profile

### Core Endpoints

- `GET /api/v1/patients/` - List patients
- `POST /api/v1/patients/` - Create patient
- `POST /api/v1/analyze/` - Analyze retinal image
- `GET /api/v1/predictions/` - List predictions
- `GET /api/v1/dashboard/stats/` - Dashboard statistics

### Image Analysis Request

```javascript
const formData = new FormData();
formData.append("image", file);
formData.append("patient_id", "P001");
formData.append("eye", "left");
formData.append("image_quality", "good");

fetch("/api/v1/analyze/", {
  method: "POST",
  body: formData,
  headers: {
    Authorization: "Bearer " + token,
  },
});
```

## 🧪 Usage Examples

### 1. Image Upload and Analysis

```javascript
import { analysis } from "@/lib/api";

const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const result = await analysis.analyzeImage(formData);
    console.log("Analysis result:", result);
  } catch (error) {
    console.error("Analysis failed:", error);
  }
};
```

### 2. Patient Management

```javascript
import { patients } from "@/lib/api";

const createPatient = async (patientData) => {
  try {
    const patient = await patients.create(patientData);
    console.log("Patient created:", patient);
  } catch (error) {
    console.error("Patient creation failed:", error);
  }
};
```

## 🧠 AI Model Integration

### Current Implementation

The system uses a mock AI processor that simulates real model behavior. For production deployment:

1. **Replace Mock Processor**: Update `backend/api/ai_processor.py` with actual trained models
2. **Model Files**: Place trained model files in `backend/models/` directory
3. **GPU Support**: Configure CUDA for GPU acceleration
4. **Model Versioning**: Implement model version control

### Supported Image Formats

- JPEG/JPG
- PNG
- BMP
- TIFF

### Image Requirements

- **Size**: Maximum 10MB
- **Resolution**: Minimum 224x224 pixels
- **Quality**: Clear fundus photographs
- **Centering**: Optic disc and macula visible

## 🛡 Security Considerations

### Authentication & Authorization

- JWT-based authentication
- Role-based permissions
- Token refresh mechanism
- Secure password hashing

### Data Protection

- HIPAA compliance considerations
- Encrypted data transmission
- Secure file upload validation
- Patient data anonymization options

### API Security

- CORS configuration
- Rate limiting (implement in production)
- Input validation
- SQL injection prevention

## 🚀 Deployment

### Production Checklist

- [ ] Set `DEBUG=False` in Django settings
- [ ] Configure production database (PostgreSQL)
- [ ] Set up static/media file serving (AWS S3, CDN)
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up monitoring and logging
- [ ] Implement backup strategies
- [ ] Configure email notifications

### Docker Deployment (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Cloud Deployment Options

- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: AWS EC2, Google Cloud Run, DigitalOcean
- **Database**: AWS RDS, Google Cloud SQL
- **File Storage**: AWS S3, Google Cloud Storage

## 🧪 Testing

### Backend Testing

```bash
cd backend
python manage.py test
```

### Frontend Testing

```bash
cd frontend
npm test
```

### API Testing

Use tools like Postman or curl to test API endpoints:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'
```

## 📊 Performance Optimization

### Frontend Optimization

- Image lazy loading
- Code splitting
- Bundle size optimization
- Caching strategies

### Backend Optimization

- Database query optimization
- Image compression
- Caching with Redis (add if needed)
- Async task processing with Celery

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Errors

**Problem**: Frontend can't communicate with backend
**Solution**: Verify CORS settings in Django settings.py

#### 2. File Upload Fails

**Problem**: Images not uploading properly
**Solution**: Check file size limits and permissions

#### 3. Authentication Issues

**Problem**: Token refresh not working
**Solution**: Verify JWT settings and token storage

#### 4. Database Migration Errors

**Problem**: Migration conflicts
**Solution**: Reset migrations or resolve conflicts manually

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m 'Add new feature'`
5. Push to branch: `git push origin feature/new-feature`
6. Submit pull request

### Code Style Guidelines

- **Frontend**: ESLint + Prettier configuration
- **Backend**: PEP 8 Python style guide
- **Commit Messages**: Conventional commits format

## 📞 Support

### Getting Help

- Create GitHub issues for bugs/feature requests
- Check existing documentation and FAQ
- Review API documentation for integration help

### Medical Disclaimer

This software is for screening and research purposes only. All AI-generated results should be reviewed by qualified medical professionals before making clinical decisions.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Healthcare professionals who provided domain expertise
- Open source medical imaging datasets
- Deep learning research community
- Contributors and testers

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Maintainers**: Development Team
