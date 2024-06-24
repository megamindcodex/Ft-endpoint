const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/jwtAuth");
const { update_user_password } = require("../controller/updatePassword");

router.put("/update_password", verifyToken, async (req, res) => {
  try {
    const formData = req.body;

    const userId = req.userId;
    const result = await update_user_password(formData, userId);

    if (!result.success) {
      return res.status(result.status).json({ error: result.error });
    }

    res.status(result.status).json(result.data);
  } catch (err) {
    console.error(
      "Error running update_user_password in updatePassword_Route",
      err.message,
      err
    );
  }
});

module.exports = router;
