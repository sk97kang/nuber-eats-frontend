import { render } from "@testing-library/react";
import React from "react";
import { Pagination } from "../pagination";

describe("<Pagination />", () => {
  it("should render OK with props", () => {
    const page = 1;
    const totalPages = 1;
    const { getByText } = render(
      <Pagination page={page} totalPages={totalPages} />
    );
    getByText(`Page ${page} of ${totalPages}`);
  });

  it("should render OK with previous button", () => {
    const page = 2;
    const totalPages = 3;
    const { getByText } = render(
      <Pagination page={page} totalPages={totalPages} />
    );
    getByText("←");
    getByText(`Page ${page} of ${totalPages}`);
  });

  it("should render OK with next button", () => {
    const page = 2;
    const totalPages = 3;
    const { getByText } = render(
      <Pagination page={page} totalPages={totalPages} />
    );
    getByText(`Page ${page} of ${totalPages}`);
    getByText("→");
  });
});
