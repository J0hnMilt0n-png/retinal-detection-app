"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ImageUpload from "@/components/ImageUpload";
import Dashboard from "@/components/Dashboard";
import Results from "@/components/Results";

export default function Home() {
  const [currentView, setCurrentView] = useState("home");
  const [analysisResult, setAnalysisResult] = useState(null);

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "upload":
        return (
          <ImageUpload
            onAnalysisComplete={(result: any) => {
              setAnalysisResult(result);
              setCurrentView("results");
            }}
          />
        );
      case "results":
        return <Results result={analysisResult} />;
      default:
        return <Hero onNavigate={setCurrentView} />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
      <div className="pt-16">{renderCurrentView()}</div>
    </main>
  );
}
