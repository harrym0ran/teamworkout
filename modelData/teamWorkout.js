"use strict";

/**
 * Model data for CS142 Project 5 - the photo sharing site.
 * This module returns an object called cs142Models with the following
 * functions:
 *
 * cs142Models.userListModel() - A function that returns the list of users on
 * the system. The list is returned as an array of objects containing:
 *   _id (string)         - The ID of the user.
 *   first_name (string)  - The first name of the user.
 *   last_name (string)   - The last name of the user.
 *   location (string)    - The location of the user.
 *   description (string) - A brief user description.
 *   occupation (string)  - The occupation of the user.
 *
 * cs142Models.userModel() - A function that returns the info of the specified
 * user. Called with an user ID (id), the function returns n object containing:
 *   _id (string)         - The ID of the user.
 *   first_name (string)  - The first name of the user.
 *   last_name (string)   - The last name of the user.
 *   location (string)    - The location of the user.
 *   description (string) - A brief user description.
 *   occupation (string)  - The occupation of the user.
 *
 * cs142Models.photoOfUserModel() - A function that returns the photos belong to
 * the specified user. Called with an user ID (id), the function returns an
 * object containing:
 *   _id (string)         - The ID of the photo
 *   date_time (date)     - The date and time the picture was taken in ISO
 *                          format.
 *   file_name (string)   - The file name in the image directory of the picture.
 *   user_id (string)     - The user id of the picture's owner.
 *   comments ([objects]) - An array of Comments with the properties:
 *       _id (string)       - The ID of the comment.
 *       date_time (date)   - The date the comment was made in ISO format.
 *       comment (string)   - The text of the comment.
 *       user: (object)     - The user who made the comment.
 *       photo_id: (string) - The ID of the photo the comment belongs to.
 *
 * cs142Models.schemaModel() - A function that returns the test info from the
 * fake schema. The function returns an object containing:
 *   _id (string)           - The ID of the schema.
 *   __v (number)           - The version number.
 *   load_date_time (date)  - The date the schema was made in ISO format.
 */

