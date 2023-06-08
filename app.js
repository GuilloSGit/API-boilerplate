const express = require("express");
const app = express();
const morgan = require("morgan");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

app.use(morgan("dev"));

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
// End of the error handler

module.exports = app;
