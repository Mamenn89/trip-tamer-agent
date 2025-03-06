
import React from 'react';
import { Calendar, DollarSign, MapPin, Clock } from 'lucide-react';
import { TravelActivity } from '../types';

interface TravelCardProps {
  day: number;
  date: string;
  activities: TravelActivity[];
}

const TravelCard: React.FC<TravelCardProps> = ({ day, date, activities }) => {
  const totalCost = activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);
  
  return (
    <div className="bg-white rounded-xl shadow-subtle overflow-hidden transition-transform hover:translate-y-[-2px] animate-reveal">
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="text-blue-600 w-5 h-5" />
            <h3 className="font-medium text-gray-900">Day {day}</h3>
          </div>
          <span className="text-gray-500 text-sm">{date}</span>
        </div>
      </div>
      
      <div className="p-6">
        <ul className="space-y-6">
          {activities.map((activity, index) => (
            <li key={index} className="relative pl-6 pb-6 border-l border-gray-200 last:pb-0 last:border-0">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-400"></div>
              
              <div className="flex items-start">
                <div className="mr-4 flex-1">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{activity.time}</span>
                    
                    <span className="mx-2">•</span>
                    
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getActivityTypeStyles(activity.type)}`}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-900 font-medium mb-1">{activity.description}</p>
                  
                  {activity.location && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{activity.location}</span>
                    </div>
                  )}
                </div>
                
                {activity.cost !== undefined && (
                  <div className="flex items-center whitespace-nowrap text-gray-700">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>${activity.cost}</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">Total for day {day}</span>
          <div className="font-medium">
            ${totalCost}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get styles for different activity types
const getActivityTypeStyles = (type: string): string => {
  switch (type) {
    case 'transportation':
      return 'bg-blue-50 text-blue-700';
    case 'sightseeing':
      return 'bg-green-50 text-green-700';
    case 'meal':
      return 'bg-orange-50 text-orange-700';
    case 'accommodation':
      return 'bg-purple-50 text-purple-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

export default TravelCard;
