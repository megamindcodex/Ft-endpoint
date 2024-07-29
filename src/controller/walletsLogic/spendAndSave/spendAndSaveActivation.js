const User = require("../../../models/user");
const Finance = require("../../../models/userFinance");

// spend and save de Activation Logic
const toggle_spend_and_save_activation = async (userId, spendAndSaveParams) => {
  try {
    if (!spendAndSaveParams) {
      return {
        success: false,
        status: 400,
        error: "spendAndSaveParams is null undefined",
      };
    }

    const { percentage, activate } = spendAndSaveParams;

    // if (!percentage) {
    //   return { success: false, status: 400, error: "percentage is undefined" };
    // }
    console.log(`percentage: ${percentage} activated :${activate}`);

    const user = await User.findById(userId);
    const userFinance = await Finance.findById(user.finances);

    if (!userFinance) {
      return {
        success: false,
        status: 400,
        error: "User Finance is not found!",
      };
    }
    const spendAndSave = userFinance.wallets[0].spendAndSave;

    if (activate === false) {
      spendAndSave.activated = false;
      await userFinance.save();
      return { success: true, status: 200, data: "spend and save deactivated" };
    }

    spendAndSave.activated = true;
    spendAndSave.percentage = percentage;
    await userFinance.save();

    console.log(spendAndSave);
    return { success: true, status: 200, data: "spend and save activated" };
  } catch (err) {
    console.log(
      "Couldn't activate spend and save at activateSpendAndSave.js",
      err
    );
    return { success: false, status: 500, error: err };
  }
};

//##################################################################################################
//##################################################################################################

module.exports = { toggle_spend_and_save_activation };
