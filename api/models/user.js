const mongoose = require("mongoose");
const emailRegex = /^[a-zA-Z0-9._%+-]+[.,;]?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, unique: true, match: emailRegex },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
