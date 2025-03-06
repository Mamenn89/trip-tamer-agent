
import React from 'react';
import { ArrowRight, Globe, Calendar, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="animate-reveal" style={{ animationDelay: '0.1s' }}>
            <div className="inline-block bg-blue-50 rounded-full px-3 py-1 text-sm font-medium text-blue-600 mb-6">
              AI-Powered Travel Planning
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Your journey begins with a simple question
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Tell us where you want to go, and our AI assistant will craft the perfect travel plan tailored to your interests, budget, and schedule.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/planner" 
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors group"
              >
                <span>Start Planning</span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a 
                href="#how-it-works" 
                className="flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
              >
                Learn How It Works
              </a>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-elevation animate-reveal" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/90 to-indigo-500/90"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-blue-300/30"></div>
              <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 w-32 h-32 rounded-full bg-indigo-300/30"></div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-white text-center">
                <Globe className="w-16 h-16 mb-6 animate-float" />
                <h3 className="text-2xl font-bold mb-4">Discover Your Next Adventure</h3>
                <p className="text-white/80 max-w-xs mb-8">
                  Let our AI assistant help you plan the perfect trip tailored to your preferences.
                </p>
                <Link 
                  to="/planner" 
                  className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Create Your Plan
                </Link>
              </div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -bottom-6 -left-6 w-48 glass-card rounded-lg p-4 shadow-elevation animate-reveal" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">Trip Planner</span>
              </div>
              <p className="text-sm text-gray-600">Custom itineraries based on your preferences</p>
            </div>
            
            <div className="absolute -top-6 -right-6 w-48 glass-card rounded-lg p-4 shadow-elevation animate-reveal" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100">
                  <Compass className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="font-medium">AI Guide</span>
              </div>
              <p className="text-sm text-gray-600">Personalized recommendations for your journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
