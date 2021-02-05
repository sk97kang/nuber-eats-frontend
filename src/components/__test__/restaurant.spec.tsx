import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { restaurantsPageQuery_restaurants_results } from "../../__generated__/restaurantsPageQuery";
import { Restaurant } from "../restaurant";

export const TEST_RESTAURANT: restaurantsPageQuery_restaurants_results = {
  __typename: "Restaurant",
  id: 1,
  name: "name",
  address: "address",
  category: {
    __typename: "Category",
    name: "category",
  },
  coverImg: "coverImg",
  isPromoted: false,
};

describe("<Restaurant />", () => {
  it("render OK with props", () => {
    const { getByText, container } = render(
      <Router>
        <Restaurant restaurant={TEST_RESTAURANT} />
      </Router>
    );
    getByText(TEST_RESTAURANT.name);
    getByText(TEST_RESTAURANT.category?.name || "");
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/restaurant/${TEST_RESTAURANT.id}`
    );
  });
});
