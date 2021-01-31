import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Loading } from "../../components/loading";
import { NoData } from "../../components/no-data";
import { Pagination } from "../../components/pagination";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENTS, RESTAURANT_FRAGMENT } from "../../fragments";
import { usePagination } from "../../hooks/usePagination";
import { category, categoryVariables } from "../../__generated__/category";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENTS}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const params = useParams<ICategoryParams>();
  const { page, onPrevPageClick, onNextPageClick } = usePagination(1);
  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    { variables: { input: { page, slug: params.slug } } }
  );
  const hasRestaurants = data?.category.totalResults || 0 > 0;

  return (
    <div>
      <Helmet>
        <title>Category | Nuber Eats</title>
      </Helmet>
      <div className="container mt-8 pb-20">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="text-xl font-medium">{`'${data?.category.category?.name}' Category 검색결과`}</div>
            {hasRestaurants && (
              <>
                <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-8">
                  {data?.category.restaurants?.map(restaurant => (
                    <Restaurant key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={data?.category.totalPages || 0}
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
