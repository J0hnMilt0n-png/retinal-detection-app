import os
import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator

User = get_user_model()

def retinal_image_path(instance, filename):
    """Generate file path for retinal images"""
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('retinal_images', filename)

class Patient(models.Model):
    """
    Patient model to store patient information
    """
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    patient_id = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    medical_record_number = models.CharField(max_length=100, unique=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.patient_id})"

class RetinalImage(models.Model):
    """
    Model to store retinal fundus images
    """
    EYE_CHOICES = [
        ('left', 'Left Eye'),
        ('right', 'Right Eye'),
        ('both', 'Both Eyes'),
    ]
    
    IMAGE_QUALITY_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='retinal_images')
    image = models.ImageField(
        upload_to=retinal_image_path,
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png', 'bmp', 'tiff'])]
    )
    eye = models.CharField(max_length=10, choices=EYE_CHOICES)
    image_quality = models.CharField(max_length=20, choices=IMAGE_QUALITY_CHOICES)
    notes = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"Retinal Image - {self.patient.patient_id} ({self.eye})"

class Disease(models.Model):
    """
    Model to store different retinal diseases
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icd_code = models.CharField(max_length=20, blank=True)
    severity_levels = models.JSONField(default=list)  # e.g., ["Mild", "Moderate", "Severe"]
    
    def __str__(self):
        return self.name

class Prediction(models.Model):
    """
    Model to store AI prediction results
    """
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    retinal_image = models.OneToOneField(RetinalImage, on_delete=models.CASCADE)
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE, null=True, blank=True)
    confidence_score = models.FloatField(null=True, blank=True)
    severity = models.CharField(max_length=50, blank=True)
    is_normal = models.BooleanField(default=False)
    
    # Detailed results
    detected_features = models.JSONField(default=list)
    risk_factors = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    
    # Processing info
    model_version = models.CharField(max_length=50, default='v1.0')
    processing_time = models.FloatField(null=True, blank=True)  # in seconds
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    error_message = models.TextField(blank=True)
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='reviewed_predictions'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    is_confirmed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        status = "Normal" if self.is_normal else f"{self.disease.name} ({self.confidence_score:.2%})"
        return f"Prediction - {self.retinal_image.patient.patient_id}: {status}"

class MedicalHistory(models.Model):
    """
    Model to store patient medical history relevant to retinal diseases
    """
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_history')
    
    # Risk factors
    has_diabetes = models.BooleanField(default=False)
    diabetes_duration = models.IntegerField(null=True, blank=True)  # in years
    has_hypertension = models.BooleanField(default=False)
    has_glaucoma_family_history = models.BooleanField(default=False)
    smoking_status = models.CharField(
        max_length=20,
        choices=[
            ('never', 'Never'),
            ('former', 'Former'),
            ('current', 'Current'),
        ],
        default='never'
    )
    
    # Current medications
    current_medications = models.JSONField(default=list)
    
    # Previous eye conditions
    previous_eye_surgeries = models.TextField(blank=True)
    previous_retinal_treatments = models.TextField(blank=True)
    
    # Vital signs
    last_hba1c = models.FloatField(null=True, blank=True)
    last_blood_pressure_systolic = models.IntegerField(null=True, blank=True)
    last_blood_pressure_diastolic = models.IntegerField(null=True, blank=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Medical histories"
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Medical History - {self.patient.patient_id}"

class AnalysisSession(models.Model):
    """
    Model to track analysis sessions for batch processing
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Session: {self.name}"
    
    @property
    def total_images(self):
        return self.retinal_images.count()
    
    @property
    def processed_images(self):
        return self.retinal_images.filter(prediction__status='completed').count()
