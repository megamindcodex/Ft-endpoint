const Finance = require("../../../models/userFinance");

const save_to_cashBox = async (dataParams) => {
  try {
    if (!dataParams) {
      console.log("dataParams is undefined or required");
      return {
        success: false,
        status: 400,
        error: "dataParams is undefined or required",
      };
    }
    const { amount, financeId } = dataParams;

    const userFinance = await Finance.findById(financeId);

    if (!userFinance) {
      return { sucess: false, status: 404, error: "User Finance not found" };
    }

    const cashBox = userFinance.wallets[0].cashBox;

    if (userFinance.mainBalance < amount) {
      return {
        success: false,
        status: 400,
        error: "Insufficient funds available in main balance",
      };
    }

    userFinance.mainBalance -= Number(amount);
    cashBox.balance += Number(amount);

    await userFinance.save();
    console.log(`cashBok balance updated to ${cashBox.balance}`);

    return {
      sucess: true,
      status: 200,
      error: `cashBok balance updated to ${cashBox.balance}`,
    };
  } catch (err) {
    const errMsg = err.message;
    console.log("internal server error: ", err);
    return {
      success: false,
      status: 500,
      error: "internal server error",
      errMsg,
    };
  }
};

module.exports = { save_to_cashBox };
