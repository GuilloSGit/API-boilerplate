const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '-prod-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", (req, res, next) => {
  Product.find()
    .select("productName price _id productImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            _id: doc._id,
            productName: doc.productName,
            price: doc.price,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      if (docs.length !== 0) {
        res.status(200).json({
          message: "Your have " + response.count + " different products",
          response,
        });
      } else {
        res.status(200).json({
          message: "There are no products saved in database yet",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", upload.single("productImage"), (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    productName: req.body.productName,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Successfully saved to /products",
        createdProduct: {
          _id: result._id,
          productName: result.productName,
          price: result.price,
          productImageUrl: result.productImage,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("productName price _id productImage")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "GET_ALL_PRODUCTS",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  let productName = "";
  const productNameObj = req.body.find(
    (item) => typeof item.value === "string"
  );
  if (productNameObj !== undefined)
    productName = productNameObj.value.toUpperCase();

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

  Product.updateOne({ _id: id }, updateOps)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product " + productName + " updated successfully",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({
    _id: id,
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted successfully",
        request: {
          type: "POST",
          url: "http://localhost:3000/products/",
          description: "POST_NEW_PRODUCT",
          body: {
            productName: "String",
            price: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
