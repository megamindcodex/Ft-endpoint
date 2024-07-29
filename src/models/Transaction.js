const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  messages: {
    type: Array,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
// {
//   type: {
//     type: String,
//     required: true,
//     enum: ["debit", "credit", "transfer"], // Example values
//   },
//   status: {
//     type: String,
//     required: true,
//     enum: ["pending", "successfull", "failed"], // Example values
//   },
//   subject: {
//     type: String,
//     required: true,
//   },
//   amount: {
//     type: String, // Use Number for numeric values
//     required: true,
//   },
//   from: {
//     type: String,
//     required: true,
//   },
//   receiver: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//   },
//   transaction_date: {
//     type: Date, // Use Date for timestamps
//     required: true,
//   },
// },
