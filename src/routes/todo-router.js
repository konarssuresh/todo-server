const express = require("express");
const validator = require("validator");
const { validateUser } = require("../middleware/auth");
const { validateCreateTodo } = require("../utils/validate");
const { Todo } = require("../models/todo");

const todoRouter = express.Router();

const USER_ALLOWED_FIELDS = ["firstName", "lastName"];

todoRouter.get("/todo", validateUser, async (req, res) => {
  try {
    const user = req.user;
    const todos = await Todo.find({ userId: user._id.toString() }).populate(
      "userId",
      USER_ALLOWED_FIELDS
    );
    res.json(todos);
  } catch (e) {
    res.status(400).send({ message: e?.message });
  }
});

todoRouter.post("/todo", validateUser, async (req, res) => {
  try {
    validateCreateTodo(req);

    const user = req.user;
    const { title, completed = false } = req.body;

    const todos = await Todo.find({ userId: user._id.toString() });

    let order = 0;

    for (let i = 0; i < todos.length; i++) {
      order = Math.max(order, todos[i].order);
    }

    let todo = new Todo({
      title,
      completed,
      order: order + 1,
      userId: user._id,
    });
    let data = await todo.save();
    res.status(201).json(data);
  } catch (e) {
    res.status(400).send({ message: e?.message });
  }
});

todoRouter.post("/todo/:id/:completed", validateUser, async (req, res) => {
  try {
    const { completed, id } = req.params;
    const allowedKeys = ["done", "undone"];

    if (!allowedKeys.includes(completed)) {
      throw new Error("invalid value in route param");
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      throw new Error("Item does not exists");
    }

    if (todo.userId.toString() !== req.user._id.toString()) {
      throw new Error("Item does not exitst for the user");
    }

    if (completed === "done") {
      todo.completed = true;
    }
    if (completed === "undone") {
      todo.completed = false;
    }

    const data = await todo.save();
    res.send(data);
  } catch (e) {
    res.status(400).json({ message: e?.message });
  }
});

todoRouter.delete("/todo/:id", validateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      throw new Error("Item does not exists");
    }

    if (todo.userId.toString() !== req.user._id.toString()) {
      throw new Error("Item does not exitst for the user");
    }

    await todo.deleteOne({ _id: id.toString() });
    res.json({ message: "delete successful" });
  } catch (e) {
    res.status(400).json({ message: e?.message });
  }
});

module.exports = todoRouter;
