
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // Ensure this file exists and connects to MongoDB
import morgan from 'morgan';
import corsOptions from './config/corsOptions.js'; // Import corsOptions
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(express.json());

// Add request logging for development
app.use(morgan('dev'));

app.use(cors(corsOptions)); // Use the imported corsOptions
// Routes
app.use("/api/auth", authRoutes);
app.use('/api/expenses', expenseRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Backend live ✅" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
