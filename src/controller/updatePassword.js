const User = require("../models/user");

const update_user_password = async (formData, userId) => {
  try {
    if (!formData) {
      console.error("formData is undefined");
      return { success: false, status: 400, error: "formData is undefined" };
    } else {
      for (let key in formData) {
        if (formData[key] === null) {
          console.error(`property ${key} is null.`);
          return {
            success: false,
            status: 400,
            error: `property ${key} is null`,
          };
        }
      }
    }

    const { oldPassword, newPassword } = formData;

    const user = await User.findById(userId);

    if (!user) {
      console.error(`user not found`);
      return { success: false, status: 404, error: "user is undefined" };
    }

    if (user.password !== oldPassword) {
      console.error("Old password is incorrect");
      return {
        success: false,
        status: 400,
        error: "Old password is incorrect",
      };
    }

    if (oldPassword === newPassword) {
      console.error("you can't use old password as new password");
      return {
        success: false,
        status: 400,
        error: "you can't use old password as new password",
      };
    }
    user.password = newPassword;
    await user.save();
    console.log("Password updated successfully");
    return {
      success: true,
      status: 200,
      data: "Password updated successfully",
    };
  } catch (err) {
    console.error("Couldn't update user password", err, err.message);
    throw err;
  }
};

module.exports = { update_user_password };
