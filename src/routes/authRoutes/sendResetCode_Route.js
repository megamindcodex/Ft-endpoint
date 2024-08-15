const express = require("express");
const router = express.Router();
const {
  send_reset_code,
} = require("../../controller/authController/sendResetCode");

router.post("/send_reset_code", async (req, res) => {
  try {
    const { email } = req.body;

    const result = await send_reset_code(email);

    if (!result.success) {
      return res.status(result.status).json({ error: result.data });
    }

    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error(
      "Error sending reset code at sendResetCode_Route",
      err.message,
      err
    );
  }
});

module.exports = router;
