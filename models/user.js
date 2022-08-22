"use strict";

const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
