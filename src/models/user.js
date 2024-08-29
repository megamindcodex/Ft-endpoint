const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  // gender: {
  //   type: String,
  //   required: true,
  // },
  // birth: {
  //   month: { type: Number, required: true },
  //   day: { type: Number, required: true },
  //   year: { type: Number, required: true },
  // },
  password: {
    type: String,
    required: true,
  },
  _resetCode: {
    type: String,
  },
  finances: {
    // Array of references to Finance documents
    type: mongoose.Schema.Types.ObjectId,
    ref: "Finance", // Reference to the Finance model
  },
  transactions: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction", // Reference to the Transaction model
  },
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification", // Reference to the Notification model
  },
  accountNumber: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
