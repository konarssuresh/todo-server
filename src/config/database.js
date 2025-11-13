const mongoose = require("mongoose");

const connectToDb = async () => {
  return mongoose.connect(
    "mongodb+srv://test:test@syncnotecluster.nriknl9.mongodb.net/ToDo"
  );
};

module.exports = { connectToDb };
