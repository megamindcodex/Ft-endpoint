const User = require("../../models/user");

// let userExist = true;
// let passwordMatch = true;
// let isMatch = false;

const loginUser = async (formData) => {
  try {
    const { email, password } = formData;
    const user = await User.findOne({ email: email });

    if (!user) {
      return { success: false, data: "User not found" };
    }

    // check if password matches
    if (password !== user.password) {
      return { success: false, data: "Incorrect password" };
    }

    // id this point is reached, both user exists and password matches
    console.log(user);
    return { success: true, data: user };
  } catch (err) {
    console.log("Error Logging in user", err.message, err);
    throw err;
  }
};

module.exports = { loginUser };
