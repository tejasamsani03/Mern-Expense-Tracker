
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, mobile, password } = req.body;
  try {
    let user = await User.findOne({ mobile });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, mobile, password });
    await user.save();
    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (err) {
    console.error("REGISTER ERROR:", err); // Log the full error object
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { mobile, password } = req.body;
  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ success: true, token, user: { id: user._id, name: user.name } });

  } catch (err) {
    console.error("LOGIN ERROR:", err); // Log the full error object
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
