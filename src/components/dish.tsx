import { data } from "autoprefixer";
import React from "react";
import { DishParts } from "../__generated__/DishParts";
import { OrderItemOptionInputType } from "../__generated__/globalTypes";

interface IDishProps {
  dish: DishParts;
  isCustomer?: boolean;
  orderStarted?: boolean;
  isSelected?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
}

export const Dish: React.FC<IDishProps> = ({
  children: dishOptions,
  dish,
  isCustomer = false,
  orderStarted = false,
  isSelected = false,
  addItemToOrder = () => {},
  removeFromOrder = () => {},
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (isSelected) {
        removeFromOrder(dish.id);
      } else {
        addItemToOrder(dish.id);
      }
    }
  };
  return (
    <div
      className={`px-8 py-4 border transition-all cursor-pointer ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium flex justify-between">
          {dish.name}{" "}
          {orderStarted && (
            <button
              className={`ml-3 py-1 px-3 focus:outline-none text-sm  text-white ${
                isSelected ? "bg-red-500" : " bg-lime-600"
              }`}
              onClick={onClick}
            >
              {isSelected ? "Remove" : "Add"}
            </button>
          )}
        </h3>
        <h4 className="font-medium">{dish.description}</h4>
      </div>
      <span>${dish.price}</span>
      {!isCustomer && dish.options?.length !== 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options</h5>
          {dish.options?.map((option, index) => (
            <span key={index} className="flex items-center">
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">(${option.extra})</h6>
            </span>
          ))}
        </div>
      )}
      {isCustomer && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
          <div className="grid gap-2  justify-start">{dishOptions}</div>
        </div>
      )}
    </div>
  );
};
