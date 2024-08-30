// All WEBHOOK Push Notification
const axios = require("axios")

const notify_client = async (notifyData) => {
    try {

        // const res = await axios.post("http://localhost:4500/api/notify", notifyData)
        const res = await axios.post("https://ft-websocket-endpoint.onrender.com", notifyData)

        if (res.status === 200)
            return { success: true, message: res.data.message }


    } catch (err) {
        console.error("Error running webhook push notification", err)
        return { success: false, error: err }
    }
}


module.exports = notify_client