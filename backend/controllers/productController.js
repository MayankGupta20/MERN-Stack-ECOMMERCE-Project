const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");

const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// Create Product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

//get all products
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const productPerPage = 8;
  const productCount = await Product.countDocuments();
  let apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  //  .pagination(productPerPage);

  let products = await apiFeatures.query;

  let filteredProductsCount = products.length;

  apiFeatures = apiFeatures.pagination(productPerPage);

  products = await apiFeatures.query.clone();
  let totalPage = 1;
  if (filteredProductsCount % productPerPage == 0) {
    totalPage = filteredProductsCount / productPerPage;
  } else {
    totalPage = Math.floor(filteredProductsCount / productPerPage) + 1;
  }

  res.status(200).json({
    success: true,
    products,
    productCount,
    productPerPage,
    totalPage,
  });
});

//Get Single Product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//update product -- admin access

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// delete product -- admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deletion Successful",
  });
});

// Creating or updating product review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, product_id } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(product_id);

  const isReviewed = product.Reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.Reviews.forEach((r) => {
      if (r.user.toString() === req.user._id.toString()) {
        r.rating = rating;
        r.comment = comment;
      }
    });
  } else {
    product.Reviews.push(review);
  }

  const numOfReviews = product.Reviews.length;

  let avg = 0;
  product.Reviews.forEach((r) => (avg += r.rating));
  product.ratings = avg / numOfReviews;

  product.numOfReviews = numOfReviews;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    product,
  });
});

// get all reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product_id = req.query.id;

  const product = await Product.findById(product_id);

  if (!product) {
    return next(new ErrorHandler("Prouct Not Found", 400));
  }
  const reviews = product.Reviews;

  res.status(200).json({
    success: true,
    reviews,
  });
});
// delete review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product_id = req.query.productId;

  let product = await Product.findById(product_id);

  if (!product) {
    return next(new ErrorHandler("Prouct Not Found", 400));
  }
  const Reviews = product.Reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });
  const numOfReviews = Reviews.length;

  let avg = 0;
  Reviews.forEach((r) => (avg += r.rating));
  const ratings = numOfReviews > 0 ? avg / numOfReviews : 0;

  await Product.findByIdAndUpdate(
    product_id,
    {
      Reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      UpdateFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review Deleted",
  });
});
