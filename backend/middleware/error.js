const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong mongoDb id error - castError
  if (err.name == "CastError") {
    const message = `Resource Not Found . Invalid : ${err.path} `;
    err = new ErrorHandler(message, 400);
  }

  //Mongo duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is Invalid , Try Again`;
    err = new ErrorHandler(message, 400);
  }

  //Jwt token expire error
  if (err.name == "TokenExpiredError") {
    const message = `JsonWebToken is Expired , Try Again `;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