(function () {
  // Create fake test Schema
  const schemaInfo = {
    load_date_time: "Fri Apr 29 2016 01:45:15 GMT-0700 (PDT)",
    __v: 0,
    _id: "57231f1b30e4351f4e9f4bf6",
  };

  // Create init users.

  const js = {
    _id: "57231f1a30e4351f4e9f4bd7",
    first_name: "Josh",
    last_name: "Sutcliffe",
    coach: true,
  };
  const os = {
    _id: "57231f1a30e4351f4e9f4bd8",
    first_name: "Oliver",
    last_name: "Sibal",
    year: "Senior",
    position: "Scrum Half",
    coach: false,
  };
  const nf = {
    _id: "57231f1a30e4351f4e9f4bd9",
    first_name: "Noah",
    last_name: "Folefac",
    location: "Gondor",
    year: "Coterm",
    position: "No. 8",
    coach: false,
  };
  // const rk = {
  //   _id: "57231f1a30e4351f4e9f4bda",
  //   first_name: "Rey",
  //   last_name: "Kenobi",
  //   location: "D'Qar",
  //   description: "Excited to be here!",
  //   occupation: "Rebel",
  // };
  // const al = {
  //   _id: "57231f1a30e4351f4e9f4bdb",
  //   first_name: "April",
  //   last_name: "Ludgate",
  //   location: "Pawnee, IN",
  //   description: "Witch",
  //   occupation: "Animal Control",
  // };
  // const jo = {
  //   _id: "57231f1a30e4351f4e9f4bdc",
  //   first_name: "John",
  //   last_name: "Ousterhout",
  //   location: "Stanford, CA",
  //   description: "<i>CS142!</i>",
  //   occupation: "Professor",
  // };

  //const users = [im, er, pt, rk, al, jo];
  const users = [js, os, nf];

  // Create initial photos.
  const exercise1 = {
    _id: "57231f1a30e4351f4e9f4bdd",
    date_time: "2012-08-30 10:44:23",
    file_name: "lift-spring.png",
    user_id: js._id,
    title: "Spring",
    notes: "Keep intensity high for sevens practice"
  };
  const exercise2 = {
    _id: "57231f1a30e4351f4e9f4bde",
    date_time: "2009-09-13 20:00:00",
    file_name: "lift-winter.png",
    user_id: js._id,
    title: "Winter",
    notes: "Try to avoid heavy exercise before game days or on contact training days"
  };
  const exercise3 = {
    _id: "57231f1a30e4351f4e9f4bdf",
    date_time: "2009-09-13 20:05:03",
    file_name: "lift-off-6.png",
    user_id: js._id,
    title: "Off Season",
    notes: "Make sure you're eating an resting enough to account for the intensity of this program",
  };
  const exercise4 = {
    _id: "57231f1a30e4351f4e9f4be0",
    date_time: "2013-11-18 18:02:00",
    file_name: "lift-off-3.png",
    user_id: js._id,
    title: "Off Season",
    notes: "Try to do some other form of exericse on off days - hiking, running etc."
  };

  const exercises = [
    exercise1,
    exercise2,
    exercise3,
    exercise4,
  ];

  // Create initial comments.
  const comment1 = {
    _id: "57231f1a30e4351f4e9f4be9",
    date_time: "2012-09-02 14:01:00",
    comment:
      "Has anyone incorporated deadlifts into their rugby training regimen? How did it impact your scrum performance?",
    user: nf,
    exercise_id: exercise1._id,
  };

  const comment2 = {
    _id: "57231f1a30e4351f4e9f4bea",
    date_time: "2013-09-06 14:02:00",
    comment:
      "For seasoned weightlifters here, what's your preferred grip style for improving snatch lifts? Hook grip or alternate grip?",
    user: os,
    exercise_id: exercise1._id,
  };

  const comment3 = {
    _id: "57231f1a30e4351f4e9f4beb",
    date_time: "2013-09-08 14:06:00",
    comment:
      "In preparation for rugby season, I’ve been focusing on explosive power. How do you guys cycle between hypertrophy and strength phases in your weightlifting routines?",
    user: nf,
    exercise_id: exercise1._id,
  };

  const comment4 = {
    _id: "57231f1a30e4351f4e9f4bec",
    date_time: "2009-09-14 18:07:00",
    comment:
      "Does anyone have experience with incorporating plyometric exercises into their weightlifting routine for improved agility in rugby?",
    user: os,
    exercise_id: exercise2._id,
  };


  const comments = [
    comment1,
    comment2,
    comment3,
    comment4,
  ];

  comments.forEach(function (comment) {
    const exercise = exercises.filter(function (exercise) {
      return exercise._id === comment.exercise_id;
    })[0]; // Only one match. Return the content of the match inside the array

    if (!exercise.comments) {
      exercise.comments = [];
    }
    exercise.comments.push(comment);
  });

  const userListModel = function () {
    return users;
  };

  const userModel = function (userId) {
    for (let i = 0; i < users.length; i++) {
      if (users[i]._id === userId) {
        return users[i];
      }
    }
    return null;
  };

  const exerciseModel = function (userId) {
    return exercises.filter(function (exercise) {
      return exercise.user_id === userId;
    });
  };

  const schemaModel = function () {
    return schemaInfo;
  };

  const cs142models = {
    userListModel: userListModel,
    userModel: userModel,
    exerciseModel: exerciseModel,
    schemaInfo: schemaModel,
  };

  if (typeof exports !== "undefined") {
    // We're being loaded by the Node.js module loader ('require') so we use its
    // conventions of returning the object in exports.
    exports.cs142models = cs142models;
  } else {
    // We're not in the Node.js module loader so we assume we're being loaded by
    // the browser into the DOM.
    window.cs142models = cs142models;
  }
}());
