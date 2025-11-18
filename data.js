const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  description: String,
  rating: Number,
  product: String,
});

module.exports = mongoose.model("User", userSchema);
