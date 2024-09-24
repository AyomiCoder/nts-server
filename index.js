require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose")

mongoose.connect(config.connectionString)

const express = require('express')
const cors = require('cors')
const app = express()

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities")

app.use(express.json())

app.use(cors(
    {
        origin: "*"
    }
))

app.get("/", (req, res) => {
    res.json({ data: "This is NTS server" });
});

// Create Account
app.post("/register", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Full Name is required" });
    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is required" });
    }

})

app.listen(1040, () => {
    console.log(`Server is Listening on http://localhost:1040`)
})