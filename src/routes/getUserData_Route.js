const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/jwtAuth");
const { get_user_data } = require("../controller/getUserData");

router.get("/get_user_data", verifyToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not Authorised" });
    }

    const user = await get_user_data(req.userId);

    if (!user) {
      // Respond with 404 Not Found if user is undefined
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`user found : ${user}`);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error runing get_user_data function", err.message, err);
    throw err;
  }
});

module.exports = router;
