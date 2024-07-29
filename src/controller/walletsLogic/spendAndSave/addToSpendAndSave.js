// const User = require("../../models/user");
const Finance = require("../../../models/userFinance");

const add_to_spend_and_save = async (spendAndSaveParams) => {
  try {
    if (!spendAndSaveParams) {
      console.error("spendAndSaveParams is undefined");
      return {
        success: false,
        status: 400,
        error: "spendAndSaveParams is undefined",
      };
    }

    const { fundSpent, financeId } = spendAndSaveParams;

    const userFinance = await Finance.findById(financeId);

    if (!userFinance) {
      return { success: false, status: 404, error: "userFinance not found" };
    }

    const spendAndSave = userFinance.wallets[0].spendAndSave;
    const percentage = spendAndSave.percentage;

    const saveRatio = await calculateSaveRatio(fundSpent, percentage);
    userFinance.mainBalance -= saveRatio;
    spendAndSave.balance += saveRatio;

    await userFinance.save();

    return {
      success: true,
      status: 200,
      data: `${saveRatio} was added to Spend and Save`,
    };
  } catch (err) {
    console.error("Internal Server Error at addToSpenAndSave.js", err);
    return {
      success: false,
      status: 500,
      error: "Internal Server Error at addToSpenAndSave.js",
      err,
      err,
    };
  }
};

const calculateSaveRatio = async (fundSpent, percentage) => {
  const result = (Number(fundSpent) * Number(percentage)) / 100;
  // console.log(result);
  return result;
};

module.exports = { add_to_spend_and_save };
