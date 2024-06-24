const express = require("express");
const router = express.Router();
const { createToken } = require("../../middleware/jwtAuth");
const {
  registerUser,
  check_if_userName_exists,
  check_if_email_exists,
} = require("../../controller/authController/registerUser");

router.post("/sign-up", async (req, res) => {
  try {
    // The authencation middleware has already handled the authentication
    // and attatched the token to the request object.
    const formData = req.body;

    if (!formData) {
      throw new Error("formData is undefined");
    }
    // console.log(formData);
    const userNameExist = await check_if_userName_exists(formData.userName);
    const emailExist = await check_if_email_exists(formData.email);
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
            //this milliseconds is equivalent to 12 hours
            maxAge: 43200000,
          });
          res.status(201).json({ message: "Registration successful" });
        }
      }
    }
  } catch (err) {
    console.error("Error registering new user", err.message, err);
  }
});

module.exports = router;
