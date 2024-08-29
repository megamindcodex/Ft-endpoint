const User = require("../../models/user");
const Transaction = require("../../models/Transaction");

const get_user_transactions = async (userId) => {
  try {
    if (!userId) {
      console.error("UserId is required");
      return { sucess: false, status: 400, error: "UserId is required" };
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return { success: false, status: 404, error: "user not found" };
    }
    // console.log(`userName: ${user.userName}`);

    const transactions = await Transaction.findOne({ userName: user.userName });

    if (!transactions) {
      console.group("Transaction not found", transactions.messages);
      return { success: false, status: 404, error: "Transaction not found" };
    }

    // console.log(`User transaction found: ${transactions.messages}`);

    return {
      success: true,
      status: 200,
      data: transactions.messages,
      test: transactions.userName
    };
  } catch (err) {
    console.error("couldn't get user transactions", err, err.message);
  }
};

module.exports = { get_user_transactions };
