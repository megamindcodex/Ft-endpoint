const express = require("express");
const router = express.Router();
const axios = require("axios")

const { verifyToken } = require("../middleware/jwtAuth");
const { get_user_data } = require("../controller/getUserData");

router.get("/get_user_data", verifyToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Not Authorised" });
    }

    const result = await get_user_data(req.userId);

    if (!result.success) {
      // Respond with 404 Not Found if user is undefined
      return res.status(result.status).json(result.error);
    }

    // console.log(`user found : ${result.data}`);
    res.status(200).json(result.data);
  } catch (err) {
    console.error("Error runing get_user_data function", err.message);
  }
});

module.exports = router;
