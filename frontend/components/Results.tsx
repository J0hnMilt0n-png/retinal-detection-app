"use client";

import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Calendar,
  User,
  FileText,
  Download,
} from "lucide-react";

interface ResultsProps {
  result: any;
}

export default function Results({ result }: ResultsProps) {
  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">No analysis results available</p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "mild":
        return "text-yellow-600 bg-yellow-100";
      case "moderate":
        return "text-orange-600 bg-orange-100";
      case "severe":
        return "text-red-600 bg-red-100";
      case "proliferative":
        return "text-red-700 bg-red-200";
      default:
        return "text-green-600 bg-green-100";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600";
    if (confidence >= 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Analysis Results
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            AI-powered retinal disease detection results
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Diagnosis */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Primary Diagnosis
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900">
                    {result.prediction}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                      result.severity
                    )}`}
                  >
                    {result.severity}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <span
                    className={`font-semibold ${getConfidenceColor(
                      result.confidence
                    )}`}
                  >
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                    <div
                      className={`h-2 rounded-full ${
                        result.confidence >= 0.9
                          ? "bg-green-500"
                          : result.confidence >= 0.7
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detected Features */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detected Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.detectedFeatures?.map(
                  (feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-red-50 rounded-lg"
                    >
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-red-800">{feature}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Clinical Recommendations
              </h3>
              <div className="space-y-3">
                {result.recommendations?.map(
                  (recommendation: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start p-3 bg-blue-50 rounded-lg"
                    >
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-blue-800">
                        {recommendation}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Risk Factors */}
            {result.riskFactors && result.riskFactors.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Associated Risk Factors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.riskFactors.map((risk: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                    >
                      {risk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analysis Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Analysis Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">File:</span>
                  <span className="text-sm font-medium text-gray-900 ml-1 truncate">
                    {result.filename}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium text-gray-900 ml-1">
                    {new Date(result.analysisDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Analyst:</span>
                  <span className="text-sm font-medium text-gray-900 ml-1">
                    AI System v2.1
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  <FileText className="h-4 w-4 mr-2" />
                  Save to Records
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  <User className="h-4 w-4 mr-2" />
                  Share with Doctor
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    Important Notice
                  </h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    This analysis is for screening purposes only and should not
                    replace professional medical diagnosis. Please consult with
                    a qualified ophthalmologist for proper evaluation and
                    treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
