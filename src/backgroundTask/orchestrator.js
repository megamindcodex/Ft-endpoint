// Orchestrator for background operations/task
const cron = require("node-cron"); // import node-cron
const { reset_users_daily_transaction } = require("./resetDailyTransaction"); //  import background task functions

const run_background_task = () => {
  try {
    // all users daily transaction reset result function
    // reset_users_daily_transaction();

    // node-crone syntax minutes(* 0-59), hours(* 0-23),  days(* 1-31), months(* 1-12), days of the week(0-7, 0and 7 represent sunday),
    cron.schedule("* * * * *", () => {
      console.log("Cron Job executed every minute");
      reset_users_daily_transaction();
    });
  } catch (err) {
    console.error("Internal server error: ", err);
  }
};

module.exports = { run_background_task };
