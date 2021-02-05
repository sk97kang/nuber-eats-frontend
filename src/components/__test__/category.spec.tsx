import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Category } from "../category";
import { restaurantsPageQuery_allCategories_categories } from "../../__generated__/restaurantsPageQuery";

export const TEST_CATEGORY: restaurantsPageQuery_allCategories_categories = {
  __typename: "Category",
  id: 1,
  name: "category",
  restaurantCount: 0,
  coverImg: "coverImg",
  slug: "category",
};

describe("<Category />", () => {
  it("should render OK with props", () => {
    const { getByText } = render(
      <Router>
        <Category category={TEST_CATEGORY} />
      </Router>
    );

    getByText(TEST_CATEGORY.name);
  });
});
