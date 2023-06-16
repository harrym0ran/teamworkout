/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs142 collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /workouts/:id  - Returns an array with all the exercises of the User (id).
 *                      Each exercise should have all the Comments on the Exercise
 *                      (JSON format).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const async = require("async");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

const User = require("./schema/user.js");
const Exercise = require("./schema/exercise.js");
const SchemaInfo = require("./schema/schemaInfo.js");

const processFormBody = multer({ storage: multer.memoryStorage() }).single(
  "uploadedexercise"
);

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
mongoose.set("strictQuery", false);
// mongoose.connect("mongodb://127.0.0.1/cs142project6", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.set("strictQuery", false);

mongoose.connect(
  "mongodb+srv://teamworkout_admin:n5wZ6AJpC4nXogHb@teamworkout.aorqnao.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

app.use(
  session({ secret: "secretKey", resave: false, saveUninitialized: false })
);
app.use(bodyParser.json());

app.get("/logo.png", function (request, response) {
  const logoPath = path.join(__dirname, "logo.png");
  response.sendFile(logoPath);
});


//Login route
app.post("/admin/login", function (request, response) {
  let loginName = request.body.l_login_name;
  let loginPassword = request.body.l_password;

  console.log("Login attempted with login name:", loginName);

  if (!loginName) {
    return response.status(400).send("Missing username");
  }

  User.findOne({ login_name: loginName }, function (err, user) {
    if (err || !user) {
      return response.status(400).send("Invalid account");
    }

    if (user.password !== loginPassword) {
      return response.status(400).send("errorMessage: Invalid password");
    }

    request.session.userId = user._id;
    return response.status(200).send({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  });
});

//Logout route
app.post("/admin/logout", function (request, response) {
  if (!request.session.userId) {
    return response.status(400).send("Not logged in");
  }

  request.session.destroy(function (err) {
    if (err) {
      return response.status(500).send("Failed to logout");
    }

    return response.send("Logged out");
  });
});

app.use(function (request, response, next) {
  if (
    !request.session.userId &&
    !request.path.startsWith("/admin") &&
    !request.path.startsWith("/user") &&
    !request.path.startsWith("/workouts") &&
    request.path !== "/logo.png"
  ) {
    return response.status(401).send("Unauthorized");
  }
  next();
});

//User registration route
app.post("/user", function (request, response) {
  const {
    r_login_name,
    r_password,
    r_first_name,
    r_last_name,
    r_coach,
  } = request.body;

  let errorMessage = "Registration Failed: missing ";

  if (!r_password) {
    errorMessage += "Password, ";
  }

  if (!r_first_name) {
    errorMessage += "First Name, ";
  }

  if (!r_last_name) {
    errorMessage += "Last Name";
  }

  if (!r_first_name || !r_last_name || !r_password) {
    return response.status(400).send(errorMessage);
  }

  User.findOne({ login_name: r_login_name }, function (err, user) {
    if (err) {
      return response.status(500).send("Server error");
    }

    if (user) {
      return response.status(400).send("Username taken");
    }

    const newUser = new User({
      login_name: r_login_name,
      password: r_password,
      first_name: r_first_name,
      last_name: r_last_name,
      coach: r_coach,
    });

    newUser.save(function () {
      if (err) {
        return response.status(500).send("Error registering new user");
      }
      request.session.userId = newUser._id;
      return response.status(200).send({
        _id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      });
    });
  });
});

//Comment adding route
app.post("/exerciseComments/:exercise_id", function (request, response) {
  const exerciseId = request.params.exercise_id;
  const commentText = request.body.comment;

  if (!mongoose.Types.ObjectId.isValid(exerciseId) || !commentText) {
    return response.status(400).send("Bad request");
  }

  const comment = {
    comment: commentText,
    user_id: request.session.userId,
    date_time: new Date().toISOString(),
  };

  Exercise.findByIdAndUpdate(
    exerciseId,
    { $push: { comments: comment } },
    { new: true }
  ).exec(function (err, exercise) {
    if (err || !exercise) {
      return response.status(500).send("Server error or Exercise not found");
    }

    return response.status(200).send({ comment: comment, exercise: exercise });
  });
});

//Exercise adding route
app.post("/workouts/new", function (request, response) {
  processFormBody(request, response, function (err) {
    if (err || !request.file) {
      return response.status(400).send("No file in request.");
    }

    const timestamp = new Date().valueOf();
    const filename = "U" + String(timestamp) + request.file.originalname;

    fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
      if (err) {
        return response.status(500).send("Error saving file.");
      }

      const newExercise = new Exercise({
        file_name: filename,
        user_id: request.session.userId,
        comments: [],
        title: request.body.title,
        notes: request.body.notes,
      });

      newExercise.save(function (err) {
        if (err) {
          return response.status(500).send("Error uploading exercise.");
        } else {
          return response
            .status(200)
            .send("Exercise uploaded and saved successfully!");
        }
      });
    });
  });
});


/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 *
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error. We pass it back to the browser with an
        // Internal Service Error (500) error code.
        console.error("Error in /user/info:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object -
        // This is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an
    // async call to each collections. That is tricky to do so we use the async
    // package do the work. We put the collections into array and use async.each
    // to do each .count() query.
    const collections = [
      { name: "user", collection: User },
      { name: "exercise", collection: Exercise },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    response.status(400).send("Bad param " + param);
  }
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", function (request, response) {
  User.find({}, "_id first_name last_name", function (err, users) {
    if (err) {
      console.error("Error in /user/list:", err);
      return response.status(500).send(JSON.stringify(err));
    }
    return response.status(200).send(JSON.stringify(users));
  });
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", function (request, response) {
  const id = request.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).send("Invalid ID");
  }

  User.findOne({ _id: id })
    .select("-__v -login_name -password")
    .exec(function (err, user) {
      if (err) {
        return response.status(500).send("Server error retrieving user data");
      }

      if (user === null) {
        return response.status(400).send("Not found");
      }

      return response.status(200).send(JSON.stringify(user));
    });
});

/**
 * URL /workouts/:id - Returns the Exercises for User (id).
 */
app.get("/workouts/:id", function (request, response) {
  const id = request.params.id;
  //const exercises = cs142models.exerciseModel(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).send("Invalid ID");
  }

  Exercise.find({ user_id: id })
    .select("-__v")
    .populate({
      path: "comments",
      populate: {   
        path: "user_id",
        model: "User",
        select: "_id first_name last_name",
      },
    })
    .exec(function (err, exercises) {
      if (err) {
        return response.status(500).send("Server error retrieving exercise data");
      }

      if (exercises.length === 0 || exercises === null) {
        return response.status(400).send("Not found");
      }

      exercises = exercises.map((exercise) => {
        exercise = exercise.toObject();
        exercise.comments = exercise.comments.map((comment) => {
          comment.user = comment.user_id;
          delete comment.user_id;
          return comment;
        });
        return exercise;
      });

      return response.status(200).send(JSON.stringify(exercises));
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});


const server = app.listen(port, function () {
  console.log(
    "Listening at port:" +
      port +
      " exporting the directory " +
      __dirname
  );
});