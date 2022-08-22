"use strict";

const mongoose = require("mongoose");

var ApartmentSchema = new mongoose.Schema({
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  apartmentName: { type: String, required: true },
});

module.exports = mongoose.model("Apartment", ApartmentSchema);
