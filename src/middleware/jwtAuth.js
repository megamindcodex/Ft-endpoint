const { sign, verify } = require("jsonwebtoken");

const createToken = (userId) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!userId) {
      throw new Error("userId is undefined");
    }

    //   user Id passed as a parameter from the signupUser file
    // is been used as a payload in the generation of the json web token

    const accessToken = sign({ id: userId }, jwtSecret);
    if (!accessToken) {
      console.error(
        "Error generating access token. JWT_SECRET might be undefined."
      );
    } else {
      return accessToken;
    }
  } catch (err) {
    console.error("Error creating token", err.message, err);
    throw err;
  }
};

// Function to verify Token
const verifyToken = (req, res, next) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;

    //Logic to verify token
    const accessToken = req.cookies["fintech-access-token"];
    // console.log(accessToken);

    if (!accessToken)
      return res.status(401).json({ error: "Not Authenticated!" });

    const payload = verify(accessToken, jwtSecret);

    //variables can be created out of thing air using the req object and attacthing the name of the varibale.
    if (payload) {
      req.userId = payload.id; //true
      // console.log(payload.id);
      next();
    }
  } catch (err) {
    console.error("Error verifing token", err);
    throw err;
  }
};

module.exports = { createToken, verifyToken };
