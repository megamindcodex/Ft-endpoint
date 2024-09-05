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

    if (userNameExist) {
      return res.status(409).json({ error: "Username already in use" });
    }
    if (emailExist) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const result = await registerUser(formData);

    if (!result.success) {

      return res.status(result.status).json({ error: result.error })

    }




    const accessToken = createToken(result.data._id);

    // if (!accessToken) { 

    // }
    return res.status(201).json({ cookie: accessToken, userData: result.data, message: "Signup successful" });
  } catch (err) {
    console.error("Error registering new user", err.message, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
