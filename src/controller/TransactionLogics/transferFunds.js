const Transaction = require("../../models/Transaction");
const Finance = require("../../models/userFinance");
const { generateReceipt } = require("../TransactionLogics/generateReceipt");
const crypto = require("crypto");

// const mongoose = require("mongoose");

const transfer_funds = async (transferParams) => {
  try {
    if (!transferParams) {
      return {
        success: false,
        status: 400,
        error: "transferParams is undefine",
      };
    }

    const { senderFinanceId, receiverFinanceId, amount } = transferParams;

    // console.log(senderId, receiverId, amount);

    const senderFinance = await Finance.findById(senderFinanceId);
    const receiverFinance = await Finance.findById(receiverFinanceId);

    //  check if mainBalance is less than amount to be sent
    if (senderFinance.mainBalance < amount) {
      return { success: false, status: 400, error: "Inssuficient funds!" };
    }

    // check if daily transaction limit is reached
    if (
      senderFinance.dailyTransaction === senderFinance.dailyTransactionLimit
    ) {
      console.log(
        `Daily transaction Limit reached. upgrade your account to increase your transaction limit`
      );
      return {
        success: false,
        status: 400,
        error: `Daily transaction Limit reached. upgrade your account to increase your transaction limit`,
      };
    }

    // check if Amount to be sent exceed Dailt Tranaction Limit
    if (senderFinance.dailyTransactionLimit < amount) {
      console.log(
        `your daily Transaction is ${senderFinance.dailyTransactionLimit}. Upgrade your transaction Limit.`
      );
      return {
        success: false,
        status: 400,
        error: `your daily Transaction is ${senderFinance.dailyTransactionLimit}. Upgrade your transaction Limit.`,
      };
    }

    senderFinance.mainBalance -= Number(amount);
    senderFinance.dailyTransaction += Number(amount);

    receiverFinance.mainBalance += Number(amount);

    try {
      const senderFinanceResult = await senderFinance.save();
      const receiverFinanceResult = await receiverFinance.save();
    } catch (err) {
      console.error(
        "Error occurred while processing transaction in transferFund.js ",
        err.message,
        err
      );
      return { success: false, status: 500, error: err };
    }

    const transactionId = generateTransactionId();

    const senderParams = {
      id: senderFinance.transactionId,
      userName: senderFinance.userName,
      type: "debit",
      from: senderFinance.userName,
      receiver: receiverFinance.userName,
      amount: amount,
      date: Date.now(),
      transactionId: transactionId,
    };

    const receiverParams = {
      id: receiverFinance.transactionId,
      userName: receiverFinance.userName,
      type: "credit",
      from: senderFinance.userName,
      receiver: receiverFinance.userName,
      amount: amount,
      date: Date.now(),
      transactionId: transactionId,
    };
    const senderReceipt = await generateReceipt(senderParams);
    const receiverReceipt = await generateReceipt(receiverParams);

    if (!senderReceipt) {
      return {
        success: false,
        status: 404,
        error: "couldn't find sender receipt",
      };
    }
    if (!receiverReceipt) {
      return {
        success: false,
        status: 404,
        error: "couldn't find Receiver receipt",
      };
    }

    return {
      success: true,
      status: 200,
      data: { message: "Transaction successfull", receipt: senderReceipt },
    };
  } catch (err) {
    console.error(
      "Error sending funds at transferFunds.js file",
      err.message,
      err
    );
  }
};

const generateTransactionId = () => {
  // Generate 10 random bytes (enough for 20 digits)
  const buffer = crypto.randomBytes(20);

  // Convert each byte to a digit (0-9) by taking modulo 10
  const digits = Array.from(buffer, (byte) => (byte % 10).toString());

  // Join the digits into a single string
  return digits.join("");
};

module.exports = { transfer_funds };
