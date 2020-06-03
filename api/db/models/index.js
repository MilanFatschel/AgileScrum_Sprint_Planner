// Load in mongoose models
const { Sprint } = require("./sprint.model");
const { Story } = require("./story.model");
const { User } = require("./user.model");
const { Task } = require("./task.model");

module.exports = {
  Sprint,
  Story,
  User,
  Task,
};
