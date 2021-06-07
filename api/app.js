const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

// Set Port
app.set("port", process.env.PORT || 5000);

// Listen
app.listen(process.env.PORT || 5000);

// Load in mongoose models
const { Sprint, Story, Task, User } = require("./db/models/index");

// Load Middlewear
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id"
  );

  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token"
  );

  next();
});

let authenticate = (req, res, next) => {
  // Checks if the given http request is authenticated
  let token = req.header("x-access-token");

  // Verify JWT
  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
    if (err) {
      // JWT is invalid - do not authenticate
      res.status(401).send(err);
    } else {
      req.user_id = decoded._id;
      next();
    }
  });
};

// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
  // grab the refresh token from the request header
  let refreshToken = req.header("x-refresh-token");

  // grab the _id from the request header
  let _id = req.header("_id");

  User.findByIdAndToken(_id, refreshToken)
    .then((user) => {
      if (!user) {
        // user couldn't be found
        return Promise.reject({
          error:
            "User not found. Make sure that the refresh token and user id are correct",
        });
      }

      // if the code reaches here - the user was found
      // therefore the refresh token exists in the database - but we still have to check if it has expired or not

      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.sessions.forEach((session) => {
        if (session.token === refreshToken) {
          // check if the session has expired
          if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
            // refresh token has not expired
            isSessionValid = true;
          }
        }
      });

      if (isSessionValid) {
        // the session is VALID - call next() to continue with processing this web request
        next();
      } else {
        // the session is not valid
        return Promise.reject({
          error: "Refresh token has expired or the session is invalid",
        });
      }
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

// Make sure Server is working
app.get("/", (req, res) => {
  res.send("Server Running");
});
/* Route Handlers*/

/*
 * GET /sprints
 * Purpose: Get all sprints
 */
app.get("/sprints", authenticate, (req, res) => {
  Sprint.find({
    _userId: req.user_id,
  }).then((sprints) => {
    return res.send(sprints);
  });
});

/**
 * POST /sprints
 * Purpose: Adds new sprint and returns it with a ID
 */
app.post("/sprints", authenticate, (req, res) => {
  let title = req.body.title;

  let newSprint = new Sprint({
    title,
    _userId: req.user_id,
  });

  newSprint.save().then((sprintDoc) => {
    res.send(sprintDoc);
  });
});

/**
 * PATCH /sprints/:id
 * Purpose: Updates a specified sprint by ID
 */
app.patch("/sprints/:id", authenticate, (req, res) => {
  Sprint.findOneAndUpdate(
    { _id: req.params.id, _userId: req.user_id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.sendStatus(200);
  });
});

/**
 * DELETE /sprints/:id
 * Purpose: Deletes a specified sprint by its unique ID
 */
app.delete("/sprints/:id", authenticate, (req, res) => {
  Sprint.findOneAndDelete(
    { _id: req.params.id, _userId: req.user_id },
    {
      $set: req.body,
    }
  ).then((removedSprint) => {
    res.send(removedSprint);

    // Also delete the stories associated with the sprint
    deleteStoriesFromSprint(removedSprint._id);
  });
});

/* GET /sprints/:sprintId/stories
 * Purpose: Get all stories for a list
 */
app.get("/sprints/:sprintId/stories", authenticate, (req, res) => {
  Story.find({ _sprintId: req.params.sprintId }).then((stories) => {
    return res.send(stories);
  });
});

/* GET /sprints/:sprintId/stories/:storyId
 * Purpose: Get one story based on sprint and story ID
 */
app.get("/sprints/:sprintId/stories/:storyId", authenticate, (req, res) => {
  Story.findOne({
    _id: req.params.storyId,
    _sprintId: req.params.sprintId,
  }).then((story) => {
    return res.send(story);
  });
});

/**
 * POST /sprints/:sprintId/stories
 * Purpose: Adds new story and returns it with a ID
 */
app.post("/sprints/:sprintId/stories", authenticate, (req, res) => {
  Sprint.findOne({
    // Make sure that the requesting user is the same
    // as the one that logged in
    _id: req.params.sprintId,
    _userId: req.user_id,
  })
    .then((sprint) => {
      if (sprint) {
        // We have a valid authenticated sprint
        return true;
      }
      return false;
    })
    .then((canCreateStory) => {
      if (canCreateStory) {
        let newStory = new Story({
          title: req.body.title,
          _sprintId: req.params.sprintId,
        });
        newStory.save().then((newStoryDoc) => {
          res.send(newStoryDoc);
        });
      } else {
        res.sendStatus(404);
      }
    });
});

/**
 * PATCH /sprints/:sprintId/stories/:storyId
 * Purpose: Updates a specified story by ID
 */
app.patch("/sprints/:sprintId/stories/:storyId", authenticate, (req, res) => {
  Sprint.findOne({
    // Make sure that the requesting user is the same
    // as the one that logged in
    _id: req.params.sprintId,
    _userId: req.user_id,
  })
    .then((sprint) => {
      if (sprint) {
        // We have a valid user
        return true;
      }
      return false;
    })
    .then((canUpdateStory) => {
      if (canUpdateStory) {
        Story.findOneAndUpdate(
          { _id: req.params.storyId, _sprintId: req.params.sprintId },
          {
            $set: req.body,
          }
        ).then(() => {
          res.sendStatus(200);
        });
      } else {
        res.sendStatus(404);
      }
    });
});

/**
 * DELETE /sprints/:sprintId/stories/:storyId
 * Purpose: Deletes a specified story by its unique ID
 */
app.delete("/sprints/:sprintId/stories/:storyId", authenticate, (req, res) => {
  Sprint.findOne({
    // Make sure that the requesting user is the same
    // as the one that logged in
    _id: req.params.sprintId,
    _userId: req.user_id,
  })
    .then((sprint) => {
      if (sprint) {
        // We have a valid user
        return true;
      }
      return false;
    })
    .then((canDeleteStory) => {
      if (canDeleteStory) {
        Story.findOneAndDelete(
          {
            _id: req.params.storyId,
            _sprintId: req.params.sprintId,
          },
          {
            $set: req.body,
          }
        ).then((removedStoryDoc) => {
          res.send(removedStoryDoc);
          deleteTasksFromStory(removedStoryDoc._id);
        });
      } else {
        res.sendStatus(404);
      }
    });
});

// Tasks

/* GET /sprints/:sprintId/stories/:storyId/tasks
 * Purpose: Get all tasks for a story
 */
app.post(
  "/sprints/:sprintId/stories/:storyId/tasks/get",
  authenticate,
  (req, res) => {
    Task.find({
      _sprintId: req.params.sprintId,
      _storyId: req.params.storyId,
      state: req.body.state,
    }).then((tasks) => {
      return res.send(tasks);
    });
  }
);

/**
 * POST /sprints/:sprintId/stories/:storyId/tasks/
 * Purpose: Adds new task and returns it with a ID
 */

app.post(
  "/sprints/:sprintId/stories/:storyId/tasks/add",
  authenticate,
  (req, res) => {
    Sprint.findOne({
      // Make sure that the requesting user is the same
      // as the one that logged in
      _id: req.params.sprintId,
      _userId: req.user_id,
    })
      .then((sprint) => {
        if (sprint) {
          // We have a valid authenticated sprint
          return true;
        }
        return false;
      })
      .then((canCreateTask) => {
        if (canCreateTask) {
          let newTask = new Task({
            title: req.body.title,
            state: req.body.state,
            assignedName: req.body.assignedName,
            hours: req.body.hours,
            _storyId: req.params.storyId,
            _sprintId: req.params.sprintId,
          });

          newTask.save().then((newTaskDoc) => {
            res.send(newTaskDoc);
          });
        } else {
          res.sendStatus(404);
        }
      });
  }
);

/**
 * PATCH /sprints/:sprintId/stories/:storyId/tasks/:state
 * Purpose: Copys a task and moves it by changing the state
 */
app.patch(
  "/sprints/:sprintId/stories/:storyId/tasks/:taskId",
  authenticate,
  (req, res) => {
    Sprint.findOne({
      // Make sure that the requesting user is the same
      // as the one that logged in
      _id: req.params.sprintId,
      _userId: req.user_id,
    })
      .then((sprint) => {
        if (sprint) {
          // We have a valid authenticated sprint
          return true;
        }
        return false;
      })
      .then((canUpdateTask) => {
        if (canUpdateTask) {
          Task.findOneAndUpdate(
            {
              _id: req.params.taskId,
              _storyId: req.params.storyId,
              _sprintId: req.params.sprintId,
            },
            {
              $set: req.body,
            },
            {
              returnOriginal: false,
            }
          ).then((updatedTask) => {
            res.send(updatedTask);
          });
        } else {
          res.sendStatus(404);
        }
      });
  }
);

/**
 * DELETE /sprints/:sprintId/stories/:storyId/tasks/:taskId
 * Purpose: Deletes a specified task by its unique ID
 */
app.delete(
  "/sprints/:sprintId/stories/:storyId/tasks/:taskId",
  authenticate,
  (req, res) => {
    Sprint.findOne({
      // Make sure that the requesting user is the same
      // as the one that logged in
      _id: req.params.sprintId,
      _userId: req.user_id,
    })
      .then((sprint) => {
        if (sprint) {
          // We have a valid user
          return true;
        }
        return false;
      })
      .then((canUpdateTask) => {
        if (canUpdateTask) {
          Task.findOneAndDelete(
            {
              _id: req.params.taskId,
              _sprintId: req.params.sprintId,
              _storyId: req.params.storyId,
            },
            {
              $set: req.body,
            }
          ).then((removedTaskDoc) => {
            res.send(removedTaskDoc);
          });
        } else {
          res.sendStatus(404);
        }
      });
  }
);
// User routes

/**
 * POST /users
 * Purpose: Signs a user up and saves it
 */
app.post("/users", (req, res) => {
  // User sign up

  let body = req.body;
  let newUser = new User(body);

  User.findOne({ username: body.username }).then((user) => {
    // If the user with the username already exists return a 403
    if (user) return res.send({ message: 403 });
    else {
      newUser
        .save()
        .then(() => {
          return newUser.createSession();
        })
        .then((refreshToken) => {
          // Session created successfully - refreshToken returned.
          // now we geneate an access auth token for the user

          return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken };
          });
        })
        .then((authTokens) => {
          // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
          res
            .header("x-refresh-token", authTokens.refreshToken)
            .header("x-access-token", authTokens.accessToken)
            .send(newUser);
        })
        .catch((e) => {
          res.status(400).send(e);
        });
    }
  });
});

