
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, DollarSign, Plane, Hotel, Info, Download, Share2 } from 'lucide-react';
import { TravelPlan as TravelPlanType } from '../types';
import TravelCard from './TravelCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TravelPlanProps {
  plan: TravelPlanType;
  onStartOver: () => void;
}

const TravelPlan: React.FC<TravelPlanProps> = ({ plan, onStartOver }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentDay, setCurrentDay] = useState(1);
  
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  const selectDay = (day: number) => {
    setCurrentDay(day);
    
    // Find the card element and scroll to it
    const element = document.getElementById(`day-card-${day}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-reveal">
      <div className="bg-white rounded-xl shadow-subtle overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Your Trip to {plan.destination}</h2>
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-blue-100 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>{plan.duration} days</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1.5" />
              <span>Budget: ${plan.totalBudget}</span>
            </div>
          </div>
          <p className="text-blue-50 max-w-3xl">{plan.summary}</p>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <Button 
              onClick={onStartOver} 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Start Over
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="mr-1 h-4 w-4" />
              Save Itinerary
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="itinerary" className="mb-8">
        <TabsList className="w-full bg-white shadow-sm border border-gray-100 p-1">
          <TabsTrigger value="itinerary" className="flex-1">Itinerary</TabsTrigger>
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="tips" className="flex-1">Travel Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="itinerary" className="pt-6">
          {/* Day selection */}
          <div className="relative mb-8">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white shadow-subtle border-gray-200"
                onClick={handleScrollLeft}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="flex space-x-2 overflow-x-auto py-2 px-10 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {plan.days.map((day) => (
                <button
                  key={day.day}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentDay === day.day
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => selectDay(day.day)}
                >
                  Day {day.day}
                </button>
              ))}
            </div>
            
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white shadow-subtle border-gray-200"
                onClick={handleScrollRight}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Day cards */}
          <div className="space-y-8">
            {plan.days.map((day) => (
              <div key={day.day} id={`day-card-${day.day}`}>
                <TravelCard day={day.day} date={day.date} activities={day.activities} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="overview" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Flight Information */}
            {plan.flightInfo && (
              <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center space-x-2">
                    <Plane className="text-blue-600 w-5 h-5" />
                    <h3 className="font-medium text-gray-900">Flight Information</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-1">Airline</div>
                    <div className="font-medium">{plan.flightInfo.airline}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Departure</div>
                      <div className="font-medium">{plan.flightInfo.departureTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Arrival</div>
                      <div className="font-medium">{plan.flightInfo.arrivalTime}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Price</span>
                    <div className="font-semibold text-lg">
                      ${plan.flightInfo.price}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Accommodation Information */}
            {plan.accommodation && (
              <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center space-x-2">
                    <Hotel className="text-blue-600 w-5 h-5" />
                    <h3 className="font-medium text-gray-900">Accommodation</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-1">Hotel</div>
                    <div className="font-medium">{plan.accommodation.name}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span>{plan.accommodation.location}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Per Night</div>
                      <div className="font-medium">${plan.accommodation.pricePerNight}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Total Stay</div>
                      <div className="font-semibold text-lg">${plan.accommodation.totalCost}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Budget Summary */}
          <div className="mt-6 bg-white rounded-xl shadow-subtle overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <div className="flex items-center space-x-2">
                <DollarSign className="text-blue-600 w-5 h-5" />
                <h3 className="font-medium text-gray-900">Budget Summary</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Flights</div>
                  <div className="font-semibold">${plan.flightInfo?.price || 0}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Accommodation</div>
                  <div className="font-semibold">${plan.accommodation?.totalCost || 0}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Activities & Food</div>
                  <div className="font-semibold">
                    ${plan.totalBudget - (plan.flightInfo?.price || 0) - (plan.accommodation?.totalCost || 0)}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-medium">Total Budget</span>
                <div className="font-semibold text-xl">
                  ${plan.totalBudget}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tips" className="pt-6">
          <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <div className="flex items-center space-x-2">
                <Info className="text-blue-600 w-5 h-5" />
                <h3 className="font-medium text-gray-900">Travel Tips for {plan.destination}</h3>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                {plan.tips.map((tip, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm mr-3">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelPlan;
