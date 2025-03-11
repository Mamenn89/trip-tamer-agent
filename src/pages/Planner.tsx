
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import LoadingIndicator from '../components/LoadingIndicator';
import PlannerForm from '../components/PlannerForm';
import TravelPlanComponent from '../components/TravelPlan';
import { TravelFormData, TravelPlan } from '../types';
import { useGenerateAITravelPlan } from '../hooks/useGenerateAITravelPlan';
import { useState } from 'react';

const Planner = () => {
  const { currentUser } = useAuth();
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const { generatePlan, loading, error } = useGenerateAITravelPlan();

  const handleSubmit = async (formData: TravelFormData) => {
    try {
      const plan = await generatePlan(formData);
      setTravelPlan(plan);
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Error generating travel plan:', err);
    }
  };

  const handleStartOver = () => {
    setTravelPlan(null);
    // Scroll back to the top or to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Plan Your Journey</h1>
          <p className="text-gray-600 mt-2">Welcome, {currentUser?.email?.split('@')[0] || 'Traveler'}! Create your perfect travel itinerary.</p>
        </div>
        
        <div className="max-w-4xl mx-auto my-12">
          <PlannerForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {loading && (
          <div className="my-12 text-center">
            <LoadingIndicator />
            <p className="mt-4 text-lg text-gray-600">
              Crafting your perfect travel plan...
            </p>
          </div>
        )}

        {error && (
          <div className="my-12 p-6 bg-red-50 rounded-lg border border-red-100 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600">{error}</p>
            <p className="mt-2 text-sm text-red-500">Please try again with different parameters</p>
          </div>
        )}

        {travelPlan && !loading && (
          <div id="results" className="my-12 scroll-mt-24">
            <TravelPlanComponent plan={travelPlan} onStartOver={handleStartOver} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Planner;
