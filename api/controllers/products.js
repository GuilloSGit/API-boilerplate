const mongoose = require("mongoose");
const Product = require("../models/product");

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("productName price _id productImage productImageUrl")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            _id: doc._id,
            productName: doc.productName,
            price: doc.price,
            productImageUrl:
              "http://localhost:3000/" + doc.productImage.replace(/\\/g, "/"),
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      if (docs.length !== 0) {
        res.status(200).json({
          message:
            docs.length === 1
              ? "You have 1 product on database"
              : "Your have " + response.count + " different products",
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
};

exports.products_post_one = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    productName: req.body.productName,
    price: req.body.price,
    productImage: req.file.path,
    productImageUrl:
      "http://localhost:3000/" + req.file.path.replace(/\\/g, "/"),
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
          productImage: result.productImage,
          productImageUrl: result.productImageUrl,
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
};

exports.products_get_one = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("productName price _id productImageUrl")
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
};

exports.products_patch = (req, res, next) => {
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
};

exports.products_delete_product = (req, res, next) => {
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
};
