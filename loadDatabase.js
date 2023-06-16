/**
 * This Node.js program loads the CS142 Project 6 model data into Mongoose
 * defined objects in a MongoDB database. It can be run with the command:
 *     node loadDatabase.js
 * be sure to have an instance of the MongoDB running on the localhost.
 *
 * This script loads the data into the MongoDB database named 'cs142project6'.
 * In loads into collections named User and Exercises. The Comments are added in
 * the Exercises of the comments. Any previous objects in those collections is
 * discarded.
 *
 * NOTE: This scripts uses Promise abstraction for handling the async calls to
 * the database. We are not teaching Promises in CS142 so strongly suggest you
 * don't use them in your solution.
 */

// We use the Mongoose to define the schema stored in MongoDB.
// const mongoose = require("mongoose");
// mongoose.Promise = require("bluebird");
// mongoose.set("strictQuery", false);
// mongoose.connect("mongodb://127.0.0.1/cs142project6", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set("strictQuery", false);
// const uri =
//   "mongodb+srv://teamworkout_admin:n5wZ6AJpC4nXogHb@teamworkout.aorqnao.mongodb.net/?retryWrites=true&w=majority";
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;

const uri = `mongodb+srv://${username}:${password}@${dbHost}/?retryWrites=true&w=majority`;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// mongoose.connect(
//   "mongodb+srv://<teamworkout_admin>:<n5wZ6AJpC4nXogHb>@teamworkout.aorqnao.mongodb.net/?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

// Get the magic models we used in the previous projects.
const cs142models = require("./modelData/teamWorkout.js").cs142models;

// Load the Mongoose schema for Use and Exercise
const User = require("./schema/user.js");
const Exercise = require("./schema/exercise.js");
const SchemaInfo = require("./schema/schemaInfo.js");

const versionString = "1.0";

// We start by removing anything that existing in the collections.
const removePromises = [
  User.deleteMany({}),
  Exercise.deleteMany({}),
  SchemaInfo.deleteMany({}),
];

Promise.all(removePromises)
  .then(function () {
    // Load the users into the User. Mongo assigns ids to objects so we record
    // the assigned '_id' back into the cs142model.userListModels so we have it
    // later in the script.

    const userModels = cs142models.userListModel();
    const mapFakeId2RealId = {};
    const userPromises = userModels.map(function (user) {
      return User.create({
        first_name: user.first_name,
        last_name: user.last_name,
        year: user.year,
        position: user.position,
        coach: user.coach,
      })
        .then(function (userObj) {
          // Set the unique ID of the object. We use the MongoDB generated _id
          // for now but we keep it distinct from the MongoDB ID so we can go to
          // something prettier in the future since these show up in URLs, etc.
          userObj.save();
          mapFakeId2RealId[user._id] = userObj._id;
          user.objectID = userObj._id;
          console.log(
            "Adding user:",
            user.first_name + " " + user.last_name,
            " with ID ",
            user.objectID
          );
        })
        .catch(function (err) {
          console.error("Error create user", err);
        });
    });

    // const allPromises = Promise.all(userPromises).then(function () {
    //   // Once we've loaded all the users into the User collection we add all the
    //   // exercises. Note that the user_id of the exercise is the MongoDB assigned id
    //   // in the User object.
    //   const exerciseModels = [];
    //   const userIDs = Object.keys(mapFakeId2RealId);
    //   userIDs.forEach(function (id) {
    //     exerciseModels.push(...cs142models.exerciseModel(id));
    //   });

    //   const exercisePromises = exerciseModels.map(function (exercise) {
    //     return Exercise.create({
    //       file_name: exercise.file_name,
    //       date_time: exercise.date_time,
    //       user_id: mapFakeId2RealId[exercise.user_id],
    //     })
    //       .then(function (exerciseObj) {
    //         exercise.objectID = exerciseObj._id;
    //         if (exercise.comments) {
    //           exercise.comments.forEach(function (comment) {
    //             exerciseObj.comments = exerciseObj.comments.concat([
    //               {
    //                 comment: comment.comment,
    //                 date_time: comment.date_time,
    //                 user_id: comment.user.objectID,
    //               },
    //             ]);
    //             console.log(
    //               "Adding comment of length %d by user %s to exercise %s",
    //               comment.comment.length,
    //               comment.user.objectID,
    //               exercise.file_name
    //             );
    //           });
    //         }
    //         exerciseObj.save();
    //         console.log(
    //           "Adding exercise:",
    //           exercise.file_name,
    //           " of user ID ",
    //           exerciseObj.user_id
    //         );
    //       })
    //       .catch(function (err) {
    //         console.error("Error create user", err);
    //       });
    //   });
    //   return Promise.all(exercisePromises).then(function () {
    //     // Create the SchemaInfo object
    //     return SchemaInfo.create({
    //       version: versionString,
    //     })
    //       .then(function (schemaInfo) {
    //         console.log(
    //           "SchemaInfo object created with version ",
    //           schemaInfo.version
    //         );
    //       })
    //       .catch(function (err) {
    //         console.error("Error create schemaInfo", err);
    //       });
    //   });
    // });

    // allPromises.then(function () {
    //   mongoose.disconnect();
    // });

    const allPromises = Promise.all(userPromises)
      .then(function () {
        console.log("All user promises resolved successfully.");

        const exerciseModels = [];
        const userIDs = Object.keys(mapFakeId2RealId);
        userIDs.forEach(function (id) {
          exerciseModels.push(...cs142models.exerciseModel(id));
        });

        const exercisePromises = exerciseModels.map(function (exercise) {
          return Exercise.create({
            file_name: exercise.file_name,
            date_time: exercise.date_time,
            user_id: mapFakeId2RealId[exercise.user_id],
            title: exercise.title,
            notes: exercise.notes,
          })
            .then(function (exerciseObj) {
              exercise.objectID = exerciseObj._id;
              if (exercise.comments) {
                exercise.comments.forEach(function (comment) {
                  exerciseObj.comments = exerciseObj.comments.concat([
                    {
                      comment: comment.comment,
                      date_time: comment.date_time,
                      user_id: comment.user.objectID,
                    },
                  ]);
                  console.log(
                    "Adding comment of length %d by user %s to exercise %s",
                    comment.comment.length,
                    comment.user.objectID,
                    exercise.file_name
                  );
                });
              }
              exerciseObj.save();
              console.log(
                "Adding exercise:",
                exercise.file_name,
                " of user ID ",
                exerciseObj.user_id
              );
            })
            .catch(function (err) {
              console.error("Error creating exercise", err);
            });
        });

        return Promise.all(exercisePromises)
          .then(function () {
            console.log("All exercise promises resolved successfully.");

            return SchemaInfo.create({
              version: versionString,
            })
              .then(function (schemaInfo) {
                console.log(
                  "SchemaInfo object created with version ",
                  schemaInfo.version
                );
              })
              .catch(function (err) {
                console.error("Error creating SchemaInfo", err);
              });
          })
          .catch(function (err) {
            console.error("Error resolving exercise promises", err);
          });
      })
      .catch(function (err) {
        console.error("Error resolving user promises", err);
      });

    allPromises.then(function () {
      console.log(
        "All promises resolved successfully. Disconnecting from MongoDB."
      );
      mongoose.disconnect();
    });
  })
  .catch(function (err) {
    console.error("Error create schemaInfo", err);
  });
