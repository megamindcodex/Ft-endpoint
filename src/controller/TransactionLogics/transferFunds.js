const User = require("../../models/user");
const Finance = require("../../models/userFinance");

const transfer_funds = async (transferParams) => {
  try {
    if (!transferParams) {
      console.error("transferParams is undefined");
      return { success: false, error: "transferParams is undefined" };
    } else {
      for (let key in transferParams) {
        if (transferParams[key] === null) {
          console.error(`property ${key} is null.`);
          return { success: false, error: `property ${key} is null` };
        }
      }
    }

    const { senderUserName, receiverUserName, amount } = transferParams;

    // console.log(senderId, receiverId, amount);

    const senderFinance = await Finance.findOne({ userName: senderUserName });
    const receiverFinance = await Finance.findOne({
      userName: receiverUserName,
    });
    // console.log(sender);
    // console.log(receiver);

    const senderOwealth = senderFinance.wallets.find(
      (wallet) => wallet.type === "Owealth"
    );
    if (!senderOwealth) {
      console.error("sender Owealth not found");
    }
    console.log(senderOwealth);

    const receiverOwealth = receiverFinance.wallets.find(
      (wallet) => wallet.type === "Owealth"
    );
    if (!receiverOwealth) {
      console.error("receiver Owealth not found");
    }
    console.log(receiverOwealth);

    if (senderOwealth.balance <= 0) {
      console.error("Insufficient funds");
      return { success: false, status: 400, error: "Insufficient funds" };
    }

    senderOwealth.balance = Number(senderOwealth.balance) - Number(amount);
    receiverOwealth.balance = Number(receiverOwealth.balance) + Number(amount);

    try {
      await senderFinance.save();
      await receiverFinance.save();
    } catch (err) {
      cosnole.error("Error saving Finance document:", err, err.mssage);
    }

    console.log(senderOwealth);
    console.log(receiverOwealth);
    return { success: true, status: 200, data: "Transaction completed" };
  } catch (err) {
    console.error(
      "Error sending funds at transferFunds.js file",
      err.message,
      err
    );
  }
};

module.exports = { transfer_funds };
