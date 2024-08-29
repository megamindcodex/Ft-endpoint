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
    res.cookie("fintech-access-token", accessToken, {
      httpOnly: false, // Ensure this is false if you need to access the cookie in client-side JS
      secure: false, // Set to true if using HTTPS
      path: "/", // path for which the cookie is valid
      //this milliseconds is equivalent to 12 hours
      maxAge: 43200000,
      // domain: "http://localhost:5173/", // domain for which the cookie is valid
    });

    return res.status(200).json({ userData: result.data, message: "login successful" });
  } catch (err) {
    console.error("An error occurred at loginRoute", err.message, err);
    // Optionally, handle the error differently depending on its type or message
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
