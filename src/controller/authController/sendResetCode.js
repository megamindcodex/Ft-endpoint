const crypto = require("crypto");
const User = require("../../models/user");
const { send_email_to_user } = require("../sendEmail");

const send_reset_code = async (email) => {
  try {
    if (!email) {
      return { success: false, status: 400, data: "email is required" };
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return { success: false, status: 404, data: "User not found" };
    }
    user._resetCode = generateResetCode();
    await user.save();

    const message = {
      subject: "Password reset code",
      body: `Here is your password reset code ${user._resetCode}`,
    };
    const sentEmail = await send_email_to_user(user.email, message);

    // if there is an error sending a reset email to the user,
    // the function still returns a status of 200 but with and extra message.
    // therfore it also means the user's _resetCode property in the database was updated with a new code successfully
    if (!sentEmail.success) {
      return {
        success: true,
        status: 200,
        data: {
          email: user.email,
          message: "Error sending reset code to email. Try again",
        },
        ExtraData: sentEmail.data,
      };
    }

    // returns this if the reset email is sent successfully
    return {
      success: true,
      status: 200,
      data: {
        email: user.email,
        message: "Reset code sent to your email address",
      },
    };
  } catch (err) {
    console.error(err.message, err);
  }
};

const generateResetCode = () => {
  const code = crypto.randomBytes(3).toString("hex").slice(0, 6);
  console.log(code);
  return code;
};

module.exports = { send_reset_code };
