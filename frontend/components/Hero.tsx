"use client";

import { ArrowRight, Eye, Shield, Zap, Users } from "lucide-react";

interface HeroProps {
  onNavigate: (view: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const features = [
    {
      icon: Eye,
      title: "AI-Powered Detection",
      description:
        "Advanced deep learning models for accurate retinal disease detection",
    },
    {
      icon: Shield,
      title: "Early Diagnosis",
      description: "Detect diseases in early stages to prevent vision loss",
    },
    {
      icon: Zap,
      title: "Fast Analysis",
      description: "Get results in seconds with our optimized AI algorithms",
    },
    {
      icon: Users,
      title: "Clinical Support",
      description: "Assist healthcare providers with automated screening tools",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Retinal Disease</span>{" "}
                  <span className="block text-primary-600 xl:inline">
                    Detection System
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Advanced AI-powered platform for early detection and analysis
                  of retinal diseases including diabetic retinopathy, glaucoma,
                  and macular degeneration. Supporting healthcare providers with
                  accurate, fast, and reliable diagnostic assistance.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => onNavigate("upload")}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Start Analysis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => onNavigate("dashboard")}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      View Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-primary-400 to-primary-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-center text-white">
              <Eye className="h-24 w-24 mx-auto mb-4 opacity-80" />
              <p className="text-lg font-medium">Advanced Retinal Analysis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Advanced AI-Driven Healthcare
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform combines cutting-edge deep learning with clinical
              expertise to deliver accurate and reliable retinal disease
              detection.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="relative">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      {feature.title}
                    </p>
                    <p className="mt-2 ml-16 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-primary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by Healthcare Professionals
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Our AI models have been trained on thousands of retinal images for
              maximum accuracy
            </p>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600">95%+</div>
                <div className="mt-2 text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Accuracy Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600">10K+</div>
                <div className="mt-2 text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Images Analyzed
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600">500+</div>
                <div className="mt-2 text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Healthcare Providers
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600">3</div>
                <div className="mt-2 text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Disease Types
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
