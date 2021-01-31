import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Category } from "../../components/category";
import { Loading } from "../../components/loading";
import { Pagination } from "../../components/pagination";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENTS, RESTAURANT_FRAGMENT } from "../../fragments";
import { usePagination } from "../../hooks/usePagination";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }

    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENTS}
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const { page, onPrevPageClick, onNextPageClick } = usePagination(1);
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `term=${searchTerm}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex justify-center items-center"
      >
        <input
          ref={register({ required: true, min: 3 })}
          name="searchTerm"
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search Restaurants..."
        />
      </form>
      <div className="container mt-8 pb-20">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex justify-around max-w-sm mx-auto">
              {data?.allCategories.categories?.map(category => (
                <Category key={category.id} category={category} />
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-16">
              {data?.restaurants.results?.map(restaurant => (
                <Restaurant key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={data?.restaurants.totalPages || 0}
              onPrevPageClick={onPrevPageClick}
              onNextPageClick={onNextPageClick}
            />
          </>
        )}
      </div>
    </div>
  );
};
