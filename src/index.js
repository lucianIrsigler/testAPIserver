const express = require('express');
const mongoose = require("mongoose");
const connectDB = require("./config/connectDB");
const app = express();

require("dotenv").config();
app.use(express.json());
const authorize = require("./routes/v1/authentication/authorize");
const token = require("./routes/v1/authentication/token");

//auth stuff
app.use("v1/authentication",authorize);
app.use("v1/authentication",token);


const PORT = process.env.PORT || 3000;

connectDB();
mongoose.connection.on("connected", async () => {
    console.log("SUCCESSFULLY CONNECTED TO DATABASE");
    app.listen(PORT, () => {
        console.log(`server listening on port: ${PORT}...`)
    });
});

mongoose.connection.on("disconnected", () => {
    console.log("Lost connection to database")
});

