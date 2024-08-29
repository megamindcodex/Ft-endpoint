const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    messages: [
        {
            title: {
                type: String,
                required: true
            },
            subject: {
                type: String,
                required: true
            },
            subjectId: {
                type: String,
                required: true
            },
            read: {
                type: Boolean,
                required: true
            },
            newMessage: {
                type: Boolean,
                required: true
            }
        }
    ]
})

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = Notification