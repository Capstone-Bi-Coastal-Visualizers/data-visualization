import React from "react";
import BarChart from "./BarChart";

const SearchResult = (props) => {
  console.log(props);
  return (
    <div>
      <BarChart data={props.data} />
    </div>
  );
};

export default SearchResult;
