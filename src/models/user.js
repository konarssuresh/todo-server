const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid emmail");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Not a strong password");
        }
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateHash = async function (inputPasswd) {
  const hashedPassword = await bcrypt.hash(
    inputPasswd,
    Number(process.env.ENCRYPT_ROUNDS)
  );

  this.password = hashedPassword;
};

userSchema.methods.comparePassword = async function (inputPasswd) {
  let storedPasswd = this.password;

  return await bcrypt.compare(inputPasswd, storedPasswd);
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
