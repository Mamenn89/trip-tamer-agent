import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LoadingIndicator from '../components/LoadingIndicator';
import { TravelPlan, Activity } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, DollarSign, Users, Plane, Hotel, Clock, Navigation, Star } from 'lucide-react';
import Image from '@/components/ui/image';
import { ActivityCard } from '../components/ActivityCard';
import { googlePlacesService } from '../services/googlePlacesService';

interface Photo {
  url: string;
  width: number;
  height: number;
  html_attributions: string[];
}

// Types for activities and images
interface Activity {
  place_name: string;
  place_details: string;
  place_image_url: string;
  ticket_price: number;
  best_time_to_visit: string;
  rating?: number;
}

interface ActivityImage {
  activityName: string;
  timeOfDay: string;
  dayIndex: number;
  url: string;
}

interface TravelPlan {
  id: string;
  userId: string;
  destination: string;
  source: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalBudget: number;
  summary: string;
  hotels?: any[];
  flights?: any[];
  dayPlans?: any[];
  tips?: string[];
}

const ViewTrip = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loadingHeroImage, setLoadingHeroImage] = useState<boolean>(true);
  const [activityImages, setActivityImages] = useState<ActivityImage[]>([]);
  const [hotelImages, setHotelImages] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  // Function to fetch destination photos from Google Places API
  const fetchDestinationPhotos = async (destination: string) => {
    try {
      setLoadingHeroImage(true);
      const photos = await googlePlacesService.searchPhotos(destination);
      
      if (photos && photos.length > 0) {
        setHeroImage(photos[0].url);
      } else {
        // Set a default image if no photos are found
        setHeroImage('/placeholders/destination.jpg');
      }
    } catch (error) {
      console.error('Error fetching destination photos:', error);
      // Set a default image on error
      setHeroImage('/placeholders/destination.jpg');
    } finally {
      setLoadingHeroImage(false);
    }
  };

  // Function to fetch hotel photos from Google Places API
  const fetchHotelPhotos = async (hotels: any[]) => {
    if (!hotels || hotels.length === 0) return;

    const hotelImagesMap: Record<string, string> = {};

    try {
      // Fetch photos for each hotel in parallel
      await Promise.all(
        hotels.map(async (hotel) => {
          if (!hotel.name) return;

          try {
            const photos = await googlePlacesService.searchPhotos(hotel.name);
            
            if (photos && photos.length > 0) {
              hotelImagesMap[hotel.name] = photos[0].url;
            } else {
              // Set a default image if no photos are found
              hotelImagesMap[hotel.name] = '/placeholders/hotel.jpg';
            }
          } catch (error) {
            console.error(`Error fetching photos for hotel ${hotel.name}:`, error);
            // Set a default image on error
            hotelImagesMap[hotel.name] = '/placeholders/hotel.jpg';
          }
        })
      );

      setHotelImages(hotelImagesMap);
    } catch (error) {
      console.error('Error fetching hotel photos:', error);
    }
  };

  // Function to fetch activity images from Google Places API
  const fetchActivityImages = async (dayPlans: any[]) => {
    if (!dayPlans || dayPlans.length === 0) return;

    const activityImagesArray: ActivityImage[] = [];

    try {
      // Process each day's activities
      for (let dayIndex = 0; dayIndex < dayPlans.length; dayIndex++) {
        const day = dayPlans[dayIndex];
        
        if (!day.places || day.places.length === 0) continue;

        // Process each place in the day plan
        for (const place of day.places) {
          // Handle different data structures (nested vs. flat)
          let details: any;
          
          if (typeof place.details === 'object') {
            details = place.details;
          } else {
            details = place; // Flat structure
          }

          // Process each time slot in the place
          const timeSlots = ['early_morning', 'morning', 'afternoon', 'evening', 'night'];
          
          for (const slot of timeSlots) {
            const activity = details[slot];
            
            if (!activity || !activity.place_name) continue;

            try {
              const photos = await googlePlacesService.searchPhotos(activity.place_name);
              
              if (photos && photos.length > 0) {
                activityImagesArray.push({
                  activityName: activity.place_name,
                  timeOfDay: slot,
                  dayIndex,
                  url: photos[0].url
                });
              } else {
                // Set a default image if no photos are found
                activityImagesArray.push({
                  activityName: activity.place_name,
                  timeOfDay: slot,
                  dayIndex,
                  url: '/placeholders/activity.jpg'
                });
              }
            } catch (error) {
              console.error(`Error fetching photos for activity ${activity.place_name}:`, error);
              // Set a default image on error
              activityImagesArray.push({
                activityName: activity.place_name,
                timeOfDay: slot,
                dayIndex,
                url: '/placeholders/activity.jpg'
              });
            }
          }
        }
      }

      setActivityImages(activityImagesArray);
    } catch (error) {
      console.error('Error fetching activity images:', error);
    }
  };

  // Helper function to get activity image URL
  const getActivityImageUrl = (activityName: string, timeOfDay: string, dayIndex: number) => {
    const image = activityImages.find(
      img => img.activityName === activityName && img.timeOfDay === timeOfDay && img.dayIndex === dayIndex
    );
    
    return image ? image.url : '/placeholders/activity.jpg';
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setLoading(true);
        
        if (!id || !currentUser) {
          setError('Trip ID or user information not available');
          setLoading(false);
          return;
        }

        // Fetch travel plan from Supabase
        const { data, error: supabaseError } = await supabase
          .from('travel_plans')
          .select('*')
          .eq('id', id)
          .single();

        if (supabaseError) {
          console.error('Error fetching travel plan:', supabaseError);
          setError('Failed to load travel plan details');
          setLoading(false);
          return;
        }

        if (!data) {
          setError('Travel plan not found');
          setLoading(false);
          return;
        }

        // Check if the travel plan belongs to the current user
        if (data.user_id !== currentUser.id) {
          setError('You do not have permission to view this travel plan');
          setLoading(false);
          return;
        }

        // Parse JSON fields if they're stored as strings
        let parsedData = {
          ...data,
          hotels: typeof data.hotels === 'string' ? JSON.parse(data.hotels) : data.hotels,
          flights: typeof data.flights === 'string' ? JSON.parse(data.flights) : data.flights,
          dayPlans: typeof data.day_plans === 'string' ? JSON.parse(data.day_plans) : data.day_plans,
          tips: typeof data.tips === 'string' ? JSON.parse(data.tips) : data.tips,
        };

        // Format and normalize data
        const formattedTravelPlan: TravelPlan = {
          id: parsedData.id,
          userId: parsedData.user_id,
          destination: parsedData.destination,
          source: parsedData.source,
          startDate: parsedData.start_date,
          endDate: parsedData.end_date,
          duration: parsedData.duration,
          totalBudget: parsedData.total_budget,
          summary: parsedData.summary,
          hotels: parsedData.hotels || [],
          flights: parsedData.flights || [],
          dayPlans: parsedData.dayPlans || [],
          tips: parsedData.tips || [],
        };

        setTravelPlan(formattedTravelPlan);

        // Fetch destination photos
        await fetchDestinationPhotos(formattedTravelPlan.destination);

        // Fetch hotel photos
        await fetchHotelPhotos(formattedTravelPlan.hotels);

        // Fetch activity images
        await fetchActivityImages(formattedTravelPlan.dayPlans);

      } catch (error) {
        console.error('Error in fetchTripDetails:', error);
        setError('An unexpected error occurred while loading trip details');
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.history.back()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!travelPlan) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Travel plan not found</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <NavBar />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="relative h-[400px] rounded-lg overflow-hidden mb-12">
          {loadingHeroImage ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <LoadingIndicator />
            </div>
          ) : (
            <Image
              src={heroImage || '/placeholders/destination.jpg'}
              alt={travelPlan.destination}
              className="w-full h-full object-cover"
              width={1920}
              height={400}
            />
          )}
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white p-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              {travelPlan.destination}
            </h1>
            <p className="text-xl max-w-2xl text-center">
              {travelPlan.summary}
            </p>
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="mr-4 h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">{travelPlan.source}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="mr-4 h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{travelPlan.duration} Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="mr-4 h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">${travelPlan.totalBudget}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="mr-4 h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Travellers</p>
                  <p className="font-medium">Not specified</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotel Recommendations */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Hotel Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {travelPlan.hotels?.map((hotel, index) => (
              <Card key={index} className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="relative h-48">
                  <Image
                    src={hotelImages[hotel.name] || '/placeholders/hotel.jpg'}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    width={400}
                    height={200}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{hotel.name}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <p className="text-sm">{hotel.rating || 'N/A'}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{hotel.location || 'Location not specified'}</p>
                  <p className="font-medium">${hotel.price_per_night}/night</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Flight Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Flight Information</h2>
          <div className="grid grid-cols-1 gap-6">
            {travelPlan.flights?.map((flight, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center flex-wrap">
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-muted-foreground">Airline</p>
                      <p className="font-medium">{flight.airline}</p>
                    </div>
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-muted-foreground">Flight Number</p>
                      <p className="font-medium">{flight.flight_number || 'N/A'}</p>
                    </div>
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-muted-foreground">Departure</p>
                      <p className="font-medium">{flight.departure_time || 'N/A'}</p>
                    </div>
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-muted-foreground">Arrival</p>
                      <p className="font-medium">{flight.arrival_time || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">${flight.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Daily Activities */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Activities</h2>
          <div className="space-y-8">
            {travelPlan.dayPlans?.map((day, dayIndex) => (
              <div key={dayIndex}>
                <h3 className="font-medium mb-4">Day {dayIndex + 1} - {day.date}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {day.places?.map((place, placeIndex) => {
                    // Type guard to check if details is an object
                    const details = typeof place.details === 'object' ? place.details : null;
                    
                    // Handle both nested and flat data structures
                    const earlyMorningActivity = details?.early_morning || place.early_morning;
                    const morningActivity = details?.morning || place.morning;
                    const afternoonActivity = details?.afternoon || place.afternoon;
                    const eveningActivity = details?.evening || place.evening;
                    const nightActivity = details?.night || place.night;
                    
                    // If we have time-based activities, render those
                    if (earlyMorningActivity || morningActivity || afternoonActivity || eveningActivity || nightActivity) {
                      return (
                        <div key={placeIndex} className="contents">
                          {earlyMorningActivity && (
                            <Card className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer">
                              <div className="flex min-h-[12rem]">
                                <div className="w-1/3 relative">
                                  <Image
                                    src={getActivityImageUrl(earlyMorningActivity.place_name, 'early_morning', dayIndex)}
                                    alt={earlyMorningActivity.place_name}
                                    className="h-full w-full object-cover"
                                    width={200}
                                    height={200}
                                  />
                                  <div className="absolute top-0 left-0 bg-primary text-white px-2 py-1 text-xs">
                                    Early Morning
                                  </div>
                                </div>
                                <div className="w-2/3 p-4">
                                  <h4 className="font-semibold text-base mb-1">{earlyMorningActivity.place_name}</h4>
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                                    {earlyMorningActivity.place_details}
                                  </p>
                                  <div className="flex items-center text-sm">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    <span className="mr-3">${earlyMorningActivity.ticket_price || 'Free'}</span>
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{earlyMorningActivity.best_time_to_visit || 'Early Morning'}</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          )}
                          
                          {morningActivity && (
                            <Card className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer">
                              <div className="flex min-h-[12rem]">
                                <div className="w-1/3 relative">
                                  <Image
                                    src={getActivityImageUrl(morningActivity.place_name, 'morning', dayIndex)}
                                    alt={morningActivity.place_name}
                                    className="h-full w-full object-cover"
                                    width={200}
                                    height={200}
                                  />
                                  <div className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 text-xs">
                                    Morning
                                  </div>
                                </div>
                                <div className="w-2/3 p-4">
                                  <h4 className="font-semibold text-base mb-1">{morningActivity.place_name}</h4>
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                                    {morningActivity.place_details}
                                  </p>
                                  <div className="flex items-center text-sm">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    <span className="mr-3">${morningActivity.ticket_price || 'Free'}</span>
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{morningActivity.best_time_to_visit || 'Morning'}</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          )}
                          
                          {afternoonActivity && (
                            <Card className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer">
                              <div className="flex min-h-[12rem]">
                                <div className="w-1/3 relative">
                                  <Image
                                    src={getActivityImageUrl(afternoonActivity.place_name, 'afternoon', dayIndex)}
                                    alt={afternoonActivity.place_name}
                                    className="h-full w-full object-cover"
                                    width={200}
                                    height={200}
                                  />
                                  <div className="absolute top-0 left-0 bg-orange-500 text-white px-2 py-1 text-xs">
                                    Afternoon
                                  </div>
                                </div>
                                <div className="w-2/3 p-4">
                                  <h4 className="font-semibold text-base mb-1">{afternoonActivity.place_name}</h4>
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                                    {afternoonActivity.place_details}
                                  </p>
                                  <div className="flex items-center text-sm">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    <span className="mr-3">${afternoonActivity.ticket_price || 'Free'}</span>
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{afternoonActivity.best_time_to_visit || 'Afternoon'}</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          )}
                          
                          {eveningActivity && (
                            <Card className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer">
                              <div className="flex min-h-[12rem]">
                                <div className="w-1/3 relative">
                                  <Image
                                    src={getActivityImageUrl(eveningActivity.place_name, 'evening', dayIndex)}
                                    alt={eveningActivity.place_name}
                                    className="h-full w-full object-cover"
                                    width={200}
                                    height={200}
                                  />
                                  <div className="absolute top-0 left-0 bg-purple-500 text-white px-2 py-1 text-xs">
                                    Evening
                                  </div>
                                </div>
                                <div className="w-2/3 p-4">
                                  <h4 className="font-semibold text-base mb-1">{eveningActivity.place_name}</h4>
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                                    {eveningActivity.place_details}
                                  </p>
                                  <div className="flex items-center text-sm">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    <span className="mr-3">${eveningActivity.ticket_price || 'Free'}</span>
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{eveningActivity.best_time_to_visit || 'Evening'}</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          )}
                          
                          {nightActivity && (
                            <Card className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer">
                              <div className="flex min-h-[12rem]">
                                <div className="w-1/3 relative">
                                  <Image
                                    src={getActivityImageUrl(nightActivity.place_name, 'night', dayIndex)}
                                    alt={nightActivity.place_name}
                                    className="h-full w-full object-cover"
                                    width={200}
                                    height={200}
                                  />
                                  <div className="absolute top-0 left-0 bg-indigo-800 text-white px-2 py-1 text-xs">
                                    Night
                                  </div>
                                </div>
                                <div className="w-2/3 p-4">
                                  <h4 className="font-semibold text-base mb-1">{nightActivity.place_name}</h4>
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                                    {nightActivity.place_details}
                                  </p>
                                  <div className="flex items-center text-sm">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    <span className="mr-3">${nightActivity.ticket_price || 'Free'}</span>
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{nightActivity.best_time_to_visit || 'Night'}</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          )}
                        </div>
                      );
                    }
                    
                    // Otherwise, render the regular place card
                    return (
                      <Card key={placeIndex}>
                        <CardContent className="p-4">
                          <h4 className="font-semibold">{place.name || 'Activity'}</h4>
                          <p className="text-sm text-gray-600 mt-2">
                            {place.description || 'No description available'}
                          </p>
                          {place.time && (
                            <div className="flex items-center mt-2 text-sm">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{place.time}</span>
                            </div>
                          )}
                          {place.location && (
                            <div className="flex items-center mt-1 text-sm">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{place.location}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Tips */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Travel Tips</h2>
          <Card>
            <CardContent className="p-6">
              <ul className="list-disc pl-5 space-y-2">
                {travelPlan.tips?.map((tip, index) => (
                  <li key={index} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ViewTrip;
