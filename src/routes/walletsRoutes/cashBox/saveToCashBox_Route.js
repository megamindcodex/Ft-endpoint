const express = require("express");
const router = express.Router();
const User = require("../../../models/user");
const { verifyToken } = require("../../../middleware/jwtAuth");
const {
  save_to_cashBox,
} = require("../../../controller/walletsLogic/cashBox/saveToCashBox");

router.put("/save_to_cashBox", verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!req.body) {
      return res
        .status(400)
        .json({ error: "requestData is undefined or required" });
    }
    const userId = req.userId;

    if (!userId) {
      throw Error("userId is undefined or required");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const dataParams = {
      financeId: user.finances,
      amount: amount,
    };

    const result = await save_to_cashBox(dataParams);

    if (!result.success) {
      return res.status(result.status).json({ error: result.error });
    }

    res.status(200).json({ data: result.data });
  } catch (err) {
    console.error("Internal server error: ", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
