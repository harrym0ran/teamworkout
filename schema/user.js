"use strict";

const mongoose = require("mongoose");

/**
 * Define the Mongoose Schema for a Comment.
 */
const userSchema = new mongoose.Schema({
  login_name: {type: String, default: null},
  password: {type: String, default: ""},
  first_name: String,
  last_name: String,
  year: String,
  position: String,
  coach: {type: Boolean, default: false},
});

userSchema.pre('save', function(next) {
  if (!this.login_name) {
    this.login_name = this.last_name.toLowerCase();
  }
  next();
});

/**
 * Create a Mongoose Model for a User using the userSchema.
 */
const User = mongoose.model("User", userSchema);

/**
 * Make this available to our application.
 */
module.exports = User;
