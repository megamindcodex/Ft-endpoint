const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const { verifyToken } = require("../../middleware/jwtAuth");
const {
  transfer_funds,
} = require("../../controller/TransactionLogics/transferFunds");

router.post("/tranfer_funds", verifyToken, async (req, res) => {
  try {
    const formData = req.body;

    if (!formData) {
      console.error("formData is undefined");
      res.status(400).json({ error: "formData is undefined" });
    } else {
      for (let key in formData) {
        if (formData[key] === null) {
          console.error(`property ${key} is null.`);
          res
            .status(400)
            .json({ error: `property ${key} in formData is null` });
          return { success: false, error: `property ${key} is null` };
        }
      }
    }

    const { accountNumber, amount } = formData;
    const senderId = req.userId;

    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ accountNumber: accountNumber });

    if (!receiver) {
      return res.status(404).json({ error: "Invalid account number" });
    }
    const transferParams = {
      senderUserName: sender.userName,
      receiverUserName: receiver.userName,
      amount: amount,
    };

    const result = await transfer_funds(transferParams);

    if (!result.success) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(200).json(result.data);
  } catch (err) {
    console.error(
      "Error running transfer_funds in /tranferFunds_Route.js",
      err.message,
      err
    );
  }
});

module.exports = router;
