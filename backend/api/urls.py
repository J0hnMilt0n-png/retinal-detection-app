from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    PatientViewSet,
    RetinalImageViewSet,
    PredictionViewSet,
    DiseaseViewSet,
    MedicalHistoryViewSet,
    ImageAnalysisView,
    DashboardStatsView,
    user_profile
)

# Create router for viewsets
router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'retinal-images', RetinalImageViewSet)
router.register(r'predictions', PredictionViewSet)
router.register(r'diseases', DiseaseViewSet)
router.register(r'medical-history', MedicalHistoryViewSet)

urlpatterns = [
    # Authentication
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', user_profile, name='user_profile'),
    
    # Image Analysis
    path('analyze/', ImageAnalysisView.as_view(), name='image_analysis'),
    
    # Dashboard
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    
    # Include router URLs
    path('', include(router.urls)),
]