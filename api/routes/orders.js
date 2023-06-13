const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");

router.get("/", (req, res, next) => {
  Order.find()
    .exec()
    .then((docs) => {
      if (docs.length !== 0) {
        res.status(200).json(docs);
      } else {
        res.status(200).json({
          message: "There are no orders in database",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const products = req.body.products;

  const order = new Order({
    _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId
    products: products.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    })),
  });

  order
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Successfully saved to /orders",
        createdOrder: result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.patch("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  const updateOps = {};

  // Check if req.body is iterable
  if (Array.isArray(req.body)) {
    for (const ops of req.body) {
      updateOps.$set = updateOps.$set || {};
      updateOps.$set[ops.propName] = ops.value;
    }
  } else {
    updateOps.$set = req.body;
  }

  Order.updateOne({ _id: id }, updateOps)
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.deleteOne({
    _id: id,
  })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
