const express = require("express");
const mongoose = require("mongoose");

// Reusable function to create routes
function createRoutes(modelName, Model) {
  // Create a new instance of Express Router
  const router = express.Router();

  router.get("/", (req, res, next) => {
    Model.find()
      .exec()
      .then((docs) => {
        if (docs.length !== 0) {
          res.status(200).json(docs);
        } else {
          res.status(200).json({
            message: `There are no ${modelName} in the database`,
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
    const instance = new Model({
      _id: new mongoose.Types.ObjectId(),
      productName: req.body.productName,
      price: req.body.price,
    });

    instance
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: `Successfully saved to /${modelName}`,
          createdInstance: result,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          error: err,
        });
      });
  });

  router.get("/:instanceId", (req, res, next) => {
    const id = req.params.instanceId;
    Model.findById(id)
      .exec()
      .then((doc) => {
        console.log(`From database: ${modelName}`, doc);
        if (doc) {
          res.status(200).json(doc);
        } else {
          res.status(404).json({ message: `${modelName} not found` });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.patch("/:instanceId", (req, res, next) => {
    const id = req.params.instanceId;
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

    Model.updateOne({ _id: id }, updateOps)
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

  router.delete("/:instanceId", (req, res, next) => {
    const id = req.params.instanceId;
    Model.deleteOne({
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

  return router;
}

const Product = require("../models/product");
const Order = require("../models/order");

module.exports = createRoutes;
