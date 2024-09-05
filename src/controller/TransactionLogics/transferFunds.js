const { timeStamp } = require("console");
const Transaction = require("../../models/Transaction");
const Finance = require("../../models/userFinance");
const { generateReceipt } = require("../TransactionLogics/generateReceipt");
const crypto = require("crypto");
const addNotification = require("../../controller/TransactionLogics/notificationLogic")

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

    const { senderAccount, receiverAccount, senderFinanceId, receiverFinanceId, amount, description } =
      transferParams;

    // console.log(senderId, receiverId, amount);

    const senderFinance = await Finance.findById(senderFinanceId);
    const receiverFinance = await Finance.findById(receiverFinanceId);

    if (senderFinance.locationMismatch === true) {
      console.log("location mismatch")
      return { success: false, status: 400, error: "Transaction failed due to device location Mismatch" }
    }

    //  check if mainBalance is less than amount to be sent
    if (senderFinance.mainBalance < amount) {
      return { success: false, status: 400, error: "Insuficient funds!" };
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
    // top up daily transaction
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
      id: senderFinance._id,
      userName: senderFinance.userName,
      type: "debit",
      sender: senderFinance.userName,
      senderAccount: senderAccount,
      receiver: receiverFinance.userName,
      receiverAccount: receiverAccount,
      amount: amount,
      description: description,
      timestamp: new Date().toISOString(),
      transactionId: transactionId,
      owner: "sender",
    };

    const receiverParams = {
      id: receiverFinance._id,
      userName: receiverFinance.userName,
      type: "credit",
      sender: senderFinance.userName,
      senderAccount: senderAccount,
      receiver: receiverFinance.userName,
      receiverAccount: receiverAccount,
      amount: amount,
      description: description,
      timestamp: new Date().toISOString(),
      transactionId: transactionId,
      owner: "receiver",
    };

    const senderReceipt = await generateReceipt(senderParams);
    const receiverReceipt = await generateReceipt(receiverParams);

    if (!senderReceipt) {
      return {
        success: false,
        status: 500,
        error: "couldn't generate sender receipt",
      };
    }

    if (!receiverReceipt) {
      return {
        success: false,
        status: 500,
        error: "couldn't generate Receiver receipt",
      };
    }

    // add notification for the Receiver to the database
    const receiverNotificationData = {
      title: "Incoming Transafer Successfull",
      subject: `${senderFinance.userName} has sent you $${amount}`,
      subjectId: receiverReceipt.transactionId,
      read: false,
      newMessage: true
    }

    const receiverNotification = await addNotification(receiverNotificationData, receiverFinance.userName)
    // console.log(receiverNotification)


    return {
      success: true,
      status: 200,
      data: { message: "Transaction successfull" },
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
