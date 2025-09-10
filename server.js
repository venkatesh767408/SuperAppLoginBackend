
const cors = require('cors');
const userRoutes = require("./routes/userAuth");
const express=require('express');
const app=express();
const connectDB = require("./config/db");
const expenseRoutes = require('./routes/expenses');
const memberRoutes = require('./routes/members');
// Connect to MongoDB
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: false,
}));
require("dotenv").config();
connectDB();

app.use(express.json());
app.use("/api", userRoutes);
app.use('/api', expenseRoutes);
app.use('/api', memberRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});