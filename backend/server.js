const app = require("./app");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");
//Handing UncaughtException error
process.on("uncaughtException", (err) => {
  console.log(`uncaught exeption`);
  console.log(`error : ${err.message}`);
  process.exit(1);
});

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}
//console.log(process.env.PORT);

//connecting to database
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT} `);
});

//unhandled promise rejetion error
process.on("unhandledRejection", (err) => {
  console.log(`error : ${err.message}`);
  console.log("Shutting server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
