from rest_framework import serializers
from django.contrib.auth import get_user_model
from detection.models import Patient, RetinalImage, Prediction, Disease, MedicalHistory, AnalysisSession

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                 'medical_license', 'hospital_name', 'department', 'phone_number']
        read_only_fields = ['id']

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'patient_id', 'first_name', 'last_name', 'date_of_birth',
                 'gender', 'medical_record_number', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class RetinalImageSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    
    class Meta:
        model = RetinalImage
        fields = ['id', 'patient', 'patient_name', 'image', 'eye', 'image_quality',
                 'notes', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

class DiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disease
        fields = ['id', 'name', 'description', 'icd_code', 'severity_levels']

class PredictionSerializer(serializers.ModelSerializer):
    retinal_image_details = RetinalImageSerializer(source='retinal_image', read_only=True)
    disease_name = serializers.CharField(source='disease.name', read_only=True)
    patient_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Prediction
        fields = ['id', 'retinal_image', 'retinal_image_details', 'disease', 'disease_name',
                 'confidence_score', 'severity', 'is_normal', 'detected_features',
                 'risk_factors', 'recommendations', 'model_version', 'processing_time',
                 'status', 'error_message', 'created_at', 'reviewed_by', 'reviewed_at',
                 'is_confirmed', 'patient_name']
        read_only_fields = ['id', 'created_at', 'processing_time', 'model_version']
    
    def get_patient_name(self, obj):
        return f"{obj.retinal_image.patient.first_name} {obj.retinal_image.patient.last_name}"

class MedicalHistorySerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalHistory
        fields = ['id', 'patient', 'patient_name', 'has_diabetes', 'diabetes_duration',
                 'has_hypertension', 'has_glaucoma_family_history', 'smoking_status',
                 'current_medications', 'previous_eye_surgeries', 'previous_retinal_treatments',
                 'last_hba1c', 'last_blood_pressure_systolic', 'last_blood_pressure_diastolic',
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

class AnalysisSessionSerializer(serializers.ModelSerializer):
    total_images = serializers.ReadOnlyField()
    processed_images = serializers.ReadOnlyField()
    
    class Meta:
        model = AnalysisSession
        fields = ['id', 'name', 'description', 'created_at', 'total_images', 'processed_images']
        read_only_fields = ['id', 'created_at', 'total_images', 'processed_images']

class ImageAnalysisSerializer(serializers.Serializer):
    """
    Serializer for image analysis endpoint
    """
    image = serializers.ImageField()
    patient_id = serializers.CharField(required=False)
    eye = serializers.ChoiceField(choices=RetinalImage.EYE_CHOICES, default='left')
    image_quality = serializers.ChoiceField(choices=RetinalImage.IMAGE_QUALITY_CHOICES, default='good')
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate_image(self, value):
        # Validate image size
        if value.size > 10 * 1024 * 1024:  # 10MB
            raise serializers.ValidationError("Image file too large. Maximum size is 10MB.")
        
        # Validate image format
        allowed_formats = ['JPEG', 'JPG', 'PNG', 'BMP', 'TIFF']
        if hasattr(value, 'image') and value.image.format not in allowed_formats:
            raise serializers.ValidationError(f"Unsupported image format. Allowed formats: {', '.join(allowed_formats)}")
        
        return value

class DashboardStatsSerializer(serializers.Serializer):
    """
    Serializer for dashboard statistics
    """
    total_analyses = serializers.IntegerField()
    abnormal_cases = serializers.IntegerField()
    accuracy_rate = serializers.FloatField()
    active_users = serializers.IntegerField()
    recent_analyses = PredictionSerializer(many=True)
    disease_distribution = serializers.ListField()
    monthly_trends = serializers.ListField()