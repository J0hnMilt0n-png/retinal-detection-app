"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Eye, AlertCircle, CheckCircle, Loader } from "lucide-react";

interface ImageUploadProps {
  onAnalysisComplete: (result: any) => void;
}

export default function ImageUpload({ onAnalysisComplete }: ImageUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Please upload a valid image file");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size must be less than 10MB");
        return;
      }

      setUploadError(null);
      setUploadedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".bmp", ".tiff"],
    },
    multiple: false,
  });

  const removeFile = () => {
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setUploadError(null);
  };

  const analyzeImage = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("image", uploadedFile);

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock result
      const mockResult = {
        prediction: "Diabetic Retinopathy Detected",
        confidence: 0.87,
        severity: "Moderate",
        recommendations: [
          "Consult with ophthalmologist within 2 weeks",
          "Monitor blood sugar levels closely",
          "Schedule follow-up examination in 3 months",
        ],
        detectedFeatures: [
          "Microaneurysms present",
          "Hard exudates detected",
          "Cotton wool spots identified",
        ],
        riskFactors: ["Diabetes", "Hypertension"],
        filename: uploadedFile.name,
        analysisDate: new Date().toISOString(),
      };

      onAnalysisComplete(mockResult);
    } catch (error) {
      setUploadError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Upload Retinal Image
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Upload a fundus photograph for AI-powered retinal disease analysis
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-xl font-medium text-gray-900 mb-2">
                {isDragActive
                  ? "Drop the image here"
                  : "Drag & drop an image here"}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                or click to select from your device
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, BMP, TIFF (Max size: 10MB)
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Uploaded retinal image"
                      className="w-full h-96 object-contain"
                    />
                  )}
                </div>
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Analysis Button */}
              <div className="flex space-x-4">
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Eye className="h-5 w-5 mr-2" />
                      Analyze Image
                    </>
                  )}
                </button>
                <button
                  onClick={removeFile}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Image Guidelines
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Use high-quality fundus photographs for best results</li>
            <li>• Ensure the image is well-lit and in focus</li>
            <li>• Center the optic disc and macula in the frame</li>
            <li>• Avoid images with excessive artifacts or poor quality</li>
            <li>• Patient consent should be obtained before analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
