const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const ProductsController = require("../controllers/products");

const Product = require("../models/product");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().getDate() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getFullYear() +
        "-prod-" +
        file.originalname,
    );
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Upload failed"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", ProductsController.products_get_all);
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductsController.products_post_one,
);
router.get("/:productId", ProductsController.products_get_one);
router.patch("/:productId", checkAuth, ProductsController.products_patch);
router.delete(
  "/:productId",
  checkAuth,
  ProductsController.products_delete_product,
);

module.exports = router;
