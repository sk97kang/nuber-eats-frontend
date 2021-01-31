import { Link } from "react-router-dom";
import { restaurantsPageQuery_restaurants_results } from "../__generated__/restaurantsPageQuery";

interface IRestaurantProps {
  restaurant: restaurantsPageQuery_restaurants_results;
}

export const Restaurant: React.FC<IRestaurantProps> = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <div className="flex flex-col">
        <div
          className="bg-cover bg-center py-28 mb-2"
          style={{ backgroundImage: `url(${restaurant.coverImg})` }}
        ></div>
        <h3 className="text-xl font-medium">{restaurant.name}</h3>
        <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400">
          {restaurant.category?.name}
        </span>
      </div>
    </Link>
  );
};
