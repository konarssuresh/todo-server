const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 200,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

todoSchema.index({ userId: 1 });

const Todo = mongoose.model("Todo", todoSchema);

module.exports = { Todo };
