const express = require("express");

const Product = require("../models/product");

const router = express.Router();

const jwt = require("jsonwebtoken");

const JWT_SECRET = "abi@28@07@04";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "Token is required." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = decoded;  
    next();  
  });
};


const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};


router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);

    await product.save();

    res.status(201).json({ message: "Product created successfully.", product });
  } catch (error) {

    res.status(500).json({ message: "Server error.", error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); 
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body, 
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product updated successfully.", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});



router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found." });
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

module.exports = router;
