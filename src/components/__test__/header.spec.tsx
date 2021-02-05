import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter as Router } from "react-router-dom";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { Header } from "../header";
import { ME_QUERY } from "../../hooks/useMe";

const false_mocks = [
  {
    request: {
      query: ME_QUERY,
    },
    result: {
      data: {
        me: {
          id: 1,
          email: "test",
          role: "test",
          verified: false,
        },
      },
    },
  },
];

const true_mocks = [
  {
    request: {
      query: ME_QUERY,
    },
    result: {
      data: {
        me: {
          id: 1,
          email: "test",
          role: "test",
          verified: true,
        },
      },
    },
  },
];

describe("<Header />", () => {
  it("renders verify banner", async () => {
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider mocks={false_mocks}>
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise(resolve => setTimeout(resolve, 0));
      getByText("Please verify your email.");
    });
  });

  it("renders without verify banner", async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider mocks={true_mocks}>
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(queryByText("Please verify your email.")).toBeNull();
    });
  });
});
