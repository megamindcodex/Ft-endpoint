const User = require("../../models/user");
const { send_email_to_user } = require("../sendEmail");

const reset_password = async (formData) => {
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
            error: `property ${key} is null.`,
          };
        }
      }
    }

    const { email, newPassword, resetCode } = formData;
    const user = await User.findOne({ email: email });

    if (!user) {
      return { success: false, status: 404, error: "User not found" };
    }

    if (resetCode !== user._resetCode) {
      return { success: false, status: 400, error: "Invalid reset code" };
    }

    user.password = newPassword;
    user._resetCode = "000";

    const saveUser = await user.save();

    if (!saveUser) {
      return { success: false, status: 500, error: "something went wrong" };
    }

    const message = {
      subject: "Password changed",
      body: "your password was changed",
    };
    // const emailSent =
    await send_email_to_user(email, message);

    // if (!emailSent) {
    //   return {
    //     success: false,
    //     status: 404,
    //     data: "opps!...something went wrong, please try again",
    //   };
    // }

    return {
      success: true,
      status: 200,
      data: "Password Reset was successfull",
    };
  } catch (err) {
    console.error("Error on reset_password function", err.message, err);
    throw err;
  }
};

module.exports = { reset_password };
