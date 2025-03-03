const mongoose = require("mongoose");

const connectDB = (url) => {
  console.log(url);
  return mongoose.connect(url, { useUnifiedTopology: true });
};

module.exports = connectDB;
