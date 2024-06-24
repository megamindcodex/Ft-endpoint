const express = require("express");
const router = express.Router();
const { createToken } = require("../../middleware/jwtAuth");
// Import the loginUser function and error messages
const { loginUser } = require("../../controller/authController/loginUser");

//Route to validate user
router.post("/login", async (req, res) => {
  try {
    const formData = req.body;

    if (!formData) {
      throw new Error("formData is undefined");
    }

    const result = await loginUser(formData);

    // Check the result and send appropriate response
    if (!result.success) {
      //   console.log(result.success);
      return res.status(400).json({ error: result.data });
    }

    const accessToken = createToken(result.data._id);

    if (!accessToken) {
      throw new Error("accessToken is undefined");
    }
    res.cookie("fintech-access-token", accessToken, {
      //this milliseconds is equivalent to 12 hours
      maxAge: 43200000,
    });
    res.status(200).json(result.data);
  } catch (err) {
    console.error("An error occurred at loginRoute", err.message, err);
    // Optionally, handle the error differently depending on its type or message
  }
});

module.exports = router;
