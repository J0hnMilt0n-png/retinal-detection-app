"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Eye,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
} from "lucide-react";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock data
  const analysisData = [
    { name: "Mon", analyses: 12, abnormal: 3 },
    { name: "Tue", analyses: 19, abnormal: 5 },
    { name: "Wed", analyses: 15, abnormal: 2 },
    { name: "Thu", analyses: 22, abnormal: 7 },
    { name: "Fri", analyses: 18, abnormal: 4 },
    { name: "Sat", analyses: 8, abnormal: 1 },
    { name: "Sun", analyses: 11, abnormal: 2 },
  ];

  const diseaseDistribution = [
    { name: "Normal", value: 65, color: "#22c55e" },
    { name: "Diabetic Retinopathy", value: 20, color: "#ef4444" },
    { name: "Glaucoma", value: 10, color: "#f97316" },
    { name: "AMD", value: 5, color: "#eab308" },
  ];

  const recentAnalyses = [
    {
      id: 1,
      patientId: "P001",
      diagnosis: "Diabetic Retinopathy - Moderate",
      confidence: 0.87,
      date: "2024-01-15",
      status: "abnormal",
    },
    {
      id: 2,
      patientId: "P002",
      diagnosis: "Normal",
      confidence: 0.95,
      date: "2024-01-15",
      status: "normal",
    },
    {
      id: 3,
      patientId: "P003",
      diagnosis: "Glaucoma Suspect",
      confidence: 0.73,
      date: "2024-01-14",
      status: "abnormal",
    },
    {
      id: 4,
      patientId: "P004",
      diagnosis: "Normal",
      confidence: 0.92,
      date: "2024-01-14",
      status: "normal",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Overview of retinal disease detection analytics and recent analyses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Analyses
                </h3>
                <p className="text-3xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-gray-500">+12% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Abnormal Cases
                </h3>
                <p className="text-3xl font-bold text-red-600">287</p>
                <p className="text-sm text-gray-500">23% detection rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Accuracy Rate
                </h3>
                <p className="text-3xl font-bold text-green-600">94.2%</p>
                <p className="text-sm text-gray-500">+0.8% improvement</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Active Users
                </h3>
                <p className="text-3xl font-bold text-purple-600">156</p>
                <p className="text-sm text-gray-500">Healthcare providers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Analysis Trends */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Analysis Trends
              </h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analysisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="analyses" fill="#3b82f6" name="Total Analyses" />
                <Bar dataKey="abnormal" fill="#ef4444" name="Abnormal Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Disease Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Disease Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diseaseDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {diseaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Analyses
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diagnosis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {analysis.patientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {analysis.diagnosis}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`font-medium ${
                          analysis.confidence >= 0.9
                            ? "text-green-600"
                            : analysis.confidence >= 0.7
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {(analysis.confidence * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(analysis.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          analysis.status === "normal"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {analysis.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All Analyses →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
