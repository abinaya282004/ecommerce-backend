const express = require("express");
const { signup, login } = require("../controllers/auth.control");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);
 

router.get("/users", async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.put("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body, 
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;





