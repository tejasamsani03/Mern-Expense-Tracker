
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import corsOptions from './config/corsOptions.js';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import userRoutes from './routes/users.js';

dotenv.config();

connectDB();

const app = express();

// Use detailed CORS options from the config file
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/user', userRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