/**
 * POST /users/login
 * Purpose: Login
 */
app.post("/users/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findByCredentials(username, password)
    .then((user) => {
      if (user) {
        return user
          .createSession()
          .then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
              // access auth token generated successfully, now we return an object containing the auth tokens
              return { accessToken, refreshToken };
            });
          })
          .then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
              .header("x-refresh-token", authTokens.refreshToken)
              .header("x-access-token", authTokens.accessToken)
              .send(user);
          });
      } else {
        res.send({ message: 404 });
      }
    })
    .catch((e) => {
      res.sendStatus(400);
    });
});

/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
app.get("/users/me/access-token", verifySession, (req, res) => {
  // we know that the user/caller is authenticated and we have the user_id and user object available to us
  req.userObject
    .generateAccessAuthToken()
    .then((accessToken) => {
      res.header("x-access-token", accessToken).send({ accessToken });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

// Helper methods

let deleteStoriesFromSprint = (_sprintId) => {
  Story.find({ _sprintId }).then((stories) => {
    stories.forEach((story) => {
      deleteTasksFromStory(story._id);
    });
  });
  Story.deleteMany({
    _sprintId,
  }).then(() => {});
};

let deleteTasksFromStory = (_storyId) => {
  Task.deleteMany({
    _storyId,
  }).then(() => {});
};

app.listen(3000, () => {
  console.log("Server Started.");
});
