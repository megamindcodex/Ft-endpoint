const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;
const connectDB = async () => {
  try {
    //connection URL
    const db_URI = process.env.DB_URI;

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

const registerUserRoute = require("./routes/authRoutes/register_Route");
const loginUserRoute = require("./routes/authRoutes/login_Route");
const getUserDataRoute = require("./routes/getUserData_Route");
const sendResetCodeRoute = require("./routes/authRoutes/sendResetCode_Route");
const resetPasswordRoute = require("./routes/authRoutes/resetPassword_Route");

// ################################################
const updatePasswordRoute = require("./routes/updatePassword_Route");
const transferFundsRoute = require("./routes/TransactionRoutes/transferFunds_Route");

// use Routes
app.use("/auth", registerUserRoute);
app.use("/auth", loginUserRoute);
app.use("/auth", sendResetCodeRoute);
app.use("/auth", resetPasswordRoute);

// ################################################

// use Routes
app.use("/api", getUserDataRoute);
app.use("/api", updatePasswordRoute);
app.use("/api", transferFundsRoute);
startServer();
