const mongoose = require("mongoose");

const cashBox = {
  balance: {
    type: Number,
    default: 0,
  },
  dailyInterest: {
    type: Number,
    required: true,
  },
  totalInterest: {
    type: Number,
    require: true,
  },
  autoSave: {
    type: Boolean,
    required: true,
    default: false,
  },
};

const safeBox = {
  balance: {
    type: Number,
    required: true,
  },
  dailyInterest: {
    type: Number,
    required: true,
  },
  totalInterest: {
    type: Number,
    required: true,
  },
  autoSave: {
    type: Boolean,
    required: true,
  },
  lastAutoSaved: {
    type: Date,
    required: true,
  },
};

const spendAndSave = {
  balance: {
    type: Number,
    default: 0,
  },
  activated: {
    type: Boolean,
    required: true,
    default: false,
  },
  percentage: {
    type: Number,
    default: 0,
  },
};

const fixedSaving = {
  balance: {
    type: Number,
    default: 0,
  },
  activated: {
    type: Boolean,
    default: false,
  },
};
const targetSaving = {
  activated: {
    type: Boolean,
    default: 0,
  },
  tragets: [
    {
      // Not available yet
    },
  ],
};

const financeSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  mainBalance: {
    type: Number,
    default: 0,
  },
  wallets: [
    {
      cashBox: cashBox,
      safeBox: safeBox,
      spendAndSave: spendAndSave,
      fixedSaving: fixedSaving,
      targetSaving: targetSaving,
    },
  ],
  dailyTransaction: {
    type: Number,
    required: true,
  },
  dailyTransactionLimit: {
    type: Number,
    required: true,
  },
  dailyTransactionLastResetDate: {
    type: Date,
    required: true,
  },
  locationMismatch: {
    type: Boolean,
    required: true,
  },
  suspended: {
    type: Boolean,
    required: true
  }
});

const Finance = mongoose.model("Finance", financeSchema);

module.exports = Finance;
