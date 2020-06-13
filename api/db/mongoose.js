// This file will handle connection logic to mongoDB database
const mongoose = require("mongoose");
URI = "mongodb://dbowner:dbowner1@ds149404.mlab.com:49404/heroku_xhlthg0t";
var MONGODB_URI = URI || "mongodb://localhost:27017/AgileScrumPlanner";

mongoose.Promise = global.Promise;
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((e) => {
    console.log("Error connecting to MongoDB: " + e);
  });

// Prevent Warnings
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

module.exports = {
  mongoose,
};
