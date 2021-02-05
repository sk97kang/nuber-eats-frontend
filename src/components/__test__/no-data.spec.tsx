import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { NoData } from "../no-data";

const mockHistoryGoBack = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

describe("<NoData />", () => {
  it("should render OK", () => {
    const { getByText, getByRole } = render(<NoData />);
    getByText("Not found restaurant");
    getByText("← Go Back");

    fireEvent.click(getByRole("button"));
    expect(mockHistoryGoBack).toHaveBeenCalledTimes(1);
  });
});
