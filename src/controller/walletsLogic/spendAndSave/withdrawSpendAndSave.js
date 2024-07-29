const User = require("../../../models/user");
const Finance = require("../../../models/userFinance");

const withdraw_spend_and_save = async (userId, spendAndSaveParams) => {
  try {
    if (!userId) {
      return {
        success: false,
        status: 400,
        error: "userId is undefined or null",
      };
    }

    if (!spendAndSaveParams) {
      console.error("spendAndSaveParams is undefined");
      return {
        success: false,
        status: 400,
        error: "spendAndSaveParams is undefined",
      };
    } else {
      for (let key in spendAndSaveParams) {
        if (spendAndSaveParams[key] === null) {
          console.error(`property ${key} is null.`);
          return {
            success: false,
            status: 400,
            error: `property ${key} is null`,
          };
        }
      }
    }

    const { amount, destination } = spendAndSaveParams;

    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found");
      return { success: false, status: 404, error: "user not found" };
    }
    const userFinance = await Finance.findById(user.finances);
    // console.log(userFinance);

    if (!userFinance) {
      console.log("User Finance not found");
      return { success: false, status: 404, error: "user Finance not found" };
    }

    const spendAndSave = userFinance.wallets[0].spendAndSave;

    // transfer from spend & save to cashBox wallet if destination parameters is equal to "cashBox"
    if (destination === "cashBox") {
      const cashBox = userFinance.wallets[0].cashBox;

      spendAndSave.balance -= Number(spendAndSaveParams.amount);
      cashBox.balance += Number(amount);

      await userFinance.save();

      return {
        success: true,
        status: 200,
        data: `withdrawal of ${amount} from spend & save to cashBox balance`,
      };
    }
    if (destination === "mainBalance") {
      // transfer from spend & save to main balance if destination parameters is equal to "mainBalance"
      spendAndSave.balance -= Number(spendAndSaveParams.amount);
      userFinance.mainBalance += Number(amount);

      await userFinance.save();

      return {
        success: true,
        status: 200,
        data: `withdrawal of ${amount} from spend & save to main balance`,
      };
    }
  } catch (err) {
    console.error("error withdrawing spend and save", err);
    return {
      success: false,
      status: 500,
      error: "Internal server Error: error withdrawing spend and save",
    };
  }
};

module.exports = { withdraw_spend_and_save };
