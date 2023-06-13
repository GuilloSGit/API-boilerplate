const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Default routes for express
const createRoutes = require("./api/routes/routes");

// Models Imports
const Product = require("./api/models/product");
const Order = require("./api/models/order");

// Instance methods for models
const productRouter = createRoutes("products", Product); // Create instance of product router
const orderRouter = createRoutes("orders", Order); // Create instance of order router

mongoose
  .connect(
    "mongodb+srv://admin:" +
      process.env.MONGOPASSWORD +
      "@cluster-api.rm472wx.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(morgan("dev"));

// Usar body-parser como middleware
app.use(bodyParser.json()); // Para analizar datos JSON
app.use(bodyParser.urlencoded({ extended: false })); // Para analizar datos de formulario
app.use(bodyParser.json()); // Para analizar datos JSON

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    req.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET, OPTIONS"
    );
    return res.status(200).json({});
  }
  next(); // Add this line to pass the control to the next middleware, else it will keep waiting and will stuck
});

app.use("/products", productRouter); // Register product routes
app.use("/orders", orderRouter); // Register order routes

// Error handlers
app.use((req, res, next) => {
  const errorHandler = new Error("This is not a valid path");
  errorHandler.status = 404;
  next(errorHandler);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
