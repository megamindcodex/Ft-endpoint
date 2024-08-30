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
      res.status(400).json({ error: "formData is undefined" });
    }

    const result = await loginUser(formData);

    // Check the result and send appropriate response
    if (!result.success) {
      //   console.log(result.success);
      return res.status(result.status).json({ error: result.error });
    }

    const accessToken = createToken(result.data._id);

    if (!accessToken) {
      throw new Error("accessToken is undefined");
    }

    if (!accessToken) {
      return res.status(400).json({ error: "No access token found." })
    }

    return res.status(200).json({ cookie: accessToken, userData: result.data, message: "login successful" });
  } catch (err) {
    console.error("An error occurred at loginRoute", err.message, err);
    // Optionally, handle the error differently depending on its type or message
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
