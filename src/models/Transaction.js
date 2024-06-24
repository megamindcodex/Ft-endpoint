const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["debit", "credit", "transfer"], // Example values
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "successfull", "failed"], // Example values
    },
    subject: {
      type: String,
      required: true,
    },
    amount: {
      type: String, // Use Number for numeric values
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    transaction_date: {
      type: Date, // Use Date for timestamps
      required: true,
    },
  },
  {
    _id: false, // Disables the automatic creation of _id for this sub-document
  }
);

const transactionSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  messages: [messageSchema],
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
