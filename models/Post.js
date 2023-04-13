const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 4,
    },
    description: {
      type: String,
      required: true,
      min: 8,
    },
    likes: {
      type: [String],
      default: [],
    },
    userId: {
      type: String,
      required: true,
    },
    comment: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
