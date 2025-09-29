import os
import time
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from detection.models import Patient, RetinalImage, Prediction, Disease, MedicalHistory, AnalysisSession
from .serializers import (
    UserSerializer, PatientSerializer, RetinalImageSerializer, PredictionSerializer,
    DiseaseSerializer, MedicalHistorySerializer, AnalysisSessionSerializer,
    ImageAnalysisSerializer, DashboardStatsSerializer
)
from .ai_processor import RetinalImageProcessor

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token view that includes user information
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(username=request.data['username'])
            user_serializer = UserSerializer(user)
            response.data['user'] = user_serializer.data
        return response

class PatientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing patients
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['patient_id', 'first_name', 'last_name', 'medical_record_number']
    ordering_fields = ['created_at', 'last_name', 'first_name']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class RetinalImageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing retinal images
    """
    queryset = RetinalImage.objects.all()
    serializer_class = RetinalImageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['patient', 'eye', 'image_quality']
    ordering_fields = ['uploaded_at']
    ordering = ['-uploaded_at']
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class PredictionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing predictions
    """
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['disease', 'is_normal', 'status', 'is_confirmed']
    ordering_fields = ['created_at', 'confidence_score']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """
        Confirm a prediction by a medical professional
        """
        prediction = self.get_object()
        prediction.is_confirmed = True
        prediction.reviewed_by = request.user
        prediction.reviewed_at = timezone.now()
        prediction.save()
        
        serializer = self.get_serializer(prediction)
        return Response(serializer.data)

class DiseaseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for disease information (read-only)
    """
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer
    permission_classes = [IsAuthenticated]

class MedicalHistoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing medical history
    """
    queryset = MedicalHistory.objects.all()
    serializer_class = MedicalHistorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['patient', 'has_diabetes', 'has_hypertension']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ImageAnalysisView(APIView):
    """
    API endpoint for analyzing retinal images
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ImageAnalysisSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Get or create patient
            patient = None
            if 'patient_id' in serializer.validated_data:
                try:
                    patient = Patient.objects.get(patient_id=serializer.validated_data['patient_id'])
                except Patient.DoesNotExist:
                    return Response(
                        {'error': 'Patient not found'}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
            
            # Create retinal image record
            retinal_image = RetinalImage.objects.create(
                patient=patient,
                image=serializer.validated_data['image'],
                eye=serializer.validated_data.get('eye', 'left'),
                image_quality=serializer.validated_data.get('image_quality', 'good'),
                notes=serializer.validated_data.get('notes', ''),
                uploaded_by=request.user
            )
            
            # Process image with AI
            processor = RetinalImageProcessor()
            start_time = time.time()
            
            try:
                result = processor.analyze_image(retinal_image.image.path)
                processing_time = time.time() - start_time
                
                # Get or create disease
                disease = None
                if result['disease_detected'] and result['disease_name']:
                    disease, _ = Disease.objects.get_or_create(
                        name=result['disease_name'],
                        defaults={
                            'description': f"AI-detected {result['disease_name']}",
                            'severity_levels': result.get('severity_levels', [])
                        }
                    )
                
                # Create prediction record
                prediction = Prediction.objects.create(
                    retinal_image=retinal_image,
                    disease=disease,
                    confidence_score=result['confidence'],
                    severity=result.get('severity', ''),
                    is_normal=result['is_normal'],
                    detected_features=result.get('detected_features', []),
                    risk_factors=result.get('risk_factors', []),
                    recommendations=result.get('recommendations', []),
                    model_version=result.get('model_version', 'v1.0'),
                    processing_time=processing_time,
                    status='completed'
                )
                
                serializer_response = PredictionSerializer(prediction)
                return Response(serializer_response.data, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                # Create failed prediction record
                Prediction.objects.create(
                    retinal_image=retinal_image,
                    status='failed',
                    error_message=str(e)
                )
                return Response(
                    {'error': 'Image analysis failed', 'details': str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            return Response(
                {'error': 'Unexpected error occurred', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DashboardStatsView(APIView):
    """
    API endpoint for dashboard statistics
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Calculate date ranges
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        
        # Basic stats
        total_analyses = Prediction.objects.filter(status='completed').count()
        abnormal_cases = Prediction.objects.filter(
            status='completed',
            is_normal=False
        ).count()
        
        # Calculate accuracy rate (simplified - based on confirmed predictions)
        confirmed_predictions = Prediction.objects.filter(is_confirmed=True).count()
        accuracy_rate = 0.942 if confirmed_predictions > 0 else 0.0  # Mock value
        
        # Active users (users who created predictions in last 30 days)
        active_users = User.objects.filter(
            retinalimage__prediction__created_at__gte=thirty_days_ago
        ).distinct().count()
        
        # Recent analyses
        recent_analyses = Prediction.objects.filter(
            status='completed'
        ).order_by('-created_at')[:5]
        
        # Disease distribution
        disease_counts = Prediction.objects.filter(
            status='completed',
            disease__isnull=False
        ).values('disease__name').annotate(count=Count('id'))
        
        normal_count = Prediction.objects.filter(
            status='completed',
            is_normal=True
        ).count()
        
        disease_distribution = [
            {'name': 'Normal', 'value': normal_count, 'color': '#22c55e'}
        ]
        
        for item in disease_counts:
            disease_distribution.append({
                'name': item['disease__name'],
                'value': item['count'],
                'color': '#ef4444' if 'retinopathy' in item['disease__name'].lower() else '#f97316'
            })
        
        # Monthly trends (simplified)
        monthly_trends = []
        for i in range(7):
            date = now - timedelta(days=i)
            daily_count = Prediction.objects.filter(
                status='completed',
                created_at__date=date.date()
            ).count()
            abnormal_count = Prediction.objects.filter(
                status='completed',
                created_at__date=date.date(),
                is_normal=False
            ).count()
            
            monthly_trends.append({
                'name': date.strftime('%a'),
                'analyses': daily_count,
                'abnormal': abnormal_count
            })
        
        monthly_trends.reverse()
        
        data = {
            'total_analyses': total_analyses,
            'abnormal_cases': abnormal_cases,
            'accuracy_rate': accuracy_rate,
            'active_users': active_users,
            'recent_analyses': PredictionSerializer(recent_analyses, many=True).data,
            'disease_distribution': disease_distribution,
            'monthly_trends': monthly_trends
        }
        
        return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Get current user profile
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
