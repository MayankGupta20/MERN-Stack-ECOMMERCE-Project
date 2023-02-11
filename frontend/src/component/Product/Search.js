import React, { Fragment, useState } from "react";
import "./Searh.css";
import { useNavigate } from "react-router-dom";
const Search = () => {
  const [keyword, setKeyword] = useState("");
  let navigate = useNavigate();
  const searchHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <Fragment>
      <form className="searchBox" onSubmit={searchHandler}>
        <input
          type="text"
          placeholder="Enter Keyword to search"
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;
