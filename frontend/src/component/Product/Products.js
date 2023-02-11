import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import Loader from "../layout/loader/Loader";

import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useAlert } from "react-alert";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
  "Furniture",
];
const Products = () => {
  const { keyword } = useParams();
  const alert = useAlert();
  const dispatch = useDispatch();
  const [price, setPrice] = useState([0, 150000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);
  const [page, setPage] = useState(1);
  const { products, loading, error, totalPage } = useSelector(
    (state) => state.products
  );

  function valuetext(value) {
    return `${value}`;
  }

  const priceHandler = (event, newValue) => {
    setPrice(newValue);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, price, category, ratings, page));
  }, [dispatch, keyword, price, category, ratings, page, error, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h3 className="productsHeading">Products</h3>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              getAriaLabel={() => "Price range"}
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              min={0}
              max={20000}
            />
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>
          <div className="pagination">
            <Stack spacing={2}>
              <Pagination
                count={totalPage}
                variant="outlined"
                shape="rounded"
                onChange={(e, page) => setPage(page)}
                page={page}
              />
            </Stack>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
