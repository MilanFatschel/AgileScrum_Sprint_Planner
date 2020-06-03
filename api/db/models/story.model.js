const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
  },
  _sprintId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Story = mongoose.model("Story", StorySchema);

module.exports = { Story };
