import { Link } from "react-router-dom";
import { restaurantsPageQuery_allCategories_categories } from "../__generated__/restaurantsPageQuery";

interface ICategoryProps {
  category: restaurantsPageQuery_allCategories_categories;
}

export const Category: React.FC<ICategoryProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.slug}`}>
      <div className="flex flex-col items-center group cursor-pointer">
        <div
          className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-200"
          style={{ backgroundImage: `url(${category.coverImg})` }}
        ></div>
        <span className="mt-1 text-sm text-center font-medium">
          {category.name}
        </span>
      </div>
    </Link>
  );
};
