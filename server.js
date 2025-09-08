require("dotenv").config();
const cors = require('cors');
const userRoutes = require("./routes/userAuth");
const express=require('express');
const app=express();
const connectDB = require("./config/db");
// Connect to MongoDB
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: false,
}));

connectDB();

app.use(express.json());
app.use("/api", userRoutes);

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});