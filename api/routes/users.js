const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bycrypt = require("bcrypt");

const User = require("../models/user");

router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then((users) => {
      res.status(200).json({
        count: users.length,
        users: users,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:_id", (req, res, next) => {
  const userId = req.params._id;
  User.findById(userId)
    .exec()
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: "User found",
          user: user,
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/signup", (req, res, _next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail already exists",
        });
      } else {
        bycrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  error: error,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.deleteOne({ _id: userId })
    .exec()
    .then((result) => {
      if (result.deletedCount === 1) {
        res.status(200).json({
          message: "User deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
