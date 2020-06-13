// This file will handle connection logic to mongoDB database
const mongoose = require("mongoose");

var MONGODB_URI =
  process.env.MONGODB_URL || "mongodb://localhost:27017/AgileScrumPlanner";

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
