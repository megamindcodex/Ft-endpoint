const { promises } = require("nodemailer/lib/xoauth2");
const User = require("../models/user");
const Finance = require("../models/userFinance");

const reset_users_daily_transaction = async () => {
  try {
    const allUserFinance = await Finance.find();
    let allUserFinanceToUpdate = [];

    // Filter users whose dailyTransactionLastResetDate is 24 hours ago or more
    const userFinance = allUserFinance.forEach(async (userFinance) => {
      // const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
      const threeMilliSeconds = 30 * 1000;
      const now = Date.now();
      console.log();

      const lastResetDate = new Date(
        userFinance.dailyTransactionLastResetDate
      ).getTime();

      const timeDifference = now - lastResetDate;

      if (timeDifference >= threeMilliSeconds) {
        allUserFinanceToUpdate.push(userFinance);
      }
    });

    if (allUserFinanceToUpdate.length === 0) {
      console.log("No userFinances to reset at the moment");
      return {
        success: true,
        message: "No userFinance to reset at the moment",
      };
    }

    // Reset dailyTransaction for usersToUpdate
    const results = await Promise.all(
      allUserFinanceToUpdate.map(resetDailyTransaction)
    );

    // Log results or handle them as needed
    results.forEach((result, index) => {
      if (!result.success) {
        console.error(
          `Failed to reset for user ${allUserFinanceToUpdate[index].userName}: `,
          result.error
        );
      } else {
        console.log(
          `Daily transaction for user ${allUserFinanceToUpdate[index].userName} has been reset successfully`
        );
      }
    });

    return {
      success: true,
      message: "Daily transaction successfully reset for eligibale users.",
    };
  } catch (err) {
    console.log("Error runing reset function in resetDailyTransaction.js", err);
    return {
      success: false,
      error: "Internal server error: ",
      err,
    };
  }
};

// Function to reset user's daily transaction
const resetDailyTransaction = async (userFinance) => {
  try {
    if (!userFinance || userFinance === null) {
      console.error("userFinance undefined or null");
      return { success: false, error: "userFinance undefined or null" };
    }
    userFinance.dailyTransaction = 0;
    userFinance.dailyTransactionLastResetDate = Date.now();

    await userFinance.save();

    return { success: true, data: userFinance };
    // console.log(userFinanceToReset);
  } catch (err) {
    console.error(
      "error reseting user daily transaction : Internal server error:",
      err
    );
    return {
      success: false,
      error: "error reseting user daily transaction : Internal server error: ",
      err,
    };
  }
};

module.exports = { reset_users_daily_transaction };
