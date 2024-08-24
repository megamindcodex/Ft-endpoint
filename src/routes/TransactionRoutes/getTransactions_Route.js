const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/jwtAuth");
const {
  get_user_transactions,
} = require("../../controller/TransactionLogics/getTransaction");

router.get("/get_user_transactions", verifyToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Not Authorized!" });
    }

    const result = await get_user_transactions(req.userId);

    if (!result.status) {
      return res.status(result.status).json({ error: result.error });
    }

    console.log(result.data.reverse());
    return res.status(200).json(result.data);
  } catch (err) {
    console.error("Error running get_user_transactions", err.message, err);
  }
});

module.exports = router;
