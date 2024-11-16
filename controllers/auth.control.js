const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");


const JWT_SECRET = "abi@28@07@04"; 
const ADMIN_EMAIL = "abinaya282004@gmail.com";

exports.signup = async (req, res) => {
  const { name, email, password, role, address } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const assignedRole = email === ADMIN_EMAIL ? "admin" : role || "customer";

    const user = new User({
      name,
      email,
      password,
      role: assignedRole,
      address,
    });

    await user.save();

    res.status(201).json({ message: "Signup successful.", user: { id: user._id, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "2h" });

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
