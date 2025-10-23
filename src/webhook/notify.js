// All WEBHOOK Push Notification
const axios = require("axios")

const notify_client = async (notifyData) => {
    try {

        // const res = await axios.post("http://192.168.2.121:4500/api/notify", notifyData)

        const res = await axios.post("http://192.168.127.103:4500/api/notify", notifyData)
        // const res = await axios.post("https://ft-websocket-endpoint.onrender.com/api/notify", notifyData)

        if (res.status === 200)
            console.log(res.message)
        return { success: true, message: res.data.message }


    } catch (err) {
        console.error("Error running webhook push notification", err)
        return { success: false, error: err }
    }
}


module.exports = notify_client