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
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      console.error("Authorization header not set");
      return res.status(401).json({ error: "Authorization header not set" });
    }

    // Correctly split the header to get the token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.error("Invalid Authorization header format");
      return res.status(401).json({ error: "Invalid Authorization header format" });
    }

    const accessToken = parts[1];
    // console.log(`Access token: ${accessToken}`);

    if (!accessToken) {
      return res.status(401).json({ error: "No access token provided" });
    }

    // Verify the token
    const payload = jwt.verify(accessToken, jwtSecret);

    // Attach user ID to request object
    if (payload) {
      req.userId = payload.id;
      next();
    } else {
      return res.status(401).json({ error: "Invalid token" });
    }
  } catch (err) {
    console.error("Error verifying token", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};


module.exports = { createToken, verifyToken };
