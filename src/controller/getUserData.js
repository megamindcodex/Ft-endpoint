const User = require("../models/user");

const get_user_data = async (userId) => {
  try {
    if (!userId) {
      console.error("userId is undefined");
      return { success: false, status: 400, error: "userId is undefined" };
    }

    const user = await User.findById(userId).populate("finances").populate("transactions").populate("notification");
    // const user = await User.findById(userId);
    // const finance = await user.finances.populate("transactions");
    // console.log(finance)
    // console.log(user);
    if (!user) {
      return { success: false, status: 404, error: "User not Found!" };
    }

    return { success: true, status: 200, data: user };
  } catch (err) {
    console.error("Couldn't get user data", err.message, err);
    throw err;
  }
};

module.exports = { get_user_data };
