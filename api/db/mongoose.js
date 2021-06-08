// This file will handle connection logic to mongoDB database
const mongoose = require("mongoose");
URI =
  "mongodb://milanfatschel:milanfatschel@cluster0-shard-00-00.3yu4y.mongodb.net:27017,cluster0-shard-00-01.3yu4y.mongodb.net:27017,cluster0-shard-00-02.3yu4y.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-6mo5ew-shard-0&authSource=admin&retryWrites=true&w=majority";
// var URI = "mongodb://localhost:27017/AgileScrumPlanner";
var MONGODB_URI = URI;

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
