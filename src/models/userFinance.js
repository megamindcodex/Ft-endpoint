const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  wallets: {
    type: Array,
    required: true,
  },
  transactions: {
    type: mongoose.Schema.Types.ObjectId,
    reference: "Transaction",
  },
});

const Finance = mongoose.model("Finance", financeSchema);

module.exports = Finance;
