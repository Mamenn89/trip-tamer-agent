
import React, { useState } from 'react';
import { TravelFormData, TravelPlanData } from '../types';
import { useGenerateAITravelPlan } from '../hooks/useGenerateAITravelPlan';
import AnimatedBackground from '../components/AnimatedBackground';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import LoadingIndicator from '../components/LoadingIndicator';
import PlannerForm from '../components/PlannerForm';
import TravelPlan from '../components/TravelPlan';
import ApiKeyInput from '../components/ApiKeyInput';
import { AlertCircle } from 'lucide-react';

const Index = () => {
  const [travelPlan, setTravelPlan] = useState<TravelPlanData | null>(null);
  const { generatePlan, loading, error } = useGenerateAITravelPlan();
  const [networkError, setNetworkError] = useState<string | null>(null);

  const handleSubmit = async (formData: TravelFormData) => {
    try {
      setNetworkError(null);
      setTravelPlan(null); // Reset any previous travel plan
      
      const plan = await generatePlan(formData);
      
      // Add flight suggestion data
      const planWithFlights = {
        ...plan,
        flightSuggestions: {
          source: formData.source,
          destination: plan.destination,
          date: formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }) : 'flexible'
        }
      };
      
      setTravelPlan(planWithFlights);
      
      // Check if we got mock data due to an error
      if (typeof plan.overview === 'string' && plan.overview.includes('⚠️ NOTE: This is MOCK DATA')) {
        setNetworkError('API connection error: You are seeing sample data because we could not connect to the DeepSeek API.');
      }
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Error generating travel plan:', err);
      // Ensure the loading state is reset in case of error
      setNetworkError('Failed to generate travel plan. Please try again.');
    }
  };

  const handleStartOver = () => {
    setTravelPlan(null);
    setNetworkError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <Hero />
        
        <div className="max-w-4xl mx-auto my-8">
          <ApiKeyInput />
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

        {networkError && (
          <div className="my-6 p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">API Connection Issue</h3>
              <p className="text-amber-700 text-sm mt-1">{networkError}</p>
              <p className="text-xs text-amber-600 mt-2">
                This is likely due to CORS restrictions when accessing the API directly from a browser. 
                You are viewing mock sample data instead of your actual request.
              </p>
            </div>
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
            <TravelPlan plan={travelPlan} onStartOver={handleStartOver} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
