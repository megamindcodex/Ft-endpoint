const Notification = require("../../models/notification")



const addNotification = async (notificationData, userName) => {
    try {


        const notification = await Notification.findOne({ userName: userName })

        if (!notification) {
            console.log(`${userName} Notification not found`)
            return { success: false, error: `${userName} Notification not found` }
        }



        notification.messages.push(notificationData)

        await notification.save()


        const recentNotification = notification.messages.find(message => message.subjectId === notificationData.subjectId)
        // console.log(`${userName} recent Notification ${recentNotification}`)
        return recentNotification

    } catch (err) {
        console.error("Error addding notification to database", err)
    }
}

module.exports = addNotification