const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const { verifyToken } = require("../../middleware/jwtAuth");

router.get("/get_receiver_userName", verifyToken, async (req, res) => {
  try {
    const accountNumber = req.query.accountNumber;
    console.log(req.params);

    if (accountNumber === undefined || accountNumber === null) {
      console.log("Account number is required");
      return res.status(400).json({ error: "Account number is required" });
    }
    // console.log(`account number: ${accountNumber}`);

    const user = await User.findById(req.userId);
    const userAccountNumber = user.accountNumber;

    const receiver = await User.findOne({ accountNumber: accountNumber });

    if (userAccountNumber === receiver.accountNumber) {
      return res.status(400).json({
        error: `${accountNumber} is your account number. You can only transfer funds to other acounts`,
      });
    }

    console.log(receiver);

    if (!receiver) {
      console.log("Receiver not found");
      return res.status(404).json({ error: "Invalid account number" });
    }

    console.log(receiver.userName);
    return res.status(200).json(receiver.userName);
  } catch (err) {
    console.error("Error getting receiver user name", err.message, err);
  }
});

module.exports = router;
