const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../../middleware/jwtAuth");
const {
  withdraw_spend_and_save,
} = require("../../../controller/walletsLogic/spendAndSave/withdrawSpendAndSave");

router.put("/withdraw_spend_and_save", verifyToken, async (req, res) => {
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

    // run withdraw_spend_and_save function
    const result = await withdraw_spend_and_save(userId, requestData);

    if (!result.success) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(result.status).json({ data: result.data });
  } catch (err) {
    console.error(
      "Error running withdrawSpendAndSave function in withdrawSpendAndSve_Route.js",
      err
    );
    const errorMessage = err.message;
    res.status(500).json({ error: "Internal server error", errorMessage });
  }
});

module.exports = router;
