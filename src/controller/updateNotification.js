const Notification = require("../models/notification")


const toggle_newMessage = async (notificationId, userName) => {
    try {

        // console.log(`${userName}: ${notificationId}`)
        const userNotification = await Notification.findOne({ userName: userName })

        if (!userNotification) {
            console.log("user notification not found")
            return { success: false }
        }

        // console.log(`user ${userNotification}`)
        const message = userNotification.messages.find(message => message.subjectId === notificationId)

        if (!message) {
            console.error("message not found")
            return { success: false }
        }

        message.newMessage = false

        await userNotification.save()

        return { success: true }
    } catch (err) {
        console.error("Error trying to toggle notification new message", err)
    }
}


module.exports = toggle_newMessage