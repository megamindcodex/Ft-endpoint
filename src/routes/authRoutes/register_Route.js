const express = require("express");
const router = express.Router();
const { createToken } = require("../../middleware/jwtAuth");
const {
  registerUser,
  check_if_userName_exist,
  check_if_email_exist,
} = require("../../controller/authController/registerUser");

router.post("/sign-up", async (req, res) => {
  try {
    // The authencation middleware has already handled the authentication
    // and attatched the token to the request object.
    const formData = req.body;

    if (!formData) {
      console.log("formData is undefined");
      return res.status(400).json({ error: "formData is undefined" });
    } else if (formData === null) {
      console.log("formData is null");
      return res.status(400).json({ error: "formData is null" });
    }

    console.log(formData);
    const userNameExist = await check_if_userName_exist(formData.userName);
    const emailExist = await check_if_email_exist(formData.email);
    let errorMsg = [];

    if (userNameExist) {
      errorMsg.push("Username taken");
    }
    if (emailExist) {
      errorMsg.push("Email already in use");
    }

    if (errorMsg.length > 0) {
      res.status(409).json({ errors: errorMsg });
    } else {
      const user = await registerUser(formData);

      if (user) {
        const accessToken = createToken(user._id);

        if (accessToken) {
          // console.log("token generated:", accessToken);
          res.cookie("fintech-access-token", accessToken, {
            httpOnly: false, // Ensure this is false if you need to access the cookie in client-side JS
            secure: false, // Set to true if using HTTPS
            path: "/", // path for which the cookie is valid
            //this milliseconds is equivalent to 12 hours
            maxAge: 43200000,
          });
          res.status(201).json({ message: "Registration successful" });
        }
      }
    }
  } catch (err) {
    console.error("Error registering new user", err.message, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
