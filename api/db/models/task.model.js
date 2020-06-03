const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
  },
  assignedName: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  _sprintId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  _storyId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = { Task };
