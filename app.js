const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

app.use(morgan("dev"));

// Usar body-parser como middleware
app.use(bodyParser.json()); // Para analizar datos JSON
app.use(bodyParser.urlencoded({ extended: false })); // Para analizar datos de formulario
app.use(bodyParser.json()); // Para analizar datos JSON

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    req.header(
      'Access-Control-Allow-Methods',
      'PUT, POST, PATCH, DELETE, GET, OPTIONS'
    );
    return res.status(200).json({});
  }
  next(); // Add this line to pass the control to the next middleware, else it will keep waiting and will stuck
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// Error handlers
app.use((req, res, next) => {
  const errorHandler = new Error("Not found");
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
