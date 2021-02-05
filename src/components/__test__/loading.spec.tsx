import { render } from "@testing-library/react";
import React from "react";
import { Loading } from "../loading";

describe("<Loading />", () => {
  it("should render OK", () => {
    const { getByText } = render(<Loading />);
    getByText("Loading...");
  });
});
