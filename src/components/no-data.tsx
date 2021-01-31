import React from "react";
import { useHistory } from "react-router-dom";

export const NoData = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className="flex flex-col justify-center items-center mt-16">
      <h2 className="text-xl font-medium">Not found restaurant</h2>
      <button
        className="hover:underline focus:outline-none text-lime-500 mt-2"
        onClick={goBack}
      >
        &larr; Go Back
      </button>
    </div>
  );
};
