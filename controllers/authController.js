const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { fullName, email, password } = req.body;

    // Check if required fields are provided
    if (!fullName || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    // Check if user already exists
    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

    // Exclude password from the response
    const userWithoutPassword = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdOn: user.createdOn
    };

    return res.json({
        user: userWithoutPassword,
        accessToken,
        message: "Registration Successful",
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: true, message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: true, message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: true, message: "Invalid email or password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

    // Respond with the token
    return res.json({
        accessToken,
        message: "Login Successful"
    });
};

const getUser = async (req, res) => {
    try {
        // Find the user by ID (from the token or session)
        const userId = req.user.userId; // Adjust this if your token has a different structure
        const user = await User.findById(userId).select('fullName email'); // Select only fullName and email

        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        return res.json({
            error: false,
            user: {
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: true, message: "An error occurred while fetching user data" });
    }
};

// Export the functions
module.exports = { register, login, getUser };
