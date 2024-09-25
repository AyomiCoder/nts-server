require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes'); // Import note routes

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes
app.use('/api/auth', authRoutes);   // Authentication routes
app.use('/api', noteRoutes);   // Notes routes

app.get("/", (req, res) => {
    res.json({ data: "This is NTS server" });
});

app.listen(1040, () => {
    console.log(`Server is Listening on http://localhost:1040`);
});
