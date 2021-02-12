import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";
import { DishOptionInputType } from "../../__generated__/globalTypes";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

export const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

export const AddDish = () => {
  const history = useHistory();
  const { restaurantId } = useParams<IParams>();
  const onCompleted = (data: createDish) => {
    const { ok } = data.createDish;
    if (ok) {
      history.goBack();
    }
  };
  const [createDishMutation, { data, loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: { input: { id: +restaurantId } },
      },
    ],
    onCompleted,
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState,
    setValue,
  } = useForm<IForm>({
    mode: "onChange",
  });
  const onSubmit = () => {
    if (!loading) {
      const { name, price, description, ...rest } = getValues();
      const options: DishOptionInputType[] = optionsNumber.map(theId => ({
        name: rest[`${theId}-optionName`],
        extra: +rest[`${theId}-optionExtra`],
      }));
      createDishMutation({
        variables: {
          input: {
            restaurantId: +restaurantId,
            name,
            price: +price,
            description,
            options,
          },
        },
      });
    }
  };
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const onAddOptionClick = () => {
    setOptionsNumber(current => [Date.now(), ...current]);
  };
  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber(current => current.filter(id => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
          ref={register({ required: "Name is required." })}
        />
        <input
          className="input"
          type="number"
          name="price"
          placeholder="Price"
          min={0}
          ref={register({ required: "Price is required." })}
        />
        <input
          className="input"
          type="text"
          name="description"
          placeholder="Description"
          ref={register({ required: "Description is required." })}
        />
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span
            onClick={onAddOptionClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
          >
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map(id => (
              <div className="mt-5" key={id}>
                <input
                  ref={register}
                  name={`${id}-optionName`}
                  className="py-2 px-4 mr-3 focus:outline-none focus:border-gray-600 border-2"
                  type="text"
                  placeholder="Option Name"
                />
                <input
                  ref={register}
                  name={`${id}-optionExtra`}
                  className="py-2 px-4 mr-3 focus:outline-none focus:border-gray-600 border-2"
                  type="number"
                  min={0}
                  placeholder="Option Extra"
                />
                <span
                  className="cursor-pointer text-white bg-red-500 py-3 px-4"
                  onClick={() => onDeleteClick(id)}
                >
                  Delete Option
                </span>
              </div>
            ))}
        </div>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Create Dish"
        />
        {data?.createDish?.error && (
          <FormError errorMessage={data.createDish.error} />
        )}
      </form>
    </div>
  );
};
