const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Product=require("./models/product");


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); 


const JWT_SECRET = "abi@28@07@04"; 
const ADMIN_EMAIL = "abinaya282004@gmail.com";
const MONGO_URI = "mongodb+srv://abinaya282004:123@ecommerce.sixy3.mongodb.net/"; 
const PORT = 3000; 

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
    process.exit(1); 
  });


// Routes

const authRoutes = require("./routes/auth.route");

const productRoutes = require("./routes/product.route");

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
