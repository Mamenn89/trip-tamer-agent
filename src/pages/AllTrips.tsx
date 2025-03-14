import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LoadingIndicator from '../components/LoadingIndicator';
import { TravelPlan, Hotel, Flight, DayPlan } from '../types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import Image from '@/components/ui/image';
import AnimatedBackground from '../components/AnimatedBackground';
import { formatDate } from '@/lib/utils';
import { googlePlacesService } from '../services/googlePlacesService';

// Define a type that matches the actual database column structure
interface DbTravelPlan {
  id: string;
  user_id: string;
  destination: string;
  source: string;
  start_date: string;
  end_date: string;
  duration: number;
  total_budget: number;
  summary: string;
  created_at?: string;
  updated_at?: string;
  hotels?: {
    name: string;
    address: string;
    price: number;
    imageUrl?: string;
    coordinates?: { lat: number; lng: number };
    rating?: number;
    description?: string;
  }[];
  flights?: {
    departureAirport: string;
    arrivalAirport: string;
    flightDuration: string;
    airplaneType?: string;
    airlineName?: string;
    airlineLogoUrl?: string;
    flightNumber?: string;
    flightTime?: string;
  }[];
  day_plans?: {
    date: string;
    places: {
      name: string;
      details: string | Record<string, unknown>;
      imageUrl?: string;
      coordinates?: { lat: number; lng: number };
      ticketPrice?: number;
      rating?: number;
      bestTimeToVisit?: string;
    }[];
  }[];
  tips?: string[];
}

interface DestinationImage {
  destination: string;
  imageUrl: string;
}

const AllTrips = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [travelPlans, setTravelPlans] = useState<DbTravelPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [destinationImages, setDestinationImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup any blob URLs
      Object.values(destinationImages).forEach(url => {
        if (url.startsWith('blob:')) {
          googlePlacesService.cleanupPhotoUrl(url);
        }
      });
    };
  }, [destinationImages]);

  // Fetch destination images for all travel plans
  const fetchDestinationImages = async (plans: DbTravelPlan[]) => {
    if (!plans || plans.length === 0) return;
    
    console.log('Fetching images for destinations');
    
    // Create initial loading state
    const initialLoadingState: Record<string, boolean> = {};
    plans.forEach(plan => {
      if (plan.destination) {
        initialLoadingState[plan.destination] = true;
      }
    });
    setLoadingImages(initialLoadingState);
    
    // Process each destination
    const uniqueDestinations = [...new Set(plans.map(p => p.destination))];
    const imagePromises = uniqueDestinations.map(async (destination) => {
      if (!destination) return null;
      
      try {
        console.log('Fetching photos for destination:', destination);
        const photos = await googlePlacesService.getPlacePhotos(destination);
        
        if (!photos || photos.length === 0) {
          console.log('No photos found for:', destination);
          return { destination, imageUrl: '/placeholder.svg' };
        }
        
        const firstPhoto = photos[0];
        return { destination, imageUrl: firstPhoto.url };
      } catch (error) {
        console.error(`Error fetching photo for ${destination}:`, error);
        return { destination, imageUrl: '/placeholder.svg' };
      }
    });
    
    // Wait for all image fetches to complete
    const results = (await Promise.all(imagePromises)).filter(Boolean) as DestinationImage[];
    
    // Update state with fetched images
    const newImages: Record<string, string> = {};
    const newLoadingState: Record<string, boolean> = {};
    
    results.forEach(result => {
      if (result.destination) {
        newImages[result.destination] = result.imageUrl;
        newLoadingState[result.destination] = false;
      }
    });
    
    console.log('Fetched destination images:', newImages);
    setDestinationImages(newImages);
    setLoadingImages(newLoadingState);
  };

  useEffect(() => {
    const fetchTravelPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!currentUser?.id) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        console.log('Fetching travel plans for user:', currentUser.id);

        // Fetch all travel plans for the current user from Supabase
        // Using user_id instead of userId to match the actual column name in the database
        const { data, error: supabaseError } = await supabase
          .from('travel_plans')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (supabaseError) {
          console.error('Supabase error details:', JSON.stringify(supabaseError, null, 2));
          throw new Error(supabaseError.message || 'Database error occurred');
        }

        console.log('Travel plans fetched:', data ? data.length : 0);
        
        if (data && data.length > 0) {
          const plans = data as DbTravelPlan[];
          setTravelPlans(plans);
          
          // Fetch destination images
          fetchDestinationImages(plans);
        } else {
          setTravelPlans([]);
        }
      } catch (err: unknown) {
        console.error('Error fetching travel plans:', err);
        
        // Better error handling with detailed message
        let errorMessage = 'Failed to fetch travel plans';
        
        if (err instanceof Error) {
          errorMessage = `Error: ${err.message}`;
        } else if (err && typeof err === 'object') {
          try {
            errorMessage = `Error: ${JSON.stringify(err)}`;
          } catch (e) {
            errorMessage = 'Unknown error object';
          }
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelPlans();
  }, [currentUser]);

  const handleViewTrip = (tripId: string) => {
    navigate(`/viewtrip/${tripId}`);
  };

  // Function to get image URL for a destination
  const getDestinationImageUrl = (destination: string): string => {
    if (!destination) return '/placeholder.svg';
    return destinationImages[destination] || '/placeholder.svg';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center flex-col p-4 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-700 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-4">Please try again or contact support if the problem persists.</p>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8 relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Travel Plans</h1>
        
        {travelPlans.length === 0 ? (
          <div className="text-center p-8 bg-white bg-opacity-80 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">No travel plans found</h2>
            <p className="text-gray-600 mb-6">You haven't created any travel plans yet.</p>
            <Button onClick={() => navigate('/planner')}>
              Create Your First Trip
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelPlans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white bg-opacity-90 flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <Image
                    src={getDestinationImageUrl(plan.destination)}
                    alt={plan.destination}
                    className="w-full h-full object-cover"
                    onError={() => console.log(`Failed to load image for ${plan.destination}`)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <h2 className="text-white text-xl font-bold px-4 pb-3">{plan.destination}</h2>
                  </div>
                </div>
                
                <CardContent className="flex-grow p-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>From: {plan.source}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{plan.duration || 0} days ({formatDate(plan.start_date)} - {formatDate(plan.end_date)})</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>Budget: ${plan.total_budget || 0}</span>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-gray-600 line-clamp-3">{plan.summary}</p>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full flex items-center justify-center" 
                    onClick={() => handleViewTrip(plan.id)}
                  >
                    View Trip Details <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default AllTrips;
