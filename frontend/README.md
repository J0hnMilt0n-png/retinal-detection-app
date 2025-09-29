# Frontend Setup Guide

This guide will help you set up the Next.js frontend for the Retinal Detection System.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git

## Step-by-Step Setup

### 1. Environment Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or if using yarn
yarn install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your configuration
```

Required environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MEDIA_URL=http://localhost:8000/media

# App Configuration
NEXT_PUBLIC_APP_NAME=RetinalDetect
NEXT_PUBLIC_APP_VERSION=1.0.0

# Upload Settings
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/bmp,image/tiff
```

### 3. Development Server

```bash
# Start development server
npm run dev
# or
yarn dev

# Application will be available at: http://localhost:3000
```

## Features Overview

### Core Components

#### 1. Navigation Component

- Responsive navigation bar
- Mobile-friendly hamburger menu
- Authentication state awareness
- Role-based menu items

#### 2. Hero Component

- Landing page with feature highlights
- Call-to-action buttons
- Statistics display
- Responsive design

#### 3. Image Upload Component

- Drag-and-drop file upload
- Image preview functionality
- File validation (type, size)
- Upload progress indication
- Analysis trigger

#### 4. Results Component

- Detailed analysis results display
- Confidence scoring visualization
- Clinical recommendations
- Feature detection highlights
- Export functionality

#### 5. Dashboard Component

- Analytics charts and graphs
- Recent analyses table
- Disease distribution charts
- Performance metrics

### Authentication System

The application uses JWT-based authentication with automatic token refresh:

```typescript
// Login example
import { useAuth } from "@/contexts/AuthContext";

const { login } = useAuth();

const handleLogin = async (credentials) => {
  try {
    await login(credentials);
    // Redirect to dashboard
  } catch (error) {
    // Handle login error
  }
};
```

### API Integration

The frontend communicates with the Django backend through a centralized API client:

```typescript
import { analysis } from "@/lib/api";

// Analyze image
const analyzeImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const result = await analysis.analyzeImage(formData);
    return result;
  } catch (error) {
    throw error;
  }
};
```

## Styling with Tailwind CSS

The application uses Tailwind CSS for styling with a custom design system:

### Color Palette

- **Primary**: Blue shades for main actions and branding
- **Medical**: Green shades for medical/health related elements
- **Warning**: Orange/Red for alerts and abnormal findings
- **Neutral**: Gray shades for backgrounds and text

### Custom Components

```css
/* Custom animations */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.slide-up {
  animation: slideUp 0.5s ease-out;
}
```

### Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Component Structure

```
components/
├── Navigation.tsx      # Main navigation bar
├── Hero.tsx           # Landing page hero section
├── ImageUpload.tsx    # File upload and analysis
├── Results.tsx        # Analysis results display
└── Dashboard.tsx      # Analytics dashboard
```

## State Management

### Authentication Context

```typescript
// Access user data and auth functions
const { user, login, logout, isAuthenticated } = useAuth();
```

### Local State Management

Components use React hooks for local state:

- `useState` for component state
- `useEffect` for side effects
- `useCallback` for memoized callbacks

## Image Upload Flow

1. **File Selection**: User selects/drops image file
2. **Validation**: Check file type, size, and format
3. **Preview**: Display image preview to user
4. **Upload**: Send file to backend API
5. **Processing**: Show loading state during AI analysis
6. **Results**: Display analysis results and recommendations

## Error Handling

### API Error Handling

```typescript
try {
  const result = await api.someEndpoint();
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Handle authentication error
  } else if (error.response?.status === 400) {
    // Handle validation error
  } else {
    // Handle other errors
  }
}
```

### Form Validation

The application includes client-side validation for:

- File type validation
- File size limits
- Required fields
- Format validation

## Performance Optimization

### Image Optimization

- Lazy loading for images
- Responsive images with Next.js Image component
- Optimized image formats (WebP when supported)

### Code Splitting

- Dynamic imports for large components
- Route-based code splitting
- Library code splitting

### Caching Strategy

- API response caching
- Static asset caching
- Service worker for offline support (optional)

## Testing

### Unit Testing

```bash
# Run unit tests
npm test
# or
yarn test
```

### E2E Testing (Optional)

```bash
# Install Playwright or Cypress
npm install --save-dev @playwright/test

# Run E2E tests
npm run test:e2e
```

## Build and Deployment

### Development Build

```bash
npm run build
npm run start
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Static Export (Optional)

```bash
# Export static site
npm run build && npm run export
```

## Deployment Options

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Netlify

1. Build project locally
2. Upload build folder to Netlify
3. Configure redirects for SPA

### AWS S3 + CloudFront

1. Build static files
2. Upload to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain

## Troubleshooting

### Common Issues

#### 1. API Connection Failed

**Error**: Cannot connect to backend API
**Solution**:

- Check if backend server is running
- Verify API_BASE_URL in .env.local
- Check CORS configuration in Django

#### 2. Image Upload Fails

**Error**: File upload returns 400/500 error
**Solution**:

- Check file size limits
- Verify file format is supported
- Check backend storage configuration

#### 3. Build Errors

**Error**: TypeScript or build compilation errors
**Solution**:

- Run `npm install` to update dependencies
- Check for TypeScript errors
- Verify all imports are correct

#### 4. Styling Issues

**Error**: Tailwind styles not applying
**Solution**:

- Ensure Tailwind is properly configured
- Check if custom CSS is conflicting
- Verify class names are correct

## Browser Support

The application supports:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Considerations

### Client-Side Security

- Input sanitization
- XSS prevention
- Secure token storage
- HTTPS enforcement (production)

### File Upload Security

- Client-side file type validation
- File size restrictions
- Malicious file detection (backend)

## Contributing

### Development Guidelines

1. Follow TypeScript best practices
2. Use ESLint and Prettier for code formatting
3. Write meaningful component names
4. Add JSDoc comments for complex functions
5. Test components thoroughly

### Code Style

```typescript
// Good: Descriptive component name and props
interface ImageUploadProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  maxFileSize?: number;
}

export default function ImageUpload({
  onAnalysisComplete,
  maxFileSize = 10 * 1024 * 1024,
}: ImageUploadProps) {
  // Component implementation
}
```

## Performance Monitoring

### Metrics to Monitor

- Page load times
- API response times
- Bundle size
- Core Web Vitals
- Error rates

### Tools

- Next.js Analytics
- Google Analytics
- Lighthouse
- Web Vitals extension
