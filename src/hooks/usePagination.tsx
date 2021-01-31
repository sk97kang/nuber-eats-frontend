import { useState } from "react";

export const usePagination = (initPage: number) => {
  const [page, setPage] = useState(initPage);

  const onPrevPageClick = () => {
    if (page > 1) {
      setPage(current => current - 1);
    }
  };

  const onNextPageClick = () => {
    setPage(current => current + 1);
  };

  return {
    page,
    onPrevPageClick,
    onNextPageClick,
  };
};
