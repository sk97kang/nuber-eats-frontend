import React from "react";
import { DishParts } from "../__generated__/DishParts";

interface IDishProps {
  dish: DishParts;
}

export const Dish: React.FC<IDishProps> = ({ dish }) => {
  return (
    <div className="px-8 py-4 border hover:border-gray-800 transition-all">
      <div className="mb-5">
        <h3 className="text-lg font-medium">{dish.name}</h3>
        <h4 className="font-medium">{dish.description}</h4>
      </div>
      <span>${dish.price}</span>
      {dish.options?.length !== 0 && (
        <div className="border-t mt-3">
          <div className="font-medium my-3">Options</div>
          {dish.options?.map(options => (
            <div className="my-2" key={options.name}>
              <span className="text-sm mr-5">{options.name}</span>
              <span className="text-xs">${options.extra}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
