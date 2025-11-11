
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // Ensure this file exists and connects to MongoDB
import authRoutes from './routes/auth.js';

dotenv.config();
connectDB(); // Uncomment to connect to MongoDB

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  // Using your frontend URL from the context
  origin: ["https://mern-expense-tracker-87jg.onrender.com", "http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true
}));
// Routes
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Backend live ✅" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
