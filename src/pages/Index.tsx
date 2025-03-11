
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <Hero />
        
        <div className="max-w-4xl mx-auto my-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to plan your next adventure?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Create personalized travel itineraries tailored to your interests and budget.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <Button 
                className="px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg transition-colors shadow-sm"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Start Planning Now
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
