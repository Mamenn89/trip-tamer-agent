import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:scale-105 cursor-pointer">
      {activity.place_image_url && (
        <img
          src={activity.place_image_url}
          alt={activity.place_name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <h3 className="text-xl font-semibold mb-2">{activity.place_name}</h3>
      <p className="text-gray-600 mb-4">{activity.place_details}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Price</p>
          <p className="text-gray-600">${activity.ticket_price}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Rating</p>
          <p className="text-gray-600">{activity.rating} / 5</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium">Best Time to Visit</p>
        <p className="text-gray-600">{activity.best_time_to_visit}</p>
      </div>
    </div>
  );
};