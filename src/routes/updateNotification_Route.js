const express = require("express")
const { verifyToken } = require("../middleware/jwtAuth")
const router = express.Router()
const User = require("../models/user")

const toggle_newMessage = require("../controller/updateNotification")


router.put("/update_notifications", verifyToken, async (req, res) => {
    try {
        const notificationIds = req.body
        // console.log("request body: ", notificationIds)
        const userId = req.userId

        const user = await User.findById(userId)

        notificationIds.forEach(element => {
            const result = toggle_newMessage(element, user.userName)
            // console.log(`toggle newMessage for ${element} success = ${result.success}`)
        });

        // console.log("updating notification done")
        return res.status(200).json({ message: "notification updated successfully" })

    } catch (err) {
        console.error("error Updating notification", err)
    }
})

module.exports = router