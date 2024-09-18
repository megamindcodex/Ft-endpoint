const User = require("../../models/user.js");
const Finance = require("../../models/userFinance.js");
const Transaction = require("../../models/Transaction.js");
const Notification = require("../../models/notification.js");
const crypto = require("crypto");

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
      // gender,
      // timeOfBirth,
      password,
    } = formData;

    const cashBox = {
      balance: 0,
      dailyInterest: 0,
      totalInterest: 0,
      autoSave: false,
    };

    const safeBox = {
      balance: 0,
      dailyInterest: 0,
      totalInterest: 0,
      autoSave: false,
      lastAutoSaved: Date.now(),
    };
    const spendAndSave = {
      balance: 0,
      activated: false,
      percentage: 0,
    };
    const fixedSaving = {
      balance: 0,
      activated: false,
    };
    const targetSaving = {
      activated: false,
      targets: [],
    };

    const newUserFinance = {
      userName: userName,
      mainBalance: 0,
      wallets: [
        {
          cashBox: cashBox,
          safeBox: safeBox,
          spendAndSave: spendAndSave,
          fixedSaving: fixedSaving,
          targetSaving: targetSaving,
        },
      ],
      dailyTransaction: 0,
      dailyTransactionLimit: 5000,
      dailyTransactionLastResetDate: Date.now(),
      locationMismatch: false,
      suspended: false,
      beneficiaries: []
    };


    const newTransaction = {
      userName: "pending",
      messages: [],
    };

    const newNotificaton = {
      userName: "pending",
      messages: []
    }





    const finance = await Finance.create(newUserFinance);

    if (!finance) {
      console.error("Error creating Finance object for user", err.message, err);
      return null;
    }


    const transactions = await Transaction.create(newTransaction);

    if (!transactions) {
      console.error("Error creating Transaction object for user", err.message, err);
      return null;
    }

    const notification = await Notification.create(newNotificaton)

    if (!notification) {
      console.error("Error creating Notification object for user", err.message, err);
      return null
    }

    // const newBirthTime = {
    //   date: timeOfBirth.date,
    //   month: timeOfBirth.month,
    //   year: timeOfBirth.year,
    // };

    const newUserObject = {
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      userName: userName,
      // gender: gender,
      // birth: newBirthTime,
      password: password,
      finances: finance._id,
      transactions: transactions._id,
      notification: notification._id,
      accountNumber: generateAccountNumber(),
    };
    // console.log(newUser);
    const newUser = await User.create(newUserObject);

    if (!newUser) {
      return { success: false, status: 400, error: "Error creating user" };
    }

    const user = await User.findById(newUser._id).populate("finances").populate("transactions").populate("notification");

    if (!user) {
      return { success: true, status: 400, error: "Error finding user" };
    }


    transactions.userName = user.userName
    notification.userName = user.userName
    await finance.save();
    await transactions.save()
    await notification.save()
    return { success: true, data: user };
  } catch (err) {
    console.error("Error Creating New user", err.message, err);
    return { success: false, status: 500, error: err };
  }
};

const check_if_userName_exist = async (userName) => {
  try {
    const userNameExist = await User.exists({ userName });

    if (userNameExist) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error Checking if User exists", err.message, err);
  }
};

const check_if_email_exist = async (email) => {
  try {
    const emailExist = await User.exists({ email });

    if (emailExist) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error Checking if User exists", err.message, err);
  }
};

const generateAccountNumber = () => {
  // Generate 10 random bytes (enough for 20 digits)
  const buffer = crypto.randomBytes(7);

  // Convert each byte to a digit (0-9) by taking modulo 10
  const digits = Array.from(buffer, (byte) => (byte % 10).toString());

  // Join the digits into a single string and prepend '149'
  return "149" + digits.join("").slice(0, 7);
};

module.exports = {
  registerUser,
  check_if_userName_exist,
  check_if_email_exist,
};
