"use strict";

const mongoose = require("mongoose");

/**
 * Define the Mongoose Schema for a Comment.
 */
const commentSchema = new mongoose.Schema({
  // The text of the comment.
  comment: String,
  // The date and time when the comment was created.
  date_time: { type: Date, default: Date.now },
  // The ID of the user who created the comment.
  user_id: mongoose.Schema.Types.ObjectId,
});

/**
 * Define the Mongoose Schema for a exercise.
 */
const exerciseSchema = new mongoose.Schema({
  // Name of the file containing the exercise (in the project6/images directory).
  file_name: String,
  // The date and time when the exercise was added to the database.
  date_time: { type: Date, default: Date.now },
  // The ID of the user who created the exercise.
  user_id: mongoose.Schema.Types.ObjectId,
  // Array of comment objects representing the comments made on this exercise.
  comments: [commentSchema],
  
  title: String,

  notes: String,
});

/**
 * Create a Mongoose Model for a exercise using the exerciseSchema.
 */
const Exercise = mongoose.model("exercise", exerciseSchema);

/**
 * Make this available to our application.
 */
module.exports = Exercise;
