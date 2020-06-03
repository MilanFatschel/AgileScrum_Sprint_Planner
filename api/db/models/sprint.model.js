const mongoose = require("mongoose");

const SprintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
  },
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Sprint = mongoose.model("Sprint", SprintSchema);

module.exports = { Sprint };
