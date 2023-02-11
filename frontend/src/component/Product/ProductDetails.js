import React, { Fragment, useState } from "react";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProductDetails,
  newReview,
} from "../../actions/productAction";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import Loader from "../layout/loader/Loader";
import Carousel from "react-material-ui-carousel";
import ReactStars from "react-rating-stars-component";
import Rating from "@mui/material/Rating";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import ReviewCard from "./ReviewCard.js";
import { addItemsToCart } from "../../actions/cartAction";
import { Button } from "@mui/material";
import { NEW_REVIEW_RESET } from "../../constants/productConstant";
const ProductDetails = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );
  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    value: product.ratings,
    isHalf: true,
    size: window.innerWidth < 600 ? 20 : 25,
  };
  let { id } = useParams();

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (product.stock <= quantity) {
      return;
    }
    const q = quantity + 1;
    setQuantity(q);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    const q = quantity - 1;
    setQuantity(q);
  };

  const addItemToCart = () => {
    if (product.stock > 0) {
      dispatch(addItemsToCart(id, quantity));
      alert.success("Item Added to cart");
    } else {
      alert.error("Item Out of Stock");
    }
  };

  const handleReviewSubmit = () => {
    const myForm = new FormData();

    myForm.set("rating", newReviewRating);
    myForm.set("comment", newReviewComment);
    myForm.set("product_id", id);

    dispatch(newReview(myForm));

    setOpenDialog(false);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, alert, reviewError, success]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="ProductDetails">
            <div>
              <Carousel sx={{ width: 270, height: 400 }}>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      style={{
                        width: "100%",
                        height: "45vh",
                      }}
                      className="CarouselImage"
                      key={item.url}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span>({product.numOfReviews} Reviews)</span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button onClick={addItemToCart}>Add to Cart</button>
                </div>

                <p>
                  Status:
                  <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                    {product.stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>
              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>
              <button
                className="submitReview"
                onClick={() => setOpenDialog(true)}
              >
                Submit Review
              </button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          <Dialog open={openDialog}>
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                value={newReviewRating}
                precision={0.5}
                onChange={(e, val) => setNewReviewRating(val)}
              ></Rating>
              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(!openDialog)}>Cancel</Button>
              <Button onClick={() => handleReviewSubmit()}>Save</Button>
            </DialogActions>
          </Dialog>

          {product.Reviews && product.Reviews[0] ? (
            <div className="reviews">
              {product.Reviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
            </div>
          ) : (
            <div>
              <p className="noReviews">No Reviews for this Product</p>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
