const express = require("express");
const router = express.Router();
const {
  reset_password,
} = require("../../controller/authController/resetpassword");

router.post("/reset_password", async (req, res) => {
  try {
    const formData = req.body;
    const result = await reset_password(formData);

    if (!result.success) {
      res.status(result.status).json({ error: result.error });
    } else {
      res.status(result.status).json(result.data);
    }
  } catch (err) {
    console.error("Error in password reset Route", err.message, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
