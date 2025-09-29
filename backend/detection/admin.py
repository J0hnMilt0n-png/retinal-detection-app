from django.contrib import admin
from .models import Patient, RetinalImage, Disease, Prediction, MedicalHistory, AnalysisSession

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('patient_id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'created_at')
    list_filter = ('gender', 'created_at')
    search_fields = ('patient_id', 'first_name', 'last_name', 'medical_record_number')
    ordering = ('-created_at',)

@admin.register(RetinalImage)
class RetinalImageAdmin(admin.ModelAdmin):
    list_display = ('patient', 'eye', 'image_quality', 'uploaded_by', 'uploaded_at')
    list_filter = ('eye', 'image_quality', 'uploaded_at')
    search_fields = ('patient__first_name', 'patient__last_name', 'patient__patient_id')
    ordering = ('-uploaded_at',)

@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    list_display = ('name', 'icd_code')
    search_fields = ('name', 'icd_code')

@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ('retinal_image', 'disease', 'confidence_score', 'severity', 'is_normal', 'status', 'created_at')
    list_filter = ('disease', 'is_normal', 'status', 'is_confirmed', 'created_at')
    search_fields = ('retinal_image__patient__first_name', 'retinal_image__patient__last_name')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at', 'processing_time')

@admin.register(MedicalHistory)
class MedicalHistoryAdmin(admin.ModelAdmin):
    list_display = ('patient', 'has_diabetes', 'has_hypertension', 'has_glaucoma_family_history', 'updated_at')
    list_filter = ('has_diabetes', 'has_hypertension', 'has_glaucoma_family_history', 'smoking_status')
    search_fields = ('patient__first_name', 'patient__last_name', 'patient__patient_id')

@admin.register(AnalysisSession)
class AnalysisSessionAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'total_images', 'processed_images', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
