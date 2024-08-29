const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { run_background_task } = require("./backgroundTask/orchestrator");

const app = express();

const environment = process.env.NODE_ENV || 'development'; // 'production' or 'development'

const envFile = environment === 'production' ? '.env.production' : '.env.development';

require("dotenv").config({ path: envFile });



// Specify multiple origins in an array
const allowedOrigins = ["http://localhost:5173", "https://ptf1k30m-5173.uks1.devtunnels.ms"];

app.use(
  cors({
    origin: (origin, callback) => {
      //Allow requests with no origin  (like module apps or curl request)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS polisy for this site does not allow access from the specific Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["content-type", "Authorization"],
    credentials: true,
    // Handle preflight requests
    // optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT
const connectDB = async () => {
  try {
    //connection URL
    const db_URI = process.env.DB_URI

    if (!db_URI) {
      console.error("mongodb URI is required");
    }

    //connect to mongoDB

    await mongoose.connect(db_URI);

    console.log("MongoDB connected.....✅ ");
  } catch (err) {
    console.error("Error connecting to MongoDB ❌:", err);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT} http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error starting server", err);
  }
};

// ################################################
const registerUserRoute = require("./routes/authRoutes/register_Route");
const loginUserRoute = require("./routes/authRoutes/login_Route");
const getUserDataRoute = require("./routes/getUserData_Route");
const updateNotificationRoute = require("./routes/updateNotification_Route")
const sendResetCodeRoute = require("./routes/authRoutes/sendResetCode_Route");
const resetPasswordRoute = require("./routes/authRoutes/resetPassword_Route");

// ################################################
const updatePasswordRoute = require("./routes/updatePassword_Route");

const transferFundsRoute = require("./routes/TransactionRoutes/transferFunds_Route");
const getTransactionsRoute = require("./routes/TransactionRoutes/getTransactions_Route");
const getReceiverUserName = require("./routes/TransactionRoutes/getReceiverUsername_Route");

const spendAndSaveActivationRoute = require("./routes/walletsRoutes/spendAndSave/spendAndSaveActivation_Route");
const withdrawSpendAndSaveRoute = require("./routes/walletsRoutes/spendAndSave/withdrawSpedAndSave_Route");

const saveToCashBox = require("./routes/walletsRoutes/cashBox/saveToCashBox_Route");

// use Auth Routes
app.use("/auth", registerUserRoute);
app.use("/auth", loginUserRoute);
app.use("/auth", sendResetCodeRoute);
app.use("/auth", resetPasswordRoute);

// ################################################

// use Api Routes
app.use("/api", getUserDataRoute);
app.use("/api", updateNotificationRoute)
app.use("/api", updatePasswordRoute);
app.use("/api", transferFundsRoute);
app.use("/api", getReceiverUserName);
app.use("/api", getTransactionsRoute);

app.use("/api", spendAndSaveActivationRoute);
app.use("/api", withdrawSpendAndSaveRoute);

app.use("/api", saveToCashBox);

// run_background_task();
startServer();
