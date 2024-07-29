const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../../middleware/jwtAuth");

const {
  toggle_spend_and_save_activation,
} = require("../../../controller/walletsLogic/spendAndSave/spendAndSaveActivation");

router.put("/spend_and_save_Activation", verifyToken, async (req, res) => {
  try {
    const requestData = req.body;

    if (!requestData) {
      console.error("requestData is undefined");
      res.status(400).json({ error: "requestData is undefined" });
    } else {
      for (let key in requestData) {
        if (requestData[key] === null) {
          console.error(`property ${key} is null.`);
          res
            .status(400)
            .json({ error: `property ${key} in requestData is null` });
          return { success: false, error: `property ${key} is null` };
        }
      }
    }

    const userId = req.userId;

    // run toggel_spend_and_save_activation function
    const result = await toggle_spend_and_save_activation(userId, requestData);

    if (!result.success) {
      return res.status(result.status).json({ error: result.error });
    }

    res.status(result.status).json({ data: result.data });
  } catch (err) {
    console.error("Couldn't activate spend and save", err.message, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
