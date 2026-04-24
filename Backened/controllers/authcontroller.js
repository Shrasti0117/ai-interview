const User = require("../models/user");
const AuthLog = require("../models/AuthLog");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const createAuthLog = async ({
  userId = null,
  action,
  status,
  name = "",
  email = "",
  message = "",
  ipAddress = "",
  userAgent = "",
}) => {
  try {
    await AuthLog.create({
      userId,
      action,
      status,
      name,
      email,
      message,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error("Auth log save failed:", error.message);
  }
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();
    const ipAddress = req.ip || req.socket?.remoteAddress || "";
    const userAgent = req.get("user-agent") || "";

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      await createAuthLog({
        action: "signup",
        status: "failed",
        name,
        email: normalizedEmail,
        message: "User already exists",
        ipAddress,
        userAgent,
      });
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

    await createAuthLog({
      userId: user._id,
      action: "signup",
      status: "success",
      name: user.name,
      email: user.email,
      message: "Signup successful",
      ipAddress,
      userAgent,
    });

    // Send response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    await createAuthLog({
      action: "signup",
      status: "failed",
      name: req.body?.name,
      email: (req.body?.email || "").trim().toLowerCase(),
      message: error.message,
      ipAddress: req.ip || req.socket?.remoteAddress || "",
      userAgent: req.get("user-agent") || "",
    });
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();
    const ipAddress = req.ip || req.socket?.remoteAddress || "";
    const userAgent = req.get("user-agent") || "";

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      await createAuthLog({
        action: "login",
        status: "failed",
        email: normalizedEmail,
        message: "Invalid credentials",
        ipAddress,
        userAgent,
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await createAuthLog({
        userId: user._id,
        action: "login",
        status: "failed",
        name: user.name,
        email: user.email,
        message: "Invalid credentials",
        ipAddress,
        userAgent,
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.lastLoginAt = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    await createAuthLog({
      userId: user._id,
      action: "login",
      status: "success",
      name: user.name,
      email: user.email,
      message: "Login successful",
      ipAddress,
      userAgent,
    });

    // Send response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    await createAuthLog({
      action: "login",
      status: "failed",
      email: (req.body?.email || "").trim().toLowerCase(),
      message: error.message,
      ipAddress: req.ip || req.socket?.remoteAddress || "",
      userAgent: req.get("user-agent") || "",
    });
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
