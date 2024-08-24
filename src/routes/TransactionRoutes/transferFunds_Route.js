const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const { verifyToken } = require("../../middleware/jwtAuth");
const {
  transfer_funds,
} = require("../../controller/TransactionLogics/transferFunds");
const {
  add_to_spend_and_save,
} = require("../../controller/walletsLogic/spendAndSave/addToSpendAndSave");

router.post("/transfer_funds", verifyToken, async (req, res) => {
  try {
    const formData = req.body;
    // console.log(formData);

    const { accountNumber, amount, description } = formData;
    const senderId = req.userId;

    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ accountNumber: accountNumber });

    if (!receiver) {
      return res.status(404).json({ error: "Invalid account number" });
    }

    if (receiver.accountNumber === sender.accountNumber) {
      return res.status(400).json({
        error: `${accountNumber} is your account number. You can only transfer funds to other acounts`,
      });
    }
    const transferParams = {
      senderUserName: sender.userName,
      senderAccount: sender.accountNumber,
      receiverUserName: receiver.userName,
      receiverAccount: receiver.accountNumber,
      amount: amount,
      description: description,
      senderFinanceId: sender.finances,
      receiverFinanceId: receiver.finances,
    };

    const result = await transfer_funds(transferParams);

    if (!result.success) {
      return res.status(result.status).json({ error: result.error });
    }

    res.status(200).json(result.data);
    console.log(result.data);
    const spendAndSaveParams = {
      fundSpent: amount,
      financeId: sender.finances,
    };
    await add_to_spend_and_save(spendAndSaveParams);
  } catch (err) {
    console.error(
      "Error running transfer_funds in /tranferFunds_Route.js",
      err.message,
      err
    );
    res.status(500).json({ error: err });
  }
});

module.exports = router;
