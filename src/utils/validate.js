const validator = require("validator");

const checkAllowedKeys = (req, keys) => {
  const { body } = req;

  Object.keys(body).forEach((key) => {
    if (!keys.includes(key)) {
      throw new Error("invalid key " + key + " in request");
    }
  });
};
const validateSignupReq = (req) => {
  const KEYS = ["firstName", "lastName", "emailId", "password"];
  checkAllowedKeys(req, KEYS);

  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName) {
    throw new Error("firstName is required");
  }
  if (!lastName) {
    throw new Error("lastName is required");
  }
  if (!emailId) {
    throw new Error("emailId is required");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("not a valid email");
  }
  if (!password) {
    throw new Error("password is required");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Not a strong password");
  }
};

const validateLoginRequest = (req) => {
  const KEYS = ["emailId", "password"];
  checkAllowedKeys(req, KEYS);

  const { emailId, password } = req.body;
  if (!emailId) {
    throw new Error("emailId is required");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("not a valid email");
  }
  if (!password) {
    throw new Error("password is required");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Not a strong password");
  }
};

const validateCreateTodo = (req) => {
  const KEYS = ["title", "completed"];
  checkAllowedKeys(req, KEYS);

  const { title } = req.body;
  if (!title) {
    throw new Error("title is required");
  }
};

module.exports = {
  validateSignupReq,
  validateLoginRequest,
  validateCreateTodo,
};
