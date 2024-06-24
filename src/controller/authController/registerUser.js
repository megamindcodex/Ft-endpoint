const User = require("../../models/user.js");
const Finance = require("../../models/userFinance.js");

let errors = [];

const registerUser = async (formData) => {
  try {
    if (!formData) {
      console.error("formData is undefined");
    } else {
      for (let key in formData) {
        if (formData[key] === null) {
          console.error(`property ${key} is null.`);
        }
      }
    }
    // console.log(formData);
    const {
      fullName,
      phoneNumber,
      email,
      userName,
      gender,
      timeOfBirth,
      password,
    } = formData;

    const newUserFinance = {
      userName: userName,
      wallets: [
        { type: "Owealth", balance: 1000 },
        { type: "Spend and save", balance: 0 },
        { type: "Safe box", balance: 0 },
        { type: "Fixed saving", balance: 0 },
      ],
      // transactions: {},
    };

    const finance = await Finance.create(newUserFinance);

    if (!finance) {
      console.error("Error creating Finance object for user", err.message, err);
      return null;
    }

    const newBirthTime = {
      date: timeOfBirth.date,
      month: timeOfBirth.month,
      year: timeOfBirth.year,
    };

    const newUser = {
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      userName: userName,
      gender: gender,
      birth: newBirthTime,
      password: password,
      finances: finance._id,
      accountNumber: "0088456282",
    };
    console.log(newUser);
    const user = await User.create(newUser);
    return user;
  } catch (err) {
    console.error("Error Creating New user", err.message, err);
    throw err;
  }
};

const check_if_userName_exists = async (userName) => {
  try {
    const userNameExist = await User.exists({ userName });

    if (userNameExist !== null) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error Checking if User exists", err.message, err);
  }
};

const check_if_email_exists = async (email) => {
  try {
    const emailExist = await User.exists({ email });

    if (emailExist !== null) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error Checking if User exists", err.message, err);
  }
};

module.exports = {
  registerUser,
  check_if_userName_exists,
  check_if_email_exists,
};
