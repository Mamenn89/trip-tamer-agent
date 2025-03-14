import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LoadingIndicator from '../components/LoadingIndicator';
import PlannerForm from '../components/PlannerForm';
import TravelPlanMarkdown from '../components/TravelPlanMarkdown';
import { TravelFormData, TravelPlan } from '../types';
import { useGenerateAITravelPlan } from '../hooks/useGenerateAITravelPlan';
import { saveTravelPlan } from '../services/supabaseService';

const Planner = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const { generatePlan, loading, error } = useGenerateAITravelPlan();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Log component mount and initial state
    console.log('Planner component mounted', {
      isAuthenticated: !!currentUser,
      hasError: !!error,
      isLoading: loading
    });
  }, []);

  const handleSubmit = async (formData: TravelFormData) => {
    try {
      console.log('Form submitted with data:', formData);
      setFormError(null);
      
      if (!formData.destination || !formData.source) {
        setFormError('Please fill in all required fields');
        return;
      }

      // Add userId to formData
      const formDataWithUser = {
        ...formData,
        userId: currentUser?.id
      };

      console.log('Submitting plan with user data:', { userId: currentUser?.id });
      const plan = await generatePlan(formDataWithUser);
      console.log('Travel plan generated:', plan);
      setTravelPlan(plan);

      // Save to Supabase and navigate to view trip page
      if (currentUser?.id) {
        try {
          const savedData = await saveTravelPlan(currentUser.id, plan);
          if (savedData && savedData[0]?.id) {
            // Navigate to the view trip page
            navigate(`/viewtrip/${savedData[0].id}`);
          }
        } catch (dbError) {
          console.error('Failed to save travel plan to database:', dbError);
          setFormError('Failed to save travel plan. Please try again.');
        }
      }
      
      // Scroll to results if navigation fails
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.warn('Results element not found');
        }
      }, 100);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setFormError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleStartOver = () => {
    setTravelPlan(null);
    setFormError(null);
    // Scroll back to the top or to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600">You need to be signed in to access the travel planner.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <NavBar />

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Plan Your Journey</h1>
          <p className="text-gray-600 mt-2">
            Welcome, {currentUser?.email?.split('@')[0] || 'Traveler'}! Create your perfect travel itinerary.
          </p>
        </div>
        
        {!travelPlan && (
          <div className="max-w-4xl mx-auto my-12">
            {formError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{formError}</p>
              </div>
            )}
            
            <PlannerForm onSubmit={handleSubmit} loading={loading} />
          </div>
        )}

        {loading && (
          <div className="my-12 text-center">
            <LoadingIndicator />
            <p className="mt-4 text-lg text-gray-600">
              Crafting your perfect travel plan...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="my-12 p-6 bg-red-50 rounded-lg border border-red-100 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={handleStartOver}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {travelPlan && !loading && !error && (
          <div id="results" className="my-12 scroll-mt-24">
            <TravelPlanMarkdown plan={travelPlan} onStartOver={handleStartOver} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Planner;
