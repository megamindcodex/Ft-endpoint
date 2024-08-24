const Transaction = require("../../models/Transaction");
// const User = require("../../models/user");

const generateReceipt = async (transactionParams) => {
  try {
    if (!transactionParams) {
      console.error("transferParams is undefined");
      return {
        success: false,
        status: 400,
        error: "transferParams is undefined",
      };
    } else {
      for (let key in transactionParams) {
        if (transactionParams[key] === null) {
          console.error(`property ${key} is null.`);
          return {
            success: false,
            status: 400,
            error: `property ${key} is null`,
          };
        }
      }
    }

    const {
      id,
      type,
      sender,
      senderAccount,
      receiver,
      receiverAccount,
      amount,
      description,
      timestamp,
      transactionId,
      owner,
    } = transactionParams;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      console.error("couldn't find transaction", transaction);
      return {
        success: false,
        status: 404,
        error: "Couldn't find transaction",
      };
    }

    if (owner === "sender") {
      transaction.messages.push({
        type: type,
        status: "successful",
        subject: `Send to ${receiver.toUpperCase()}`,
        sender: sender,
        senderAccount: senderAccount,
        receiver: receiver,
        receiverAccount: receiverAccount,
        amount: `${amount}`,
        decription: description,
        timestamp: timestamp,
        transactionId: transactionId,
      });
    }

    if (owner === "receiver") {
      transaction.messages.push({
        type: type,
        status: "successful",
        subject: `Received from ${sender.toUpperCase()}`,
        sender: sender,
        senderAccount: senderAccount,
        receiver: receiver,
        receiverAccount: receiverAccount,
        amount: `${amount}`,
        decription: description,
        timestamp: timestamp,
        transactionId: transactionId,
      });
    }

    await transaction.save();
    // console.log(transaction.messages[transaction.messages.length - 1]);
    return transaction.messages[transaction.messages.length - 1];
  } catch (err) {
    console.error(
      "Error generating transaction receipt in generateReceipt.js",
      err.message,
      err
    );
    return {
      success: false,
      status: 500,
      error: "Error generating transaction receipt in generateReceipt.js",
      err,
    };
  }
};

module.exports = { generateReceipt };
