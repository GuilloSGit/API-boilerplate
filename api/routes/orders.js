const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .select("order _id product quantity timeStamp")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            order: doc.order,
            product: doc.product,
            quantity: doc.quantity,
            productRequest: {
              type: "GET",
              description: "GET_PRODUCT_DETAILS",
              url: "http://localhost:3000/products/" + doc.product,
            },
            timeStamp: doc.timeStamp,
            request: {
              type: "GET",
              description: "GET_ORDER_DETAILS",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      };
      if (docs.length !== 0) {
        res.status(200).json({
          message: "Your orders are: " + response.count,
          response,
        });
      } else {
        res.status(200).json({
          message: "There are no orders in database yet",
          request: {
            type: "POST",
            description: "POST_ORDER",
            url: "http://localhost:3000/orders",
            body: {
              productId: "String",
              quantity: "Number",
            },
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId,
  });

  order
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Successfully saved to orders",
        createdOrder: {
          orderId: result._id,
          product: result.product,
          quantity: result.quantity,
          timeStamp: result.timeStamp,
        },
        request: {
          type: "GET",
          description: "GET_ORDER",
          url: "http://localhost:3000/orders/" + result.id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Oh oh... something went wrong when trying to save the order",
        error: err._message,
        details: {
          errorsDetection: err.errors,
        },
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select("_id product quantity timeStamp")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          order: doc,
          request: {
            type: "GET",
            description: "GET_PRODUCT",
            url: "http://localhost:3000/products/" + doc.product,
          },
        });
      } else {
        res.status(404).json({
          message: "Order not found",
          request: {
            type: "GET",
            description: "GET_ALL_ORDERS",
            url: "http://localhost:3000/orders",
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.patch("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  const updateOps = {};
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
      res.status(200).json(result);
    })
    .catch((err) => {
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
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
