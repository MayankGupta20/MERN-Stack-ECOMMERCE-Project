const express = require("express");
const app = express();

const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const path = require("path");

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

//const cors = require("cors");
//app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//routes imports
const products = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
app.use("/api/v1", products);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

//use frontend build
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

//middleware for errors
app.use(errorMiddleware);

module.exports = app;
