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

    const { id, userName, type, from, receiver, amount, date, transactionId } =
      transactionParams;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      console.error("couldn't find transaction", transaction);
      return {
        success: false,
        status: 404,
        error: "Couldn't find transaction",
      };
    }

    transaction.messages.push({
      type: type,
      status: "pending",
      subject: `Transfer from ${userName} to ${receiver}`,
      from: from,
      receiver: receiver,
      ammount: `${amount}`,
      decription: "",
      date: date,
      transactionId: transactionId,
    });

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
