import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";
import { Loading } from "../../components/loading";
import { NoData } from "../../components/no-data";
import { Pagination } from "../../components/pagination";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { usePagination } from "../../hooks/usePagination";
import { useQueryParam } from "../../hooks/useQueryParam";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const param = useQueryParam();
  const history = useHistory();
  const [callQuery, { loading, data }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  const { page, onPrevPageClick, onNextPageClick } = usePagination(1);
  const query = param.get("term");
  useEffect(() => {
    if (!query) {
      return history.replace("/");
    }
    callQuery({ variables: { input: { page, query } } });
  }, [history, page]);
  const hasRestaurants = data?.searchRestaurant.totalPages || 0 > 0;

  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <div className="container mt-8 pb-20">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="text-xl font-medium">{`'${query}'의 검색결과`}</div>
            {hasRestaurants && (
              <>
                <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-8">
                  {data?.searchRestaurant.restaurants?.map(restaurant => (
                    <Restaurant key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={data?.searchRestaurant.totalPages || 0}
                  onPrevPageClick={onPrevPageClick}
                  onNextPageClick={onNextPageClick}
                />
              </>
            )}
            {!hasRestaurants && <NoData />}
          </>
        )}
      </div>
    </div>
  );
};
